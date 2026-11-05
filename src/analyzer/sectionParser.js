/**
 * ResuMind - Section Parser & Resume Structure Analyzer
 * Breaks plain text or markdown resumes into standard ATS sections,
 * identifies contact information, and flags formatting anomalies.
 */

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_REGEX = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/;
const LINKEDIN_REGEX = /linkedin\.com\/(?:in\/|profile\/)?([a-zA-Z0-9_-]+)/i;
const GITHUB_REGEX = /github\.com\/([a-zA-Z0-9_-]+)/i;

const SECTION_HEADERS = {
  summary: [
    'summary', 'professional summary', 'executive summary', 'profile',
    'career summary', 'about me', 'objective', 'career objective'
  ],
  experience: [
    'experience', 'work experience', 'professional experience',
    'employment history', 'work history', 'relevant experience'
  ],
  skills: [
    'skills', 'technical skills', 'core competencies', 'technologies',
    'skills & tools', 'areas of expertise', 'technical proficiency'
  ],
  education: [
    'education', 'academic background', 'educational qualifications',
    'degrees', 'academics'
  ],
  projects: [
    'projects', 'key projects', 'personal projects', 'technical projects',
    'portfolio projects', 'selected projects'
  ],
  certifications: [
    'certifications', 'certificates', 'credentials', 'licenses',
    'awards', 'honors', 'publications'
  ]
};

/**
 * Identify which standard section heading a line matches
 * @param {string} line
 * @returns {string|null}
 */
function matchSectionHeader(line) {
  const clean = line.trim().toLowerCase().replace(/^#+\s*/, '').replace(/[:*_-]/g, '').trim();
  for (const [sectionKey, aliases] of Object.entries(SECTION_HEADERS)) {
    if (aliases.includes(clean)) {
      return sectionKey;
    }
  }
  return null;
}

/**
 * Parse raw text into structured resume sections and metadata
 * @param {string} text Raw resume text
 * @returns {object} Parsed structure and section metadata
 */
function parseResume(text = '') {
  if (!text || typeof text !== 'string') {
    return {
      contact: {},
      sections: {},
      bulletPoints: [],
      wordCount: 0,
      charCount: 0,
      detectedSections: [],
      missingSections: ['summary', 'experience', 'skills', 'education'],
      structureScore: 20,
      formattingFlags: ['Resume text is empty']
    };
  }

  const lines = text.split(/\r?\n/);
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Extract contact info
  const emailMatch = text.match(EMAIL_REGEX);
  const phoneMatch = text.match(PHONE_REGEX);
  const linkedinMatch = text.match(LINKEDIN_REGEX);
  const githubMatch = text.match(GITHUB_REGEX);

  const contact = {
    email: emailMatch ? emailMatch[0] : null,
    phone: phoneMatch ? phoneMatch[0] : null,
    linkedin: linkedinMatch ? linkedinMatch[0] : null,
    github: githubMatch ? githubMatch[0] : null
  };

  // Group lines by sections
  const sections = {
    header: [],
    summary: [],
    experience: [],
    skills: [],
    education: [],
    projects: [],
    certifications: [],
    other: []
  };

  let currentSection = 'header';
  const bulletPoints = [];
  const experienceBullets = [];
  const detectedHeaders = new Set();

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    // Check if this line is a section header
    const matchedHeader = matchSectionHeader(trimmed);
    if (matchedHeader) {
      currentSection = matchedHeader;
      detectedHeaders.add(matchedHeader);
      continue;
    }

    // Capture bullet points (starting with *, -, •, or numbered)
    const isBullet = /^(\*|-|•|\d+\.)\s+/.test(trimmed);
    if (isBullet) {
      const cleanBullet = trimmed.replace(/^(\*|-|•|\d+\.)\s+/, '').trim();
      bulletPoints.push(cleanBullet);
      if (currentSection === 'experience' || currentSection === 'projects') {
        experienceBullets.push(cleanBullet);
      }
    }

    sections[currentSection].push(trimmed);
  }

  // If no explicit bullets were found in experience, extract sentence-based points from experience
  if (experienceBullets.length === 0 && sections.experience.length > 0) {
    for (const expLine of sections.experience) {
      if (expLine.length > 25 && expLine.length < 250) {
        experienceBullets.push(expLine);
        bulletPoints.push(expLine);
      }
    }
  }

  // Structure Evaluation
  const detectedSections = Array.from(detectedHeaders);
  const essentialSections = ['experience', 'skills', 'education'];
  const recommendedSections = ['summary', 'projects'];

  const missingSections = [];
  for (const s of [...essentialSections, ...recommendedSections]) {
    if (!detectedHeaders.has(s)) {
      missingSections.push(s);
    }
  }

  const formattingFlags = [];
  let structureScore = 100;

  // Contact checks
  if (!contact.email) {
    structureScore -= 15;
    formattingFlags.push('Missing professional email address.');
  }
  if (!contact.phone) {
    structureScore -= 10;
    formattingFlags.push('Missing phone number.');
  }
  if (!contact.linkedin) {
    structureScore -= 5;
    formattingFlags.push('LinkedIn profile URL not found (recommended for ATS & recruiters).');
  }

  // Essential section checks
  if (!detectedHeaders.has('experience')) {
    structureScore -= 25;
    formattingFlags.push('Critical: Work Experience section header not recognized by ATS.');
  }
  if (!detectedHeaders.has('skills')) {
    structureScore -= 20;
    formattingFlags.push('Critical: Technical Skills section header not recognized.');
  }
  if (!detectedHeaders.has('education')) {
    structureScore -= 15;
    formattingFlags.push('Education section header not detected.');
  }
  if (!detectedHeaders.has('summary')) {
    structureScore -= 10;
    formattingFlags.push('Professional Summary missing. A 2-3 line summary improves ATS relevance.');
  }

  // Word count checks
  if (wordCount < 250) {
    structureScore -= 20;
    formattingFlags.push('Resume is too brief (' + wordCount + ' words). Standard ATS resumes contain 400-800 words.');
  } else if (wordCount > 1400) {
    structureScore -= 10;
    formattingFlags.push('Resume is quite lengthy (' + wordCount + ' words). Consider condensing to 1-2 pages.');
  }

  // Bullet point density check
  if (bulletPoints.length < 4) {
    structureScore -= 15;
    formattingFlags.push('Few or no bullet points detected. Dense paragraphs are harder for ATS parsers and recruiters.');
  }

  structureScore = Math.max(15, Math.min(100, structureScore));

  return {
    contact,
    sections,
    bulletPoints,
    experienceBullets: experienceBullets.length > 0 ? experienceBullets : bulletPoints,
    wordCount,
    charCount: text.length,
    detectedSections,
    missingSections,
    structureScore,
    formattingFlags
  };
}

module.exports = {
  EMAIL_REGEX,
  PHONE_REGEX,
  SECTION_HEADERS,
  matchSectionHeader,
  parseResume
};
