const { test, describe } = require('node:test');
const assert = require('node:assert');
const { extractSkills, analyzeSkillGap, normalizeSkill } = require('../src/analyzer/keywordExtractor');

describe('Keyword Extractor & Skill Gap Analyzer', () => {
  test('normalizes skill aliases correctly', () => {
    assert.strictEqual(normalizeSkill('k8s'), 'kubernetes');
    assert.strictEqual(normalizeSkill('react.js'), 'react');
    assert.strictEqual(normalizeSkill('nodejs'), 'node.js');
    assert.strictEqual(normalizeSkill('ts'), 'typescript');
  });

  test('extracts skills and aliases from raw text', () => {
    const text = 'Experienced in React, Node.js, TypeScript, Docker, and K8s with PostgreSQL backend.';
    const extracted = extractSkills(text);

    assert.ok(extracted.has('react'));
    assert.ok(extracted.has('node.js'));
    assert.ok(extracted.has('typescript'));
    assert.ok(extracted.has('docker'));
    assert.ok(extracted.has('kubernetes'));
    assert.ok(extracted.has('postgresql'));
  });

  test('computes accurate skill gap between resume and job description', () => {
    const resumeText = 'Skilled in TypeScript, Node.js, PostgreSQL, and AWS.';
    const jdText = 'Looking for an engineer skilled in TypeScript, Node.js, Python, Docker, and Kubernetes.';

    const gap = analyzeSkillGap(resumeText, jdText);

    assert.ok(gap.matchedCount >= 2);
    const matchedNames = gap.matchedSkills.map(s => s.skill);
    assert.ok(matchedNames.includes('typescript'));
    assert.ok(matchedNames.includes('node.js'));

    const missingNames = gap.missingSkills.map(s => s.skill);
    assert.ok(missingNames.includes('python'));
    assert.ok(missingNames.includes('docker'));
  });
});
