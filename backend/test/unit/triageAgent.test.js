import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { triage, validateTriageResult } from '../../src/agents/triageAgent.js';

describe('validateTriageResult', () => {
  test('rejects an unknown category', () => {
    expect(
      validateTriageResult({ category: 'BOGUS', department: 'X', priority: 'LOW', summary: 'x' })
    ).toBeNull();
  });

  test('rejects an unknown priority', () => {
    expect(
      validateTriageResult({ category: 'IT', department: 'X', priority: 'SUPER_HIGH', summary: 'x' })
    ).toBeNull();
  });

  test('accepts a well-formed result and trims strings', () => {
    const result = validateTriageResult({
      category: 'IT',
      department: '  IT Support  ',
      location: null,
      priority: 'HIGH',
      summary: '  Wifi down  '
    });
    expect(result).toEqual({
      category: 'IT',
      department: 'IT Support',
      location: null,
      priority: 'HIGH',
      summary: 'Wifi down'
    });
  });
});

describe('triage() without an API key', () => {
  const originalKey = process.env.ANTHROPIC_API_KEY;

  beforeEach(() => {
    delete process.env.ANTHROPIC_API_KEY;
  });
  afterEach(() => {
    if (originalKey) process.env.ANTHROPIC_API_KEY = originalKey;
  });

  test('falls back to the rule-based classifier and never throws', async () => {
    const result = await triage('The projector in AB2-304 is not working and I have a presentation');
    expect(result.category).toBe('MAINTENANCE');
    expect(result.department).toBe('AV Maintenance');
    expect(result.priority).toBe('HIGH');
    expect(result.source).toContain('rule-based');
  });
});
