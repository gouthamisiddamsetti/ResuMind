/**
 * ResuMind - Keyword Extractor & Skill Gap Matcher
 * Identifies technical stack, frameworks, tools, methodologies, and soft skills.
 * Handles synonyms and alias mappings (e.g., K8s <-> Kubernetes, React <-> React.js).
 */

const SKILL_ALIASES = {
  'k8s': 'kubernetes',
  'kube': 'kubernetes',
  'reactjs': 'react',
  'react.js': 'react',
  'react native': 'react native',
  'nodejs': 'node.js',
  'node': 'node.js',
  'vuejs': 'vue',
  'vue.js': 'vue',
  'angularjs': 'angular',
  'ts': 'typescript',
  'js': 'javascript',
  'py': 'python',
  'postgres': 'postgresql',
  'pg': 'postgresql',
  'mongo': 'mongodb',
  'aws': 'amazon web services',
  'gcp': 'google cloud',
  'google cloud platform': 'google cloud',
  'azure': 'microsoft azure',
  'ms azure': 'microsoft azure',
  'ci/cd': 'ci/cd',
  'cicd': 'ci/cd',
  'continuous integration': 'ci/cd',
  'docker': 'docker',
  'rest': 'rest api',
  'restful': 'rest api',
  'rest apis': 'rest api',
  'graphql': 'graphql',
  'nextjs': 'next.js',
  'next.js': 'next.js',
  'tailwind': 'tailwind css',
  'tailwindcss': 'tailwind css'
};

const SKILL_TAXONOMY = {
  languages: [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'golang', 'go',
    'ruby', 'php', 'rust', 'swift', 'kotlin', 'scala', 'sql', 'html', 'css',
    'bash', 'shell', 'r', 'dart'
  ],
  frameworks: [
    'react', 'next.js', 'vue', 'angular', 'svelte', 'node.js', 'express',
    'nestjs', 'django', 'fastapi', 'flask', 'spring boot', 'spring',
    'ruby on rails', 'asp.net', 'laravel', 'flutter', 'react native'
  ],
  cloud_devops: [
    'aws', 'amazon web services', 'google cloud', 'gcp', 'azure', 'docker',
    'kubernetes', 'ci/cd', 'terraform', 'ansible', 'helm', 'jenkins',
    'github actions', 'gitlab ci', 'linux', 'nginx', 'serverless', 'lambda'
  ],
  databases: [
    'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb',
    'cassandra', 'sqlite', 'oracle', 'firebase', 'supabase', 'prisma', 'typeorm'
  ],
  architecture_concepts: [
    'microservices', 'rest api', 'graphql', 'grpc', 'event-driven',
    'system design', 'distributed systems', 'scalability', 'concurrency',
    'unit testing', 'integration testing', 'tdd', 'agile', 'scrum', 'devops',
    'security', 'oauth', 'jwt', 'websockets', 'caching'
  ],
  soft_skills: [
    'cross-functional leadership', 'stakeholder management', 'problem solving',
    'team collaboration', 'communication', 'mentorship', 'agile delivery',
    'critical thinking', 'code reviews', 'project management', 'adaptability'
  ]
};

// Flatten skills for fast lookup
const ALL_CANONICAL_SKILLS = new Map();

for (const [category, list] of Object.entries(SKILL_TAXONOMY)) {
  for (const skill of list) {
    ALL_CANONICAL_SKILLS.set(skill.toLowerCase(), category);
  }
}

/**
 * Normalize a skill token, resolving aliases
 */
function normalizeSkill(token) {
  const clean = token.trim().toLowerCase();
  if (SKILL_ALIASES[clean]) {
    return SKILL_ALIASES[clean];
  }
  return clean;
}

/**
 * Extract canonical skills from text
 * @param {string} text Raw text of resume or job description
 * @returns {Map<string, {count: number, category: string}>}
 */
function extractSkills(text = '') {
  if (!text || typeof text !== 'string') return new Map();

  const lowerText = text.toLowerCase();
  const foundSkills = new Map();

  // 1. Direct multi-word & single-word matching from taxonomy
  for (const [skill, category] of ALL_CANONICAL_SKILLS.entries()) {
    // Escape special regex chars like ++, #, .
    const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-z0-9_#+])${escaped}([^a-z0-9_#+]|$)`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      foundSkills.set(skill, {
        name: skill,
        count: matches.length,
        category
      });
    }
  }

  // 2. Check alias occurrences
  for (const [alias, canonical] of Object.entries(SKILL_ALIASES)) {
    const escaped = alias.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-z0-9_#+])${escaped}([^a-z0-9_#+]|$)`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      const existing = foundSkills.get(canonical);
      const category = ALL_CANONICAL_SKILLS.get(canonical) || 'technical';
      if (existing) {
        existing.count += matches.length;
      } else {
        foundSkills.set(canonical, {
          name: canonical,
          count: matches.length,
          category
        });
      }
    }
  }

  return foundSkills;
}

/**
 * Match resume skills against job description skills
 * @param {string} resumeText
 * @param {string} jobDescriptionText
 * @returns {object} Detailed skill match breakdown
 */
function analyzeSkillGap(resumeText = '', jobDescriptionText = '') {
  const resumeSkills = extractSkills(resumeText);
  const jdSkills = extractSkills(jobDescriptionText);

  const matched = [];
  const missing = [];
  const resumeExtra = [];

  // Evaluate all JD skills
  for (const [skillName, jdData] of jdSkills.entries()) {
    if (resumeSkills.has(skillName)) {
      matched.push({
        skill: skillName,
        category: jdData.category,
        jdFrequency: jdData.count,
        resumeFrequency: resumeSkills.get(skillName).count,
        importance: jdData.count >= 3 ? 'critical' : (jdData.count >= 2 ? 'recommended' : 'standard')
      });
    } else {
      missing.push({
        skill: skillName,
        category: jdData.category,
        jdFrequency: jdData.count,
        importance: jdData.count >= 3 ? 'critical' : (jdData.count >= 2 ? 'recommended' : 'standard')
      });
    }
  }

  // Find extra skills the candidate has that aren't mentioned in the JD
  for (const [skillName, resData] of resumeSkills.entries()) {
    if (!jdSkills.has(skillName)) {
      resumeExtra.push({
        skill: skillName,
        category: resData.category,
        frequency: resData.count
      });
    }
  }

  // Sort: critical first, then by frequency
  matched.sort((a, b) => b.jdFrequency - a.jdFrequency);
  missing.sort((a, b) => {
    const impOrder = { critical: 3, recommended: 2, standard: 1 };
    if (impOrder[b.importance] !== impOrder[a.importance]) {
      return impOrder[b.importance] - impOrder[a.importance];
    }
    return b.jdFrequency - a.jdFrequency;
  });

  const totalJdSkills = jdSkills.size;
  let matchPercentage = totalJdSkills > 0 ? Math.round((matched.length / totalJdSkills) * 100) : 100;

  // Weight critical missing skills higher in calculation
  const criticalMissingCount = missing.filter(m => m.importance === 'critical').length;
  if (criticalMissingCount > 0) {
    matchPercentage = Math.max(10, matchPercentage - (criticalMissingCount * 7));
  }

  return {
    matchPercentage,
    totalJdSkills,
    matchedCount: matched.length,
    missingCount: missing.length,
    matchedSkills: matched,
    missingSkills: missing,
    criticalMissingCount,
    extraSkills: resumeExtra.slice(0, 15)
  };
}

module.exports = {
  SKILL_ALIASES,
  SKILL_TAXONOMY,
  normalizeSkill,
  extractSkills,
  analyzeSkillGap
};
