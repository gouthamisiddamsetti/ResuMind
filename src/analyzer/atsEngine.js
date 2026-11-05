/**
 * ResuMind - Master ATS Scoring Engine
 * Combines keyword matching, structural parseability, action verbs,
 * and quantifiable metrics into an overall ATS compatibility score.
 */

const { analyzeSkillGap } = require('./keywordExtractor');
const { analyzeActionVerbs } = require('./actionVerbs');
const { analyzeMetrics } = require('./metricsDetector');
const { parseResume } = require('./sectionParser');

/**
 * Score rating label and color theme
 */
function getScoreTier(score) {
  if (score >= 85) {
    return {
      tier: 'Excellent',
      verdict: 'High probability of passing ATS filters and landing recruiter interviews.',
      badgeColor: '#10b981' // Emerald
    };
  } else if (score >= 70) {
    return {
      tier: 'Competitive',
      verdict: 'Solid foundation, but a few missing keywords or weak metrics could hold it back.',
      badgeColor: '#3b82f6' // Blue
    };
  } else if (score >= 50) {
    return {
      tier: 'Needs Optimization',
      verdict: 'Candidate has relevant skills, but ATS parser may rank lower due to keyword or formatting gaps.',
      badgeColor: '#f59e0b' // Amber
    };
  } else {
    return {
      tier: 'At Risk',
      verdict: 'Critical gaps detected. Likely to be filtered out by automated screening filters.',
      badgeColor: '#ef4444' // Red
    };
  }
}

/**
 * Perform complete ATS analysis on a resume against a target job description
 * @param {string} resumeText Full text of resume
 * @param {string} jobDescription Full text of target job posting
 * @returns {object} Full ATS score card and breakdown
 */
function analyzeResumeAgainstJob(resumeText = '', jobDescription = '') {
  // 1. Structure & Section Parsing
  const parsed = parseResume(resumeText);

  // 2. Skill Gap & Keywords
  const skillAnalysis = analyzeSkillGap(resumeText, jobDescription);

  // 3. Action Verbs
  const verbAnalysis = analyzeActionVerbs(parsed.experienceBullets);

  // 4. Quantifiable Impact & Metrics
  const metricAnalysis = analyzeMetrics(parsed.experienceBullets);

  // Calculate Weighted Overall ATS Score
  // Weights:
  // - Keyword Match: 40%
  // - Quantifiable Metrics: 20%
  // - Action Verbs: 20%
  // - Structure & Format: 20%
  const keywordWeight = 0.40;
  const metricsWeight = 0.20;
  const verbsWeight = 0.20;
  const structureWeight = 0.20;

  const rawScore = (
    (skillAnalysis.matchPercentage * keywordWeight) +
    (metricAnalysis.score * metricsWeight) +
    (verbAnalysis.score * verbsWeight) +
    (parsed.structureScore * structureWeight)
  );

  const overallScore = Math.max(10, Math.min(100, Math.round(rawScore)));
  const tierInfo = getScoreTier(overallScore);

  // Generate prioritized action checklist
  const prioritizedActionItems = [];

  // Critical Missing Skills
  if (skillAnalysis.criticalMissingCount > 0) {
    const topMissing = skillAnalysis.missingSkills
      .filter(s => s.importance === 'critical')
      .slice(0, 3)
      .map(s => s.skill)
      .join(', ');
    prioritizedActionItems.push({
      priority: 'High',
      category: 'Keywords',
      action: `Incorporate high-priority missing skills: ${topMissing}. Mention them in your experience bullets or skills section.`
    });
  } else if (skillAnalysis.missingSkills.length > 0) {
    const topMissing = skillAnalysis.missingSkills.slice(0, 3).map(s => s.skill).join(', ');
    prioritizedActionItems.push({
      priority: 'Medium',
      category: 'Keywords',
      action: `Add missing relevant skills found in the job description: ${topMissing}.`
    });
  }

  // Formatting / Structure Action Items
  if (parsed.formattingFlags.length > 0) {
    prioritizedActionItems.push({
      priority: 'High',
      category: 'Structure',
      action: parsed.formattingFlags[0]
    });
  }

  // Metrics Action Items
  if (metricAnalysis.metricRatio < 0.5) {
    prioritizedActionItems.push({
      priority: 'Medium',
      category: 'Impact',
      action: 'Add quantified business metrics (%, $, scale, performance gains) to at least 50% of your experience bullet points.'
    });
  }

  // Action Verbs Action Items
  if (verbAnalysis.weakVerbsFound.length > 0) {
    prioritizedActionItems.push({
      priority: 'Medium',
      category: 'Verbs',
      action: `Replace passive phrasing like "${verbAnalysis.weakVerbsFound[0].found}" with proactive leadership and technical action verbs.`
    });
  }

  // Summary recommendation
  if (parsed.missingSections.includes('summary')) {
    prioritizedActionItems.push({
      priority: 'Low',
      category: 'Profile',
      action: 'Include a 2-3 sentence tailored Professional Summary highlighting your years of experience and core domain focus.'
    });
  }

  // Identify Strengths
  const strengths = [];
  if (parsed.contact.email && parsed.contact.phone && parsed.contact.linkedin) {
    strengths.push('Complete, professional contact and online profile links.');
  }
  if (skillAnalysis.matchedCount >= 5) {
    strengths.push(`Strong overlap with ${skillAnalysis.matchedCount} target job skills verified.`);
  }
  if (verbAnalysis.score >= 75) {
    strengths.push('Excellent use of commanding, past-tense action verbs.');
  }
  if (metricAnalysis.score >= 75) {
    strengths.push('High proportion of measurable outcomes and numerical evidence.');
  }
  if (parsed.wordCount >= 400 && parsed.wordCount <= 900) {
    strengths.push(`Optimal resume length (${parsed.wordCount} words) perfectly suited for standard ATS scanning.`);
  }

  return {
    overallScore,
    tier: tierInfo.tier,
    verdict: tierInfo.verdict,
    badgeColor: tierInfo.badgeColor,
    breakdown: {
      keywordMatch: {
        score: skillAnalysis.matchPercentage,
        weight: '40%',
        matchedCount: skillAnalysis.matchedCount,
        missingCount: skillAnalysis.missingCount,
        totalJdSkills: skillAnalysis.totalJdSkills,
        matchedSkills: skillAnalysis.matchedSkills,
        missingSkills: skillAnalysis.missingSkills,
        extraSkills: skillAnalysis.extraSkills
      },
      metricsAndImpact: {
        score: metricAnalysis.score,
        weight: '20%',
        metricRatio: metricAnalysis.metricRatio,
        bulletsWithMetrics: metricAnalysis.metricBulletsCount,
        totalBullets: metricAnalysis.totalBullets,
        detectedMetrics: metricAnalysis.detectedMetrics,
        suggestions: metricAnalysis.suggestions
      },
      actionVerbs: {
        score: verbAnalysis.score,
        weight: '20%',
        strongCount: verbAnalysis.strongCount,
        weakCount: verbAnalysis.weakCount,
        strongVerbs: verbAnalysis.strongVerbsFound,
        weakVerbs: verbAnalysis.weakVerbsFound,
        suggestions: verbAnalysis.suggestions
      },
      structureAndAts: {
        score: parsed.structureScore,
        weight: '20%',
        wordCount: parsed.wordCount,
        detectedSections: parsed.detectedSections,
        missingSections: parsed.missingSections,
        contact: parsed.contact,
        flags: parsed.formattingFlags
      }
    },
    strengths: strengths.length > 0 ? strengths : ['Baseline resume submitted. Optimization will provide rapid score improvements.'],
    actionPlan: prioritizedActionItems
  };
}

module.exports = {
  getScoreTier,
  analyzeResumeAgainstJob
};
