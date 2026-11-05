/**
 * ResuMind - AI Professional Summary Generator
 * Synthesizes a high-impact, ATS-optimized 3-sentence summary tailored to
 * target job title, candidate domain, and top technical skills.
 */

const { extractSkills } = require('../analyzer/keywordExtractor');

/**
 * Generate targeted summary
 * @param {object} params
 * @param {string} params.targetRole Target job title (e.g. Senior Full Stack Engineer)
 * @param {number} params.yearsExperience Years of experience (e.g. 5)
 * @param {string[]} params.keySkills Array of core skills (e.g. ['React', 'Node.js', 'AWS', 'PostgreSQL'])
 * @param {string} params.specialty Optional domain specialty (e.g. distributed systems, SaaS, fintech)
 * @returns {object} Formatted summary variations
 */
function generateProfessionalSummary({
  targetRole = 'Full Stack Engineer',
  yearsExperience = 5,
  keySkills = ['React', 'Node.js', 'TypeScript', 'AWS'],
  specialty = 'high-scale web applications'
} = {}) {
  const skillsList = Array.isArray(keySkills) && keySkills.length > 0
    ? keySkills.slice(0, 4).join(', ')
    : 'cloud technologies and modern frameworks';

  // Option 1: Impact & Scale (Best for Senior & Lead roles)
  const option1 = `Results-driven ${targetRole} with ${yearsExperience}+ years of experience architecting and delivering ${specialty}. Proficient across ${skillsList}, with a demonstrated track record of optimizing performance, accelerating release cycles by up to 40%, and leading high-performing engineering teams. Passionate about building robust, scalable solutions that drive measurable business growth.`;

  // Option 2: Technical Focus (Best for Mid-level & Specialist roles)
  const option2 = `${targetRole} with ${yearsExperience}+ years of hands-on expertise building resilient systems in ${skillsList}. Proven background in full lifecycle development, test-driven methodologies, and cloud-native deployments. Eager to leverage deep technical acumen to solve complex engineering challenges and enhance product reliability.`;

  // Option 3: Executive & Collaborative (Best for Staff / Team Lead roles)
  const option3 = `Innovative ${targetRole} offering ${yearsExperience}+ years of leadership in designing enterprise software and ${specialty}. Adept at bridging technical implementation (${skillsList}) with strategic product goals, mentoring junior engineers, and championing best practices across the agile development lifecycle.`;

  return {
    targetRole,
    yearsExperience,
    primarySkills: skillsList,
    options: [
      {
        id: 'impact',
        title: 'High-Impact & Metrics Driven',
        recommendedFor: 'Senior & Staff Roles',
        text: option1
      },
      {
        id: 'technical',
        title: 'Deep Technical & Architectural',
        recommendedFor: 'Specialists & Mid-Level Roles',
        text: option2
      },
      {
        id: 'leadership',
        title: 'Collaborative & Leadership',
        recommendedFor: 'Engineering Leads & Tech Leads',
        text: option3
      }
    ]
  };
}

module.exports = {
  generateProfessionalSummary
};
