/**
 * ResuMind - Lightweight Persistent Data Storage
 * Persists job application tracking, notes, and analysis history to JSON files.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', '..', 'data');
const APPS_FILE = path.join(DATA_DIR, 'applications.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadApplications() {
  try {
    ensureDataDir();
    if (!fs.existsSync(APPS_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(APPS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading applications:', err.message);
    return [];
  }
}

function saveApplications(apps) {
  try {
    ensureDataDir();
    fs.writeFileSync(APPS_FILE, JSON.stringify(apps, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving applications:', err.message);
    return false;
  }
}

class DataStore {
  constructor() {
    this.applications = loadApplications();
    // Seed initial demo data if empty so the UI looks active right away
    if (this.applications.length === 0) {
      this.seedInitialData();
    }
  }

  seedInitialData() {
    const sampleApps = [
      {
        id: crypto.randomUUID(),
        company: 'Stripe',
        role: 'Senior Full Stack Engineer',
        location: 'Remote / San Francisco',
        salary: '$180,000 - $215,000',
        matchScore: 88,
        status: 'Interviewing',
        dateApplied: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
        notes: 'Round 1 technical screen completed. System design interview scheduled for next Tuesday.'
      },
      {
        id: crypto.randomUUID(),
        company: 'Vercel',
        role: 'Senior Frontend Architect',
        location: 'Remote',
        salary: '$175,000 - $205,000',
        matchScore: 92,
        status: 'Applied',
        dateApplied: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
        notes: 'Submitted customized resume with Next.js & Server Components focus.'
      },
      {
        id: crypto.randomUUID(),
        company: 'Datadog',
        role: 'Backend Platform Engineer',
        location: 'New York, NY',
        salary: '$165,000 - $190,000',
        matchScore: 78,
        status: 'Saved',
        dateApplied: null,
        notes: 'Need to add Go and distributed tracing keywords before applying.'
      }
    ];

    this.applications = sampleApps;
    saveApplications(this.applications);
  }

  getAllApplications() {
    return this.applications;
  }

  getApplicationById(id) {
    return this.applications.find(a => a.id === id) || null;
  }

  createApplication(data) {
    const newApp = {
      id: crypto.randomUUID(),
      company: data.company || 'Unnamed Company',
      role: data.role || 'Job Candidate',
      location: data.location || 'Remote',
      salary: data.salary || 'Competitive',
      matchScore: Number(data.matchScore) || 75,
      status: data.status || 'Saved', // Saved, Applied, Interviewing, Offer, Rejected
      dateApplied: data.dateApplied || (data.status !== 'Saved' ? new Date().toISOString().split('T')[0] : null),
      notes: data.notes || '',
      createdAt: new Date().toISOString()
    };

    this.applications.unshift(newApp);
    saveApplications(this.applications);
    return newApp;
  }

  updateApplication(id, updates) {
    const index = this.applications.findIndex(a => a.id === id);
    if (index === -1) return null;

    this.applications[index] = {
      ...this.applications[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    saveApplications(this.applications);
    return this.applications[index];
  }

  deleteApplication(id) {
    const initialLength = this.applications.length;
    this.applications = this.applications.filter(a => a.id !== id);
    if (this.applications.length !== initialLength) {
      saveApplications(this.applications);
      return true;
    }
    return false;
  }

  getStats() {
    const total = this.applications.length;
    const interviewing = this.applications.filter(a => a.status === 'Interviewing').length;
    const applied = this.applications.filter(a => a.status === 'Applied').length;
    const offers = this.applications.filter(a => a.status === 'Offer').length;
    const saved = this.applications.filter(a => a.status === 'Saved').length;

    const interviewRate = total > 0 ? Math.round(((interviewing + offers) / Math.max(1, total - saved)) * 100) : 0;

    return {
      total,
      applied,
      interviewing,
      offers,
      saved,
      interviewRate: Math.min(100, interviewRate)
    };
  }
}

module.exports = new DataStore();
