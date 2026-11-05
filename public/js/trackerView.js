/**
 * ResuMind - Job Application Tracker View Controller
 * Kanban board for job search journey: track stages, match scores, and interview progress.
 */

window.TrackerView = {
  applications: [],
  stats: {},

  init() {
    this.bindEvents();
    this.fetchApplications();
  },

  bindEvents() {
    const addBtn = document.getElementById('btn-add-application');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.createApplication());
    }
  },

  async fetchApplications() {
    try {
      const res = await fetch('/api/applications');
      if (res.ok) {
        const data = await res.json();
        this.applications = data.applications || [];
        this.stats = data.stats || {};
        this.renderStats();
        this.renderKanban();
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    }
  },

  renderStats() {
    const totalEl = document.getElementById('stat-app-total');
    const interEl = document.getElementById('stat-app-interviewing');
    const offerEl = document.getElementById('stat-app-offers');
    const rateEl = document.getElementById('stat-app-rate');

    if (totalEl) totalEl.textContent = this.stats.total || 0;
    if (interEl) interEl.textContent = this.stats.interviewing || 0;
    if (offerEl) offerEl.textContent = this.stats.offers || 0;
    if (rateEl) rateEl.textContent = `${this.stats.interviewRate || 0}%`;
  },

  renderKanban() {
    const stages = ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

    stages.forEach(stage => {
      const colEl = document.getElementById(`kanban-col-${stage.toLowerCase()}`);
      if (!colEl) return;

      const items = this.applications.filter(a => a.status === stage);
      const countBadge = document.getElementById(`count-${stage.toLowerCase()}`);
      if (countBadge) countBadge.textContent = items.length;

      colEl.innerHTML = items.map(app => `
        <div class="kanban-card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.35rem;">
            <strong style="font-size: 0.95rem;">${app.company}</strong>
            <span style="font-size: 0.75rem; font-weight: 700; color: ${app.matchScore >= 80 ? 'var(--success)' : 'var(--warning)'};">
              ${app.matchScore}% Match
            </span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">
            ${app.role}
          </div>
          <div style="font-size: 0.75rem; color: var(--text-dim); margin-bottom: 0.5rem;">
            📍 ${app.location} • 💰 ${app.salary}
          </div>
          ${app.notes ? `<div style="font-size: 0.75rem; background: var(--bg-tertiary); padding: 0.35rem 0.5rem; border-radius: var(--radius-sm); margin-bottom: 0.5rem;">${app.notes}</div>` : ''}
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem; border-top: 1px solid var(--border-color); padding-top: 0.5rem;">
            <select style="font-size: 0.75rem; padding: 0.2rem 0.4rem; width: auto;" onchange="TrackerView.updateStatus('${app.id}', this.value)">
              ${stages.map(s => `<option value="${s}" ${s === app.status ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
            <button class="btn btn-sm btn-danger" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;" onclick="TrackerView.deleteApp('${app.id}')">
              🗑️
            </button>
          </div>
        </div>
      `).join('') || '<div style="font-size: 0.8rem; color: var(--text-dim); text-align: center; padding: 1.5rem 0;">No jobs in this stage</div>';
    });
  },

  async createApplication() {
    const company = document.getElementById('app-new-company')?.value;
    const role = document.getElementById('app-new-role')?.value;
    const location = document.getElementById('app-new-location')?.value || 'Remote';
    const salary = document.getElementById('app-new-salary')?.value || 'Competitive';
    const matchScore = document.getElementById('app-new-score')?.value || 85;
    const status = document.getElementById('app-new-status')?.value || 'Applied';
    const notes = document.getElementById('app-new-notes')?.value || '';

    if (!company || !role) {
      window.ResuMind.showToast('Please enter at least Company and Role.', 'warning');
      return;
    }

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, role, location, salary, matchScore, status, notes })
      });

      if (res.ok) {
        window.ResuMind.showToast(`Saved application for ${company}!`, 'success');
        // Clear inputs
        document.getElementById('app-new-company').value = '';
        document.getElementById('app-new-role').value = '';
        document.getElementById('app-new-notes').value = '';
        this.fetchApplications();
      }
    } catch (err) {
      window.ResuMind.showToast('Failed to create application', 'danger');
    }
  },

  async updateStatus(id, newStatus) {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        window.ResuMind.showToast(`Updated status to ${newStatus}`, 'info');
        this.fetchApplications();
      }
    } catch (err) {
      window.ResuMind.showToast('Failed to update status', 'danger');
    }
  },

  async deleteApp(id) {
    if (!confirm('Are you sure you want to remove this application?')) return;

    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        window.ResuMind.showToast('Application deleted', 'info');
        this.fetchApplications();
      }
    } catch (err) {
      window.ResuMind.showToast('Failed to delete application', 'danger');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.TrackerView.init();
});
