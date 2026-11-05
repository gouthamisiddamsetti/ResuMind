/**
 * ResuMind - Metrics & Quantifiable Impact Detector
 * Scans resume bullet points for measurable outcomes: percentages, currency,
 * throughput, latency improvements, team scale, and user volumes.
 */

const METRIC_PATTERNS = [
  // Percentages: 45%, 12.5%, 100%
  /\b\d+(\.\d+)?%\b/g,
  // Multipliers: 2x, 10x, 3.5x
  /\b\d+(\.\d+)?x\b/gi,
  // Currency: $100k, $2.5M, €50,000, £10M, INR 5L
  /(\$|€|£|¥)\s*\d+([.,]\d+)?\s*(k|m|b|million|billion)?\b/gi,
  // Quantified counts with suffixes: 500k+, 10M+, 250+
  /\b\d+([.,]\d+)?\s*(k|m|b|million|billion)\+?\b/gi,
  /\b\d+\s*\+\b/g,
  // Time/latency reductions: 200ms, 2 seconds, 3 weeks, 40 hours
  /\b\d+\s*(ms|milliseconds|seconds|mins|minutes|hours|days|weeks|months)\b/gi,
  // High reliability / uptime: 99.9%, 99.999%
  /\b99\.\d+%\b/g,
  // Team/stakeholder scale: team of 8, 15 engineers, 50 stakeholders
  /\b(team of|managed|mentored|led)\s+\d+\b/gi
];

/**
 * Analyze quantifiable metrics in bullet points
 * @param {string[]} bulletPoints Array of bullet point strings
 * @returns {object} Metrics analysis & score
 */
function analyzeMetrics(bulletPoints = []) {
  if (!bulletPoints || bulletPoints.length === 0) {
    return {
      score: 40,
      metricBulletsCount: 0,
      totalBullets: 0,
      metricRatio: 0,
      detectedMetrics: [],
      bulletsNeedingMetrics: [],
      suggestions: ['Add numbers, percentages, and metrics to prove your impact (e.g. "increased revenue by 25%", "reduced latency by 120ms").']
    };
  }

  const detectedMetrics = [];
  const bulletsWithMetrics = [];
  const bulletsNeedingMetrics = [];

  bulletPoints.forEach((bullet, index) => {
    const matchedValues = [];
    for (const pattern of METRIC_PATTERNS) {
      const matches = bullet.match(pattern);
      if (matches) {
        matchedValues.push(...matches);
      }
    }

    if (matchedValues.length > 0) {
      bulletsWithMetrics.push({
        index,
        bullet,
        metrics: Array.from(new Set(matchedValues))
      });
      detectedMetrics.push(...matchedValues);
    } else {
      bulletsNeedingMetrics.push({
        index,
        bullet: bullet.length > 80 ? bullet.slice(0, 77) + '...' : bullet
      });
    }
  });

  const uniqueMetrics = Array.from(new Set(detectedMetrics));
  const metricRatio = bulletsWithMetrics.length / bulletPoints.length;

  // Good resumes have metrics in at least 40-50% of bullet points
  let score = Math.round(metricRatio * 70) + 20;
  if (uniqueMetrics.length >= 4) score += 20;
  else if (uniqueMetrics.length >= 2) score += 10;
  score = Math.max(25, Math.min(100, score));

  const suggestions = [];
  if (metricRatio < 0.4) {
    suggestions.push('Only ' + Math.round(metricRatio * 100) + '% of your experience bullets contain quantifiable metrics. Aim for at least 50%.');
  }
  if (bulletsNeedingMetrics.length > 0) {
    suggestions.push(`Quantify bullet points like: "${bulletsNeedingMetrics[0].bullet}" by adding the business or performance outcome.`);
  }
  suggestions.push('Apply the X-Y-Z formula: "Accomplished [X] as measured by [Y], by doing [Z]".');

  return {
    score,
    metricBulletsCount: bulletsWithMetrics.length,
    totalBullets: bulletPoints.length,
    metricRatio: Math.round(metricRatio * 100) / 100,
    detectedMetrics: uniqueMetrics.slice(0, 10),
    bulletsWithMetricsCount: bulletsWithMetrics.length,
    bulletsNeedingMetricsCount: bulletsNeedingMetrics.length,
    bulletsNeedingMetrics: bulletsNeedingMetrics.slice(0, 3),
    suggestions: suggestions.slice(0, 3)
  };
}

module.exports = {
  METRIC_PATTERNS,
  analyzeMetrics
};
