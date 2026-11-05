const { test, describe } = require('node:test');
const assert = require('node:assert');
const { optimizeBulletPoint } = require('../src/ai/bulletOptimizer');

describe('AI Bullet Point Optimizer', () => {
  test('generates 3 STAR variations for a weak bullet point', () => {
    const raw = 'Worked on backend API for user authentication';
    const result = optimizeBulletPoint(raw, 'Backend Engineer');

    assert.strictEqual(result.detectedWeakPhrase, 'worked on');
    assert.strictEqual(result.variations.length, 3);
    assert.ok(result.variations[0].text.includes('Architected and deployed'));
    assert.ok(result.variations[1].text.includes('Spearheaded optimization'));
    assert.ok(result.variations[2].text.includes('Orchestrated cross-functional initiative'));
  });

  test('handles empty input gracefully', () => {
    const result = optimizeBulletPoint('');
    assert.strictEqual(result.variations.length, 0);
    assert.ok(result.error);
  });
});
