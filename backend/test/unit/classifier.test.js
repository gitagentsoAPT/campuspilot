import { describe, test, expect } from 'vitest';
import { getCategory, getDepartment, getPriority, extractLocation } from '../../src/agents/classifier.js';

describe('classifier (rule-based fallback / offline Triage Agent)', () => {
  test('projector issue goes to AV Maintenance', () => {
    expect(getDepartment('The projector in AB2-304 is not working')).toBe('AV Maintenance');
  });

  test('wifi issue goes to IT Support', () => {
    expect(getDepartment('Wi-Fi is not working in my hostel room')).toBe('IT Support');
  });

  test('academic issue goes to Academic Office', () => {
    expect(getDepartment('My exam grade seems incorrect, need help from the professor')).toBe('Academic Office');
  });

  test('urgent presentation is HIGH priority', () => {
    expect(getPriority('The projector is broken and I have a presentation in 10 minutes')).toBe('HIGH');
  });

  test('normal maintenance request is MEDIUM priority', () => {
    expect(getPriority('The light in the hallway flickers sometimes')).toBe('MEDIUM');
  });

  test('safety issue is CRITICAL priority', () => {
    expect(getPriority('There is a fire alarm going off and it feels unsafe')).toBe('CRITICAL');
  });

  test('category defaults to MAINTENANCE for generic broken-thing complaints', () => {
    expect(getCategory('The chair in room 12 is broken')).toBe('MAINTENANCE');
  });

  test('extracts a room code from the message', () => {
    expect(extractLocation('The projector in AB2-304 is not working')).toBe('AB2-304');
  });
});
