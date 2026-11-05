/**
 * ResuMind - AI Bullet Point Optimizer
 * Transforms weak, passive resume bullet points into high-impact,
 * STAR-method bullets (Situation, Task, Action, Result) with strong action verbs.
 */

const { ALL_STRONG_VERBS, WEAK_VERBS } = require('../analyzer/actionVerbs');

/**
 * Generate 3 optimized STAR-method variations of a resume bullet point
 * @param {string} rawBullet Weak or draft bullet point
 * @param {string} roleContext Optional target role (e.g., 'Senior Software Engineer')
 * @returns {object} Three high-impact variations and breakdown
 */
function optimizeBulletPoint(rawBullet = '', roleContext = 'Software Engineer') {
  const clean = (rawBullet || '').trim();
  if (!clean) {
    return {
      original: '',
      variations: [],
      error: 'Please enter a bullet point to optimize.'
    };
  }

  // Clean lead markers (-, *, •)
  const textWithoutMarker = clean.replace(/^[-*•\d.]\s*/, '').trim();

  // Extract core action or phrase
  let coreAction = textWithoutMarker;
  let detectedWeak = null;

  for (const [weakPhrase] of Object.entries(WEAK_VERBS)) {
    const regex = new RegExp(`^${weakPhrase}\\b`, 'i');
    if (regex.test(textWithoutMarker)) {
      detectedWeak = weakPhrase;
      coreAction = textWithoutMarker.replace(regex, '').trim();
      break;
    }
  }

  // Capitalize first letter of remaining action
  if (coreAction.length > 0) {
    coreAction = coreAction.charAt(0).toLowerCase() + coreAction.slice(1);
  }

  // Clean trailing period
  coreAction = coreAction.replace(/\.+$/, '');

  // Variation 1: Technical & Scale Focus
  const var1 = `Architected and deployed enterprise-grade solutions for ${coreAction}, scaling system throughput by 35% and ensuring 99.9% uptime.`;

  // Variation 2: Performance & Business Metrics Focus
  const var2 = `Spearheaded optimization of ${coreAction}, reducing end-to-end processing latency by 42% and generating an estimated $45k in annual infrastructure savings.`;

  // Variation 3: Leadership & Cross-Functional Delivery Focus
  const var3 = `Orchestrated cross-functional initiative to deliver ${coreAction}, collaborating with 5+ cross-disciplinary stakeholders to launch 2 weeks ahead of schedule.`;

  return {
    original: clean,
    detectedWeakPhrase: detectedWeak,
    targetRole: roleContext,
    variations: [
      {
        style: 'Technical & System Scale',
        icon: 'zap',
        text: var1,
        highlights: ['Architected and deployed', 'scaling system throughput by 35%', '99.9% uptime']
      },
      {
        style: 'Metrics & Performance',
        icon: 'trending-up',
        text: var2,
        highlights: ['Spearheaded optimization', 'reducing end-to-end processing latency by 42%', '$45k savings']
      },
      {
        style: 'Leadership & Execution',
        icon: 'users',
        text: var3,
        highlights: ['Orchestrated cross-functional initiative', 'collaborating with 5+ stakeholders', 'launched 2 weeks ahead']
      }
    ],
    tips: [
      'Tailor the brackets with your actual company metrics or percentages if available.',
      'Always start your bullet points with a past-tense action verb (Spearheaded, Architected, Engineered).',
      'Follow the Google X-Y-Z formula: "Accomplished [X], as measured by [Y], by doing [Z]".'
    ]
  };
}

module.exports = {
  optimizeBulletPoint
};
