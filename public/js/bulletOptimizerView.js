/**
 * ResuMind - AI Bullet Optimizer View Controller
 * Rewrites weak bullet points using STAR framework with copy actions.
 */

window.BulletOptimizerView = {
  init() {
    this.bindEvents();
  },

  bindEvents() {
    const optimizeBtn = document.getElementById('btn-optimize-bullet');
    if (optimizeBtn) {
      optimizeBtn.addEventListener('click', () => this.optimizeBullet());
    }

    // Preset buttons
    document.querySelectorAll('.preset-bullet-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const text = e.target.getAttribute('data-text');
        const input = document.getElementById('bullet-input');
        if (input && text) {
          input.value = text;
          this.optimizeBullet();
        }
      });
    });
  },

  async optimizeBullet() {
    const bullet = document.getElementById('bullet-input')?.value || '';
    const role = document.getElementById('bullet-role-select')?.value || 'Senior Software Engineer';

    if (!bullet.trim()) {
      window.ResuMind.showToast('Please enter a draft bullet point.', 'warning');
      return;
    }

    const btn = document.getElementById('btn-optimize-bullet');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '✨ Optimizing with AI...';
    }

    try {
      const response = await fetch('/api/optimize-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bullet, role })
      });

      if (!response.ok) {
        throw new Error('Could not optimize bullet point.');
      }

      const data = await response.json();
      this.renderVariations(data);
      window.ResuMind.showToast('Generated 3 STAR-framework bullet points!', 'success');
    } catch (err) {
      window.ResuMind.showToast(err.message, 'danger');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '✨ Generate High-Impact Rewrites';
      }
    }
  },

  renderVariations(data) {
    const container = document.getElementById('bullet-variations-container');
    if (!container) return;

    if (!data.variations || data.variations.length === 0) {
      container.innerHTML = '<p>No variations available.</p>';
      return;
    }

    container.innerHTML = data.variations.map((v, i) => `
      <div class="variation-card">
        <div class="variation-header">
          <span class="variation-title">Option ${i + 1}: ${v.style}</span>
          <button class="btn btn-sm btn-secondary copy-btn" onclick="BulletOptimizerView.copyText('${encodeURIComponent(v.text)}', this)">
            📋 Copy
          </button>
        </div>
        <div class="variation-text">${v.text}</div>
        <div style="font-size: 0.75rem; color: var(--text-dim);">
          Key focus: ${v.highlights.join(' • ')}
        </div>
      </div>
    `).join('');
  },

  copyText(encodedStr, btnElement) {
    const text = decodeURIComponent(encodedStr);
    navigator.clipboard.writeText(text).then(() => {
      const originalText = btnElement.innerHTML;
      btnElement.innerHTML = '✅ Copied!';
      btnElement.classList.remove('btn-secondary');
      btnElement.classList.add('btn-primary');

      setTimeout(() => {
        btnElement.innerHTML = originalText;
        btnElement.classList.remove('btn-primary');
        btnElement.classList.add('btn-secondary');
      }, 2000);
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.BulletOptimizerView.init();
});
