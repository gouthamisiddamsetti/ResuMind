/**
 * ResuMind - Analyzer View Controller
 * Handles ATS scoring UI, SVG gauge animation, and keyword breakdown.
 */

window.AnalyzerView = {
  init() {
    this.bindEvents();
  },

  bindEvents() {
    const analyzeBtn = document.getElementById('btn-run-analysis');
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', () => this.runAnalysis());
    }

    // Drag and drop for resume text
    const dropzone = document.getElementById('resume-dropzone');
    const fileInput = document.getElementById('resume-file-input');

    if (dropzone && fileInput) {
      dropzone.addEventListener('click', () => fileInput.click());

      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });

      dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
      });

      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          this.handleFileUpload(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          this.handleFileUpload(e.target.files[0]);
        }
      });
    }

    // Keyword filter tabs
    document.querySelectorAll('.kw-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const filter = e.target.getAttribute('data-filter');
        this.filterKeywords(filter);
      });
    });
  },

  handleFileUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const resumeInput = document.getElementById('resume-input');
      if (resumeInput) {
        resumeInput.value = text;
        window.ResuMind.showToast(`Loaded ${file.name} successfully!`, 'success');
      }
    };
    reader.readAsText(file);
  },

  async runAnalysis() {
    const resumeText = document.getElementById('resume-input')?.value || '';
    const jobDescription = document.getElementById('jd-input')?.value || '';

    if (!resumeText.trim()) {
      window.ResuMind.showToast('Please paste or upload your resume text first.', 'warning');
      return;
    }

    const analyzeBtn = document.getElementById('btn-run-analysis');
    if (analyzeBtn) {
      analyzeBtn.disabled = true;
      analyzeBtn.innerHTML = '⚡ Analyzing with ResuMind AI...';
    }

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Analysis failed');
      }

      const result = await response.json();
      this.renderResults(result);
      window.ResuMind.showToast('ATS Analysis complete!', 'success');

      // Scroll smoothly to results
      const resultsSection = document.getElementById('analysis-results-section');
      if (resultsSection) {
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      window.ResuMind.showToast(err.message, 'danger');
    } finally {
      if (analyzeBtn) {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '⚡ Run Deep ATS Analysis';
      }
    }
  },

  renderResults(data) {
    window.ResuMind.state.currentAnalysis = data;

    // 1. Overall Score Gauge Animation
    const scoreNum = document.getElementById('gauge-score-num');
    const gaugeProgress = document.getElementById('gauge-progress-circle');
    const badgeTier = document.getElementById('score-badge-tier');
    const scoreVerdict = document.getElementById('score-verdict-text');

    if (scoreNum) scoreNum.textContent = data.overallScore;
    if (badgeTier) {
      badgeTier.textContent = data.tier;
      badgeTier.style.backgroundColor = data.badgeColor + '25';
      badgeTier.style.color = data.badgeColor;
      badgeTier.style.border = `1px solid ${data.badgeColor}`;
    }
    if (scoreVerdict) scoreVerdict.textContent = data.verdict;

    // Circumference = 2 * PI * 65 ≈ 408.4
    const circumference = 408.4;
    const offset = circumference - (data.overallScore / 100) * circumference;
    if (gaugeProgress) {
      gaugeProgress.style.strokeDashoffset = offset;
      gaugeProgress.style.stroke = data.badgeColor;
    }

    // 2. Metrics summary row
    document.getElementById('stat-word-count').textContent = data.breakdown.structureAndAts.wordCount;
    document.getElementById('stat-matched-skills').textContent = data.breakdown.keywordMatch.matchedCount;
    document.getElementById('stat-verb-score').textContent = `${data.breakdown.actionVerbs.score}%`;
    document.getElementById('stat-metric-score').textContent = `${data.breakdown.metricsAndImpact.score}%`;

    // 3. Category Progress Bars
    this.updateBar('bar-keywords', 'val-keywords', data.breakdown.keywordMatch.score);
    this.updateBar('bar-verbs', 'val-verbs', data.breakdown.actionVerbs.score);
    this.updateBar('bar-metrics', 'val-metrics', data.breakdown.metricsAndImpact.score);
    this.updateBar('bar-structure', 'val-structure', data.breakdown.structureAndAts.score);

    // 4. Keywords Tags
    this.renderKeywordTags(data.breakdown.keywordMatch);

    // 5. Action Plan
    const actionList = document.getElementById('action-plan-list');
    if (actionList) {
      actionList.innerHTML = data.actionPlan.map(item => `
        <div class="action-item">
          <span class="action-priority priority-${item.priority}">${item.priority}</span>
          <div>
            <strong>[${item.category}]</strong> ${item.action}
          </div>
        </div>
      `).join('');
    }

    // 6. Strengths
    const strengthsList = document.getElementById('strengths-list');
    if (strengthsList) {
      strengthsList.innerHTML = data.strengths.map(s => `
        <li style="margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
          <span style="color: var(--success);">✓</span> ${s}
        </li>
      `).join('');
    }
  },

  updateBar(barId, valId, score) {
    const bar = document.getElementById(barId);
    const val = document.getElementById(valId);
    if (bar) bar.style.width = `${score}%`;
    if (val) val.textContent = `${score}%`;
  },

  renderKeywordTags(kwData) {
    const container = document.getElementById('keywords-cloud');
    if (!container) return;

    let html = '';

    // Matched skills
    kwData.matchedSkills.forEach(s => {
      html += `<span class="tag tag-matched" data-type="matched">✓ ${s.skill} <small>(${s.resumeFrequency}x)</small></span>`;
    });

    // Missing critical skills
    kwData.missingSkills.filter(s => s.importance === 'critical').forEach(s => {
      html += `<span class="tag tag-missing-critical" data-type="missing-critical">⚠ ${s.skill} (Critical)</span>`;
    });

    // Missing recommended skills
    kwData.missingSkills.filter(s => s.importance !== 'critical').forEach(s => {
      html += `<span class="tag tag-missing-rec" data-type="missing-rec">+ ${s.skill}</span>`;
    });

    // Extra skills
    kwData.extraSkills.forEach(s => {
      html += `<span class="tag" data-type="extra" style="opacity: 0.8;">• ${s.skill}</span>`;
    });

    container.innerHTML = html || '<p style="color: var(--text-muted);">No keywords extracted.</p>';
  },

  filterKeywords(type) {
    document.querySelectorAll('.kw-filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-filter') === type);
    });

    const tags = document.querySelectorAll('#keywords-cloud .tag');
    tags.forEach(tag => {
      if (type === 'all' || tag.getAttribute('data-type') === type) {
        tag.style.display = 'inline-flex';
      } else {
        tag.style.display = 'none';
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.AnalyzerView.init();
});
