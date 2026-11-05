/**
 * ResuMind - Resume Builder View Controller
 * Form-based interactive builder with real-time ATS preview, template switching, and PDF export.
 */

window.ResumeBuilderView = {
  data: {
    fullName: 'Alex Rivera',
    title: 'Senior Full Stack Engineer',
    email: 'alex.rivera@email.com',
    phone: '(555) 382-9102',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexrivera-dev',
    github: 'github.com/alexrivera-code',
    summary: 'Results-oriented Senior Full Stack Engineer with 7+ years of experience architecting high-concurrency web platforms, microservices, and modern frontend applications. Proven history of slashing API latency by 45% and leading cross-functional teams to ship mission-critical cloud infrastructure.',
    experience: [
      {
        company: 'Apex Cloud Technologies',
        role: 'Senior Full Stack Engineer',
        dates: '2022 - Present',
        bullets: [
          'Architected and deployed multi-tenant microservices platform with Node.js and AWS Lambda, serving 450k+ daily users with 99.99% uptime.',
          'Spearheaded migration of legacy frontend to Next.js and React, accelerating page load speeds by 52% and increasing conversion rates by 18%.',
          'Optimized PostgreSQL queries and Redis caching layers, slashing 95th-percentile API response latency from 340ms to 48ms.'
        ]
      },
      {
        company: 'Starlight Digital Solutions',
        role: 'Full Stack Software Developer',
        dates: '2019 - 2022',
        bullets: [
          'Engineered payment checkout workflows with React and Node.js, processing over $12M in gross volume.',
          'Implemented event-driven message queuing with Redis, eliminating asynchronous order processing failures by 98%.'
        ]
      }
    ],
    education: [
      {
        school: 'University of California, Berkeley',
        degree: 'Bachelor of Science in Computer Science',
        dates: '2015 - 2019'
      }
    ],
    skills: 'TypeScript, JavaScript, Python, SQL, React, Next.js, Node.js, Express, AWS, Docker, Kubernetes, CI/CD, PostgreSQL, Redis, Microservices'
  },

  template: 'modern',

  init() {
    this.populateForm();
    this.bindEvents();
    this.renderPreview();
  },

  populateForm() {
    document.getElementById('builder-name').value = this.data.fullName;
    document.getElementById('builder-title').value = this.data.title;
    document.getElementById('builder-email').value = this.data.email;
    document.getElementById('builder-phone').value = this.data.phone;
    document.getElementById('builder-location').value = this.data.location;
    document.getElementById('builder-linkedin').value = this.data.linkedin;
    document.getElementById('builder-github').value = this.data.github;
    document.getElementById('builder-summary').value = this.data.summary;
    document.getElementById('builder-skills').value = this.data.skills;
  },

  bindEvents() {
    // Input syncing
    const formFields = [
      'builder-name', 'builder-title', 'builder-email', 'builder-phone',
      'builder-location', 'builder-linkedin', 'builder-github',
      'builder-summary', 'builder-skills'
    ];

    formFields.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => this.syncFromForm());
      }
    });

    // Template Selector
    const templateSelect = document.getElementById('builder-template-select');
    if (templateSelect) {
      templateSelect.addEventListener('change', (e) => {
        this.template = e.target.value;
        this.renderPreview();
      });
    }

    // Print PDF button
    const printBtn = document.getElementById('btn-print-resume');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Export JSON button
    const jsonBtn = document.getElementById('btn-export-json');
    if (jsonBtn) {
      jsonBtn.addEventListener('click', () => this.exportJSON());
    }
  },

  syncFromForm() {
    this.data.fullName = document.getElementById('builder-name').value;
    this.data.title = document.getElementById('builder-title').value;
    this.data.email = document.getElementById('builder-email').value;
    this.data.phone = document.getElementById('builder-phone').value;
    this.data.location = document.getElementById('builder-location').value;
    this.data.linkedin = document.getElementById('builder-linkedin').value;
    this.data.github = document.getElementById('builder-github').value;
    this.data.summary = document.getElementById('builder-summary').value;
    this.data.skills = document.getElementById('builder-skills').value;
    this.renderPreview();
  },

  renderPreview() {
    const preview = document.getElementById('resume-preview');
    if (!preview) return;

    const contactParts = [
      this.data.location,
      this.data.phone,
      this.data.email,
      this.data.linkedin,
      this.data.github
    ].filter(Boolean).join(' • ');

    const fontFamily = this.template === 'executive'
      ? 'Georgia, serif'
      : (this.template === 'tech' ? 'ui-monospace, monospace' : 'var(--font-sans)');

    preview.style.fontFamily = fontFamily;

    preview.innerHTML = `
      <div style="text-align: center; margin-bottom: 1.25rem;">
        <h1 style="font-size: 1.75rem; font-weight: 800; text-transform: uppercase; margin-bottom: 0.2rem;">
          ${this.data.fullName || 'Candidate Name'}
        </h1>
        <div style="font-size: 1rem; color: #475569; font-weight: 600; margin-bottom: 0.35rem;">
          ${this.data.title || 'Professional Title'}
        </div>
        <div class="preview-contact" style="font-size: 0.8rem; color: #64748b;">
          ${contactParts}
        </div>
      </div>

      ${this.data.summary ? `
        <div class="preview-section">
          <div class="preview-section-title">Professional Summary</div>
          <p style="font-size: 0.85rem; color: #334155; line-height: 1.5;">${this.data.summary}</p>
        </div>
      ` : ''}

      ${this.data.skills ? `
        <div class="preview-section">
          <div class="preview-section-title">Technical Skills & Competencies</div>
          <p style="font-size: 0.85rem; color: #334155; line-height: 1.5;">${this.data.skills}</p>
        </div>
      ` : ''}

      <div class="preview-section">
        <div class="preview-section-title">Work Experience</div>
        ${this.data.experience.map(exp => `
          <div style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 0.9rem; color: #0f172a;">
              <span>${exp.role} — ${exp.company}</span>
              <span style="color: #64748b; font-size: 0.8rem;">${exp.dates}</span>
            </div>
            <ul style="padding-left: 1.25rem; font-size: 0.825rem; color: #334155; margin-top: 0.35rem;">
              ${exp.bullets.map(b => `<li style="margin-bottom: 0.25rem;">${b}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>

      <div class="preview-section">
        <div class="preview-section-title">Education</div>
        ${this.data.education.map(edu => `
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
            <span style="font-weight: 600;">${edu.degree} — ${edu.school}</span>
            <span style="color: #64748b;">${edu.dates}</span>
          </div>
        `).join('')}
      </div>
    `;
  },

  exportJSON() {
    const jsonStr = JSON.stringify(this.data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Resume-${this.data.fullName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    window.ResuMind.showToast('Resume JSON exported successfully!', 'success');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.ResumeBuilderView.init();
});
