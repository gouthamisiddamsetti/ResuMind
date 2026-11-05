/**
 * ResuMind - Main Client Application
 * Handles tab routing, theme management, and global toast notifications.
 */

window.ResuMind = {
  state: {
    activeTab: 'analyzer',
    theme: localStorage.getItem('resumind-theme') || 'dark',
    sampleData: null,
    currentAnalysis: null
  },

  init() {
    this.applyTheme(this.state.theme);
    this.bindEvents();
    this.loadSampleData();
  },

  applyTheme(theme) {
    this.state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('resumind-theme', theme);
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    }
  },

  toggleTheme() {
    const nextTheme = this.state.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(nextTheme);
  },

  bindEvents() {
    // Nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const target = e.currentTarget.getAttribute('data-tab');
        this.switchTab(target);
      });
    });

    // Theme toggle button
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Sample picker
    const sampleSelect = document.getElementById('sample-select');
    if (sampleSelect) {
      sampleSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (!val) return;
        this.loadSampleProfile(val);
      });
    }
  },

  switchTab(tabId) {
    this.state.activeTab = tabId;

    document.querySelectorAll('.nav-tab').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });

    document.querySelectorAll('.tab-content').forEach(section => {
      section.classList.toggle('active', section.id === `tab-${tabId}`);
    });

    // Refresh tab views if needed
    if (tabId === 'tracker' && window.TrackerView) {
      window.TrackerView.fetchApplications();
    }
  },

  async loadSampleData() {
    try {
      const res = await fetch('/api/samples');
      if (res.ok) {
        this.state.sampleData = await res.json();
      }
    } catch (err) {
      console.warn('Could not load samples:', err);
    }
  },

  loadSampleProfile(profileKey) {
    if (!this.state.sampleData) return;
    const { resumes, jobs } = this.state.sampleData;

    if (profileKey === 'senior-fullstack') {
      const resumeInput = document.getElementById('resume-input');
      const jdInput = document.getElementById('jd-input');
      if (resumeInput && jdInput) {
        resumeInput.value = resumes.seniorFullStack.text;
        jdInput.value = jobs.seniorFullStackJob.text;
        this.showToast('Loaded Senior Full Stack sample! Click "Run ATS Analysis".', 'info');
      }
    } else if (profileKey === 'ml-engineer') {
      const resumeInput = document.getElementById('resume-input');
      const jdInput = document.getElementById('jd-input');
      if (resumeInput && jdInput) {
        resumeInput.value = resumes.mlEngineer.text;
        jdInput.value = jobs.mlEngineerJob.text;
        this.showToast('Loaded AI/ML Engineer sample! Click "Run ATS Analysis".', 'info');
      }
    } else if (profileKey === 'junior-dev') {
      const resumeInput = document.getElementById('resume-input');
      const jdInput = document.getElementById('jd-input');
      if (resumeInput && jdInput) {
        resumeInput.value = resumes.juniorDev.text;
        jdInput.value = jobs.seniorFullStackJob.text;
        this.showToast('Loaded Junior Developer sample against Senior posting.', 'warning');
      }
    }
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? '✅' : (type === 'warning' ? '⚠️' : (type === 'danger' ? '❌' : 'ℹ️'));
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.ResuMind.init();
});
