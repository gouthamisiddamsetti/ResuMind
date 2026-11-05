const { test, describe } = require('node:test');
const assert = require('node:assert');
const { analyzeMetrics } = require('../src/analyzer/metricsDetector');

describe('Metrics & Quantifiable Impact Detector', () => {
  test('detects percentages, currency, and latency metrics', () => {
    const bullets = [
      'Accelerated build pipeline speed by 42% and slashed server spend by $30k/year.',
      'Reduced API response times to sub-50ms for 250k daily active users.',
      'Maintained 99.99% system availability over 18 months.'
    ];

    const result = analyzeMetrics(bullets);
    assert.strictEqual(result.metricBulletsCount, 3);
    assert.strictEqual(result.metricRatio, 1);
    assert.ok(result.score >= 85);
    assert.ok(result.detectedMetrics.length >= 3);
  });

  test('identifies bullets that lack metrics', () => {
    const bullets = [
      'Built various web pages with HTML and CSS.',
      'Attended weekly standups and coordinated with designers.'
    ];

    const result = analyzeMetrics(bullets);
    assert.strictEqual(result.metricBulletsCount, 0);
    assert.strictEqual(result.metricRatio, 0);
    assert.ok(result.bulletsNeedingMetrics.length === 2);
  });
});
