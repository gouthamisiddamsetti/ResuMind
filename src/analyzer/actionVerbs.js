/**
 * ResuMind - Action Verb Engine
 * Analyzes action verbs in resume bullet points, detects weak phrasing,
 * and calculates action verb strength score.
 */

const STRONG_VERBS = {
  leadership: [
    'spearheaded', 'orchestrated', 'championed', 'directed', 'mentored',
    'fostered', 'empowered', 'mobilized', 'steered', 'coached', 'guided',
    'supervised', 'delegated', 'founded', 'chaired', 'pioneered'
  ],
  technical: [
    'architected', 'engineered', 'developed', 'implemented', 'deployed',
    'configured', 'automated', 'refactored', 'debugged', 'integrated',
    'constructed', 'modeled', 'programmed', 'designed', 'migrated'
  ],
  optimization: [
    'accelerated', 'optimized', 'streamlined', 'maximized', 'minimized',
    'enhanced', 'boosted', 'slashed', 'consolidated', 'modernized',
    'amplified', 'curbed', 'restructured', 'eliminated', 'standardized'
  ],
  execution: [
    'delivered', 'executed', 'produced', 'launched', 'established',
    'attained', 'generated', 'authored', 'secured', 'negotiated',
    'dispatched', 'finalized', 'fulfilled', 'published', 'rolled out'
  ],
  research: [
    'analyzed', 'investigated', 'identified', 'benchmarked', 'diagnosed',
    'evaluated', 'quantified', 'audited', 'synthesized', 'discovered',
    'uncovered', 'forecasted', 'validated', 'tested', 'surveyed'
  ]
};

const ALL_STRONG_VERBS = new Set([
  ...STRONG_VERBS.leadership,
  ...STRONG_VERBS.technical,
  ...STRONG_VERBS.optimization,
  ...STRONG_VERBS.execution,
  ...STRONG_VERBS.research
]);

const WEAK_VERBS = {
  'worked on': ['developed', 'engineered', 'spearheaded', 'architected'],
  'helped': ['facilitated', 'collaborated to', 'accelerated', 'empowered'],
  'assisted': ['co-authored', 'supported execution of', 'partnered to deliver'],
  'handled': ['managed', 'orchestrated', 'streamlined', 'administered'],
  'was responsible for': ['spearheaded', 'owned', 'directed', 'oversaw'],
  'responsible for': ['drove', 'governed', 'championed', 'executed'],
  'did': ['executed', 'implemented', 'delivered', 'conducted'],
  'tried': ['experimented with', 'prototyped', 'evaluated', 'piloted'],
  'participated in': ['contributed to', 'partnered on', 'co-designed'],
  'involved in': ['instrumental in', 'drove key phases of', 'co-led'],
  'looked after': ['supervised', 'maintained', 'stewarded', 'monitored']
};

/**
 * Analyze action verbs found across bullet points or text
 * @param {string[]} bulletPoints Array of bullet point strings
 * @returns {object} Analysis of action verbs
 */
function analyzeActionVerbs(bulletPoints = []) {
  if (!bulletPoints || bulletPoints.length === 0) {
    return {
      score: 50,
      totalBullets: 0,
      strongCount: 0,
      weakCount: 0,
      strongVerbsFound: [],
      weakVerbsFound: [],
      suggestions: ['Add action-oriented bullet points starting with strong verbs like Spearheaded, Engineered, or Optimized.']
    };
  }

  const strongFound = new Set();
  const weakFound = [];
  let bulletsStartingWithStrong = 0;
  let bulletsWithWeak = 0;

  for (const bullet of bulletPoints) {
    const cleanBullet = bullet.trim().toLowerCase();
    if (!cleanBullet) continue;

    // Check first 3 words for strong verb
    const firstWord = cleanBullet.split(/\s+/)[0]?.replace(/[^a-z]/g, '');
    const firstTwoWords = cleanBullet.split(/\s+/).slice(0, 2).join(' ').replace(/[^a-z\s]/g, '');
    const firstThreeWords = cleanBullet.split(/\s+/).slice(0, 3).join(' ').replace(/[^a-z\s]/g, '');

    let hasStrongLead = false;
    if (firstWord && ALL_STRONG_VERBS.has(firstWord)) {
      strongFound.add(firstWord);
      hasStrongLead = true;
    }

    // Check if any strong verb appears in the sentence
    for (const verb of ALL_STRONG_VERBS) {
      const regex = new RegExp(`\\b${verb}\\b`, 'i');
      if (regex.test(cleanBullet)) {
        strongFound.add(verb);
      }
    }

    if (hasStrongLead) {
      bulletsStartingWithStrong++;
    }

    // Check for weak verbs
    for (const [weakPhrase, replacements] of Object.entries(WEAK_VERBS)) {
      if (
        cleanBullet.startsWith(weakPhrase) ||
        firstTwoWords === weakPhrase ||
        firstThreeWords === weakPhrase ||
        cleanBullet.includes(` ${weakPhrase} `)
      ) {
        weakFound.push({
          found: weakPhrase,
          context: bullet.length > 70 ? bullet.slice(0, 67) + '...' : bullet,
          replacements
        });
        bulletsWithWeak++;
        break;
      }
    }
  }

  const strongRatio = bulletPoints.length > 0 ? (bulletsStartingWithStrong / bulletPoints.length) : 0;
  const weakPenalty = Math.min(30, bulletsWithWeak * 10);
  const rawScore = Math.round((strongRatio * 75) + (Math.min(strongFound.size, 10) * 3) - weakPenalty);
  const score = Math.max(20, Math.min(100, rawScore));

  const suggestions = [];
  if (weakFound.length > 0) {
    suggestions.push(`Replace weak phrase "${weakFound[0].found}" with impactful alternatives like "${weakFound[0].replacements.slice(0, 2).join('" or "')}".`);
  }
  if (strongRatio < 0.6) {
    suggestions.push('Begin more bullet points directly with past-tense action verbs (e.g., "Architected", "Optimized", "Delivered").');
  }
  if (strongFound.size < 5) {
    suggestions.push('Diversify your vocabulary across leadership, optimization, and technical impact verbs.');
  }

  return {
    score,
    totalBullets: bulletPoints.length,
    strongCount: strongFound.size,
    weakCount: weakFound.length,
    strongVerbsFound: Array.from(strongFound),
    weakVerbsFound: weakFound,
    suggestions: suggestions.length > 0 ? suggestions : ['Excellent use of powerful action verbs throughout your experience!']
  };
}

module.exports = {
  STRONG_VERBS,
  ALL_STRONG_VERBS,
  WEAK_VERBS,
  analyzeActionVerbs
};
