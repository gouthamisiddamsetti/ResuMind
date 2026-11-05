const { test, describe } = require('node:test');
const assert = require('node:assert');
const { EventEmitter } = require('node:events');
const { handleRequest } = require('../server');

/**
 * Helper to simulate an HTTP request directly into handleRequest without opening TCP sockets
 */
function invokeRoute(url, { method = 'GET', body = null, headers = {} } = {}) {
  return new Promise((resolve) => {
    // Mock IncomingMessage
    const req = new EventEmitter();
    req.url = url;
    req.method = method;
    req.headers = { ...headers };

    // Mock ServerResponse
    let statusCode = 200;
    const responseHeaders = {};
    let responseData = '';

    const res = {
      writeHead(code, h = {}) {
        statusCode = code;
        Object.assign(responseHeaders, h);
      },
      setHeader(name, val) {
        responseHeaders[name] = val;
      },
      end(data) {
        if (data) responseData += data;
        let parsed = null;
        try {
          parsed = JSON.parse(responseData);
        } catch {
          parsed = responseData;
        }
        resolve({
          statusCode,
          headers: responseHeaders,
          data: parsed,
          rawText: responseData
        });
      }
    };

    // Invoke server handler
    handleRequest(req, res);

    // Emit payload chunks and finish
    if (body !== null) {
      const payloadStr = typeof body === 'string' ? body : JSON.stringify(body);
      req.emit('data', payloadStr);
    }
    req.emit('end');
  });
}

describe('ResuMind REST API Endpoints', () => {
  test('GET /api/health returns 200 and server status', async () => {
    const res = await invokeRoute('/api/health');
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data.status, 'ok');
    assert.strictEqual(res.data.service, 'ResuMind API');
  });

  test('GET /api/samples returns sample resumes and job postings', async () => {
    const res = await invokeRoute('/api/samples');
    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.data.resumes.seniorFullStack);
    assert.ok(res.data.jobs.seniorFullStackJob);
  });

  test('POST /api/analyze returns comprehensive ATS analysis', async () => {
    const res = await invokeRoute('/api/analyze', {
      method: 'POST',
      body: {
        resumeText: 'Jane Doe\njane@example.com | 555-0100\nEXPERIENCE\n- Spearheaded Node.js API development with 99.9% uptime.\nSKILLS\nNode.js, TypeScript, AWS',
        jobDescription: 'Seeking Senior Engineer with Node.js, TypeScript, Docker, and AWS skills.'
      }
    });

    assert.strictEqual(res.statusCode, 200);
    assert.ok(typeof res.data.overallScore === 'number');
    assert.ok(res.data.breakdown.keywordMatch);
    assert.ok(res.data.actionPlan);
  });

  test('POST /api/analyze rejects empty resumeText with 400', async () => {
    const res = await invokeRoute('/api/analyze', {
      method: 'POST',
      body: { resumeText: '' }
    });

    assert.strictEqual(res.statusCode, 400);
    assert.ok(res.data.error);
  });

  test('POST /api/optimize-bullet generates 3 STAR variations', async () => {
    const res = await invokeRoute('/api/optimize-bullet', {
      method: 'POST',
      body: {
        bullet: 'Worked on payment processing integration',
        role: 'Full Stack Engineer'
      }
    });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data.variations.length, 3);
  });

  test('POST /api/generate-summary returns tailored summaries', async () => {
    const res = await invokeRoute('/api/generate-summary', {
      method: 'POST',
      body: {
        targetRole: 'Senior Cloud Architect',
        yearsExperience: 8,
        keySkills: ['AWS', 'Kubernetes', 'Terraform', 'Go'],
        specialty: 'high-availability cloud systems'
      }
    });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data.options.length, 3);
  });

  test('Application Tracker CRUD lifecycle', async () => {
    // 1. Create
    const createRes = await invokeRoute('/api/applications', {
      method: 'POST',
      body: {
        company: 'Figma',
        role: 'Design Systems Engineer',
        salary: '$165,000',
        matchScore: 89,
        status: 'Applied'
      }
    });
    assert.strictEqual(createRes.statusCode, 201);
    const appId = createRes.data.id;
    assert.ok(appId);

    // 2. Read
    const getRes = await invokeRoute(`/api/applications/${appId}`);
    assert.strictEqual(getRes.statusCode, 200);
    assert.strictEqual(getRes.data.company, 'Figma');

    // 3. Update
    const updateRes = await invokeRoute(`/api/applications/${appId}`, {
      method: 'PUT',
      body: { status: 'Interviewing', notes: 'Recruiter phone screen passed.' }
    });
    assert.strictEqual(updateRes.statusCode, 200);
    assert.strictEqual(updateRes.data.status, 'Interviewing');

    // 4. Delete
    const deleteRes = await invokeRoute(`/api/applications/${appId}`, {
      method: 'DELETE'
    });
    assert.strictEqual(deleteRes.statusCode, 200);
    assert.strictEqual(deleteRes.data.success, true);
  });
});
