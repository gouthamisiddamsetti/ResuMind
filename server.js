/**
 * ResuMind - Server
 * High-performance, zero-external-dependency Node.js HTTP server.
 * Handles static asset delivery and REST API endpoints.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const { analyzeResumeAgainstJob } = require('./src/analyzer/atsEngine');
const { optimizeBulletPoint } = require('./src/ai/bulletOptimizer');
const { generateProfessionalSummary } = require('./src/ai/summaryGenerator');
const dataStore = require('./src/storage/dataStore');
const { SAMPLE_RESUMES, SAMPLE_JOB_DESCRIPTIONS } = require('./src/samples/sampleData');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const PUBLIC_DIR = path.join(__dirname, 'public');
const APPLICATION_STATUSES = new Set(['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected']);
const APPLICATION_FIELDS = new Set([
  'company',
  'role',
  'location',
  'salary',
  'matchScore',
  'status',
  'dateApplied',
  'notes'
]);
const APPLICATION_TEXT_FIELDS = new Set(['company', 'role', 'location', 'salary', 'notes']);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff'
};

/**
 * Read request body safely
 */
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      // Protect against oversized payload (5MB max)
      if (body.length > 5 * 1024 * 1024) {
        reject(new Error('Request payload exceeds limit of 5MB'));
      }
    });
    req.on('end', () => {
      if (!body) {
        return resolve({});
      }
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', reject);
  });
}

/**
 * Send JSON response helper
 */
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

function validateApplicationPayload(payload, partial = false) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { error: 'Request body must be a JSON object.' };
  }

  const fields = Object.keys(payload);
  const unknownFields = fields.filter(field => !APPLICATION_FIELDS.has(field));
  if (unknownFields.length > 0) {
    return { error: `Unsupported application field: ${unknownFields[0]}.` };
  }

  if (fields.length === 0) {
    return { error: 'Provide at least one application field to update.' };
  }

  if (!partial) {
    for (const field of ['company', 'role']) {
      if (typeof payload[field] !== 'string' || !payload[field].trim()) {
        return { error: `${field} is required and must be a non-empty string.` };
      }
    }
  }

  const normalized = { ...payload };
  for (const field of fields) {
    const value = payload[field];
    if (APPLICATION_TEXT_FIELDS.has(field)) {
      if (typeof value !== 'string' || (field !== 'notes' && !value.trim())) {
        return { error: `${field} must be ${field === 'notes' ? 'a string' : 'a non-empty string'}.` };
      }
      normalized[field] = field === 'notes' ? value : value.trim();
    } else if (field === 'status') {
      if (typeof value !== 'string' || !APPLICATION_STATUSES.has(value)) {
        return { error: 'status must be one of Saved, Applied, Interviewing, Offer, or Rejected.' };
      }
    } else if (field === 'matchScore') {
      const score = typeof value === 'string' && value.trim() ? Number(value) : value;
      if (typeof score !== 'number' || !Number.isFinite(score) || score < 0 || score > 100) {
        return { error: 'matchScore must be a number between 0 and 100.' };
      }
      normalized.matchScore = score;
    } else if (field === 'dateApplied') {
      const parsedDate = typeof value === 'string' ? new Date(`${value}T00:00:00.000Z`) : null;
      if (value !== null && (
        typeof value !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
        Number.isNaN(parsedDate.getTime()) ||
        parsedDate.toISOString().slice(0, 10) !== value
      )) {
        return { error: 'dateApplied must be a YYYY-MM-DD date or null.' };
      }
    }
  }

  return { value: normalized };
}

/**
 * Serve static files from /public
 */
function serveStaticFile(req, res, pathname) {
  let relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
  let filePath = path.join(PUBLIC_DIR, relativePath);

  // Security check: prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Access denied');
  }

  // If path is a directory, append index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback: if not found and doesn't have an extension, try index.html (SPA fallback)
      const fallbackPath = path.join(PUBLIC_DIR, 'index.html');
      if (fs.existsSync(fallbackPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return fs.createReadStream(fallbackPath).pipe(res);
      }
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
    });

    fs.createReadStream(filePath).pipe(res);
  });
}

/**
 * Request handler
 */
async function handleRequest(req, res) {
  const reqUrl = new URL(req.url, 'http://localhost');
  const pathname = reqUrl.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  try {
    // API Routes
    if (pathname.startsWith('/api/')) {
      // Health Check
      if (pathname === '/api/health' && method === 'GET') {
        return sendJSON(res, 200, {
          status: 'ok',
          service: 'ResuMind API',
          version: '1.0.0',
          uptime: Math.round(process.uptime()),
          timestamp: new Date().toISOString()
        });
      }

      // ATS Resume Analysis Endpoint
      if (pathname === '/api/analyze' && method === 'POST') {
        const body = await parseRequestBody(req);
        const { resumeText, jobDescription } = body;

        if (!resumeText || typeof resumeText !== 'string' || !resumeText.trim()) {
          return sendJSON(res, 400, { error: 'Please provide resumeText to analyze.' });
        }

        const result = analyzeResumeAgainstJob(resumeText, jobDescription || '');
        return sendJSON(res, 200, result);
      }

      // AI Bullet Point Optimizer Endpoint
      if (pathname === '/api/optimize-bullet' && method === 'POST') {
        const body = await parseRequestBody(req);
        const { bullet, role } = body;

        if (!bullet || typeof bullet !== 'string' || !bullet.trim()) {
          return sendJSON(res, 400, { error: 'Please provide bullet point text.' });
        }

        const result = optimizeBulletPoint(bullet, role || 'Software Engineer');
        return sendJSON(res, 200, result);
      }

      // AI Professional Summary Generator Endpoint
      if (pathname === '/api/generate-summary' && method === 'POST') {
        const body = await parseRequestBody(req);
        const result = generateProfessionalSummary({
          targetRole: body.targetRole,
          yearsExperience: body.yearsExperience,
          keySkills: body.keySkills,
          specialty: body.specialty
        });
        return sendJSON(res, 200, result);
      }

      // Job Applications Tracker
      if (pathname === '/api/applications') {
        if (method === 'GET') {
          const apps = dataStore.getAllApplications();
          const stats = dataStore.getStats();
          return sendJSON(res, 200, { applications: apps, stats });
        }

        if (method === 'POST') {
          const body = await parseRequestBody(req);
          const validation = validateApplicationPayload(body);
          if (validation.error) return sendJSON(res, 400, { error: validation.error });
          const newApp = dataStore.createApplication(validation.value);
          return sendJSON(res, 201, newApp);
        }
      }

      // Single Application Actions: /api/applications/:id
      const appMatch = pathname.match(/^\/api\/applications\/([a-zA-Z0-9_-]+)$/);
      if (appMatch) {
        const appId = appMatch[1];

        if (method === 'GET') {
          const app = dataStore.getApplicationById(appId);
          if (!app) return sendJSON(res, 404, { error: 'Application not found' });
          return sendJSON(res, 200, app);
        }

        if (method === 'PUT') {
          const body = await parseRequestBody(req);
          const validation = validateApplicationPayload(body, true);
          if (validation.error) return sendJSON(res, 400, { error: validation.error });
          const updated = dataStore.updateApplication(appId, validation.value);
          if (!updated) return sendJSON(res, 404, { error: 'Application not found' });
          return sendJSON(res, 200, updated);
        }

        if (method === 'DELETE') {
          const deleted = dataStore.deleteApplication(appId);
          if (!deleted) return sendJSON(res, 404, { error: 'Application not found' });
          return sendJSON(res, 200, { success: true, message: 'Application deleted successfully' });
        }
      }

      // Sample Data Endpoint
      if (pathname === '/api/samples' && method === 'GET') {
        return sendJSON(res, 200, {
          resumes: SAMPLE_RESUMES,
          jobs: SAMPLE_JOB_DESCRIPTIONS
        });
      }

      // Unmatched API endpoint
      return sendJSON(res, 404, { error: `Endpoint ${pathname} not found` });
    }

    // Static Assets
    serveStaticFile(req, res, pathname);
  } catch (err) {
    console.error('Request handler error:', err);
    sendJSON(res, 500, { error: 'Internal Server Error', message: err.message });
  }
}

const server = http.createServer(handleRequest);

function startServer(port = PORT, host = HOST) {
  return new Promise((resolve) => {
    server.listen(port, host, () => {
      console.log(`\n==============================================`);
      console.log(`🚀 ResuMind - AI Resume Analyzer & ATS Optimizer`);
      console.log(`   Running on: http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`);
      console.log(`==============================================\n`);
      resolve(server);
    });
  });
}

if (require.main === module) {
  startServer();
}

module.exports = {
  server,
  startServer,
  handleRequest
};
