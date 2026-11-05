const { test, describe } = require('node:test');
const assert = require('node:assert');
const { analyzeResumeAgainstJob, getScoreTier } = require('../src/analyzer/atsEngine');
const { SAMPLE_RESUMES, SAMPLE_JOB_DESCRIPTIONS } = require('../src/samples/sampleData');

describe('Master ATS Scoring Engine', () => {
  test('correctly maps score tiers and verdicts', () => {
    assert.strictEqual(getScoreTier(90).tier, 'Excellent');
    assert.strictEqual(getScoreTier(75).tier, 'Competitive');
    assert.strictEqual(getScoreTier(60).tier, 'Needs Optimization');
    assert.strictEqual(getScoreTier(40).tier, 'At Risk');
  });

  test('produces high ATS score for well-matched Senior Resume', () => {
    const resume = SAMPLE_RESUMES.seniorFullStack.text;
    const jd = SAMPLE_JOB_DESCRIPTIONS.seniorFullStackJob.text;

    const analysis = analyzeResumeAgainstJob(resume, jd);

    assert.ok(analysis.overallScore >= 80, `Expected score >= 80, got ${analysis.overallScore}`);
    assert.ok(analysis.breakdown.keywordMatch.score >= 70);
    assert.ok(analysis.breakdown.metricsAndImpact.score >= 70);
    assert.ok(analysis.strengths.length > 0);
  });

  test('produces lower score for unoptimized junior resume', () => {
    const resume = SAMPLE_RESUMES.juniorDev.text;
    const jd = SAMPLE_JOB_DESCRIPTIONS.seniorFullStackJob.text;

    const analysis = analyzeResumeAgainstJob(resume, jd);

    assert.ok(analysis.overallScore < 70, `Expected score < 70, got ${analysis.overallScore}`);
    assert.ok(analysis.actionPlan.length > 0);
  });
});
