const { test, describe } = require('node:test');
const assert = require('node:assert');
const { analyzeActionVerbs } = require('../src/analyzer/actionVerbs');

describe('Action Verbs Analyzer', () => {
  test('rewards strong action verbs at start of bullets', () => {
    const bullets = [
      'Spearheaded the redesign of the cloud platform microservices.',
      'Architected distributed caching layers with Redis.',
      'Optimized database queries, reducing latency by 45%.'
    ];

    const result = analyzeActionVerbs(bullets);
    assert.ok(result.score >= 80, `Expected score >= 80, got ${result.score}`);
    assert.strictEqual(result.strongCount, 3);
    assert.strictEqual(result.weakCount, 0);
  });

  test('flags weak verbs and provides constructive replacements', () => {
    const bullets = [
      'Worked on website frontend using React.',
      'Helped team build new features.',
      'Was responsible for bug fixing.'
    ];

    const result = analyzeActionVerbs(bullets);
    assert.ok(result.weakCount >= 2, `Expected at least 2 weak verbs, got ${result.weakCount}`);
    assert.ok(result.suggestions.length > 0);
  });

  test('gracefully handles empty input', () => {
    const result = analyzeActionVerbs([]);
    assert.strictEqual(result.totalBullets, 0);
    assert.ok(result.score > 0);
  });
});
