/**
 * ResuMind - Resume Builder View Controller
 * Form-based interactive builder with real-time styling controls:
 * Color accents, Font sizing, Page padding/margins, Line spacing, and PDF export.
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

  // Interactive Styling State: Color, Size, Padding, Line-Height, Alignment
  styling: {
    accentColor: '#1e3a8a', // Classic Navy
    fontSize: '10.5pt',
    padding: '32px',
    lineHeight: '1.5',
    template: 'modern',
    headerAlign: 'center',
    showGuide: true
  },

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
    // Form inputs
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

    // 1. Color Accent Buttons
    document.querySelectorAll('.resume-color-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.resume-color-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.styling.accentColor = e.currentTarget.getAttribute('data-color');
        this.renderPreview();
      });
    });

    // Custom Color Input
    const customColorInput = document.getElementById('resume-custom-color');
    if (customColorInput) {
      customColorInput.addEventListener('input', (e) => {
        this.styling.accentColor = e.target.value;
        this.renderPreview();
      });
    }

    // 2. Font Size Segmented Buttons
    document.querySelectorAll('.btn-font-size').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.btn-font-size').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.styling.fontSize = e.currentTarget.getAttribute('data-size');
        this.renderPreview();
      });
    });

    // 3. Padding / Margins Segmented Buttons
    document.querySelectorAll('.btn-padding').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.btn-padding').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.styling.padding = e.currentTarget.getAttribute('data-padding');
        this.renderPreview();
      });
    });

    // 4. Line Spacing Segmented Buttons
    document.querySelectorAll('.btn-line-height').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.btn-line-height').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.styling.lineHeight = e.currentTarget.getAttribute('data-line-height');
        this.renderPreview();
      });
    });

    // 5. Header Alignment Toggle
    document.querySelectorAll('.btn-align').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.btn-align').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.styling.headerAlign = e.currentTarget.getAttribute('data-align');
        this.renderPreview();
      });
    });

    // 6. Template Dropdown
    const templateSelect = document.getElementById('builder-template-select');
    if (templateSelect) {
      templateSelect.addEventListener('change', (e) => {
        this.styling.template = e.target.value;
        this.renderPreview();
      });
    }

    // 7. Page Boundary Guide Toggle
    const guideToggle = document.getElementById('toggle-page-guide');
    if (guideToggle) {
      guideToggle.addEventListener('change', (e) => {
        this.styling.showGuide = e.target.checked;
        const guide = document.getElementById('page-guide-marker');
        if (guide) guide.style.display = this.styling.showGuide ? 'flex' : 'none';
      });
    }

    // 8. Print PDF
    const printBtn = document.getElementById('btn-print-resume');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // 9. Export JSON
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

    const { accentColor, fontSize, padding, lineHeight, template, headerAlign } = this.styling;

    // Apply Live Typography & Layout properties
    preview.style.padding = padding;
    preview.style.fontSize = fontSize;
    preview.style.lineHeight = lineHeight;

    const fontFamily = template === 'executive'
      ? 'Georgia, "Times New Roman", serif'
      : (template === 'tech' ? 'ui-monospace, "JetBrains Mono", Consolas, monospace' : 'var(--font-sans)');

    preview.style.fontFamily = fontFamily;

    const contactParts = [
      this.data.location,
      this.data.phone,
      this.data.email,
      this.data.linkedin,
      this.data.github
    ].filter(Boolean).join('  |  ');

    const headerTextAlign = headerAlign === 'left' ? 'left' : 'center';

    preview.innerHTML = `
      <div style="text-align: ${headerTextAlign}; margin-bottom: 1.25rem;">
        <h1 style="font-size: 1.9em; font-weight: 800; text-transform: uppercase; margin-bottom: 0.15em; color: ${accentColor}; letter-spacing: -0.01em;">
          ${this.data.fullName || 'Candidate Name'}
        </h1>
        <div style="font-size: 1.05em; color: #475569; font-weight: 600; margin-bottom: 0.35em;">
          ${this.data.title || 'Target Job Title'}
        </div>
        <div style="font-size: 0.85em; color: #64748b; border-bottom: 2px solid ${accentColor}25; padding-bottom: 0.75em;">
          ${contactParts}
        </div>
      </div>

      ${this.data.summary ? `
        <div style="margin-bottom: 1.1em;">
          <div style="font-size: 0.95em; font-weight: 700; color: ${accentColor}; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid ${accentColor}40; padding-bottom: 0.2em; margin-bottom: 0.4em;">
            Professional Summary
          </div>
          <p style="font-size: 0.9em; color: #334155;">${this.data.summary}</p>
        </div>
      ` : ''}

      ${this.data.skills ? `
        <div style="margin-bottom: 1.1em;">
          <div style="font-size: 0.95em; font-weight: 700; color: ${accentColor}; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid ${accentColor}40; padding-bottom: 0.2em; margin-bottom: 0.4em;">
            Technical Skills & Competencies
          </div>
          <p style="font-size: 0.9em; color: #334155;">${this.data.skills}</p>
        </div>
      ` : ''}

      <div style="margin-bottom: 1.1em;">
        <div style="font-size: 0.95em; font-weight: 700; color: ${accentColor}; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid ${accentColor}40; padding-bottom: 0.2em; margin-bottom: 0.5em;">
          Work Experience
        </div>
        ${this.data.experience.map(exp => `
          <div style="margin-bottom: 0.9em;">
            <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 0.92em; color: #0f172a;">
              <span>${exp.role} <span style="font-weight: 400; color: #475569;">— ${exp.company}</span></span>
              <span style="color: #64748b; font-size: 0.88em; font-weight: 500;">${exp.dates}</span>
            </div>
            <ul style="padding-left: 1.2em; font-size: 0.88em; color: #334155; margin-top: 0.3em;">
              ${exp.bullets.map(b => `<li style="margin-bottom: 0.25em;">${b}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>

      <div style="margin-bottom: 1.1em;">
        <div style="font-size: 0.95em; font-weight: 700; color: ${accentColor}; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid ${accentColor}40; padding-bottom: 0.2em; margin-bottom: 0.4em;">
          Education
        </div>
        ${this.data.education.map(edu => `
          <div style="display: flex; justify-content: space-between; font-size: 0.9em;">
            <span style="font-weight: 700; color: #0f172a;">${edu.degree} <span style="font-weight: 400; color: #475569;">— ${edu.school}</span></span>
            <span style="color: #64748b; font-size: 0.88em;">${edu.dates}</span>
          </div>
        `).join('')}
      </div>
    `;
  },

  exportJSON() {
    const exportPayload = {
      data: this.data,
      styling: this.styling,
      exportedAt: new Date().toISOString()
    };
    const jsonStr = JSON.stringify(exportPayload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Resume-${this.data.fullName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    window.ResuMind.showToast('Exported Resume configuration JSON!', 'success');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.ResumeBuilderView.init();
});
