// Pure, deterministic keyword-based classifier.
//
// This is used two ways:
//   1. As the Triage Agent's fallback when no ANTHROPIC_API_KEY is set, or
//      when the LLM call fails / returns something we can't validate — so
//      a flaky network or a missing key never breaks the demo.
//   2. Directly, in unit tests, since these are cheap pure functions with
//      no I/O (see test/unit/classifier.test.js).
//
// The LLM (triageAgent.js) is strictly better at understanding free-form
// text, but this keeps the system honest: every backend operation does
// NOT depend on the LLM being available.

export const CATEGORIES = ['IT', 'MAINTENANCE', 'ACADEMIC', 'SECURITY', 'LOST_FOUND'];
export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

const CATEGORY_KEYWORDS = [
  { category: 'IT', keywords: ['wifi', 'wi-fi', 'internet', 'network', 'password', 'login', 'laptop', 'computer', 'software'] },
  { category: 'SECURITY', keywords: ['theft', 'stolen', 'stranger', 'unsafe', 'harassment', 'fire', 'security', 'intruder'] },
  { category: 'LOST_FOUND', keywords: ['lost my', 'lost a', 'found a', 'missing item', 'left my', 'misplaced'] },
  { category: 'ACADEMIC', keywords: ['grade', 'exam', 'professor', 'assignment', 'syllabus', 'lecture', 'attendance', 'registration'] },
  {
    category: 'MAINTENANCE',
    keywords: ['projector', 'ac ', 'air condition', 'chair', 'light', 'plumbing', 'leak', 'door', 'elevator', 'broken', 'not working']
  }
];

export function getCategory(message) {
  const text = message.toLowerCase();
  for (const { category, keywords } of CATEGORY_KEYWORDS) {
    if (keywords.some((k) => text.includes(k))) return category;
  }
  return 'MAINTENANCE'; // safest default: routes to a human, not silently dropped
}

export function getDepartment(message) {
  const text = message.toLowerCase();
  const category = getCategory(message);

  if (category === 'MAINTENANCE') {
    if (['projector', 'av', 'audio', 'microphone', 'speaker', 'screen'].some((k) => text.includes(k))) {
      return 'AV Maintenance';
    }
    return 'General Maintenance';
  }
  if (category === 'IT') return 'IT Support';
  if (category === 'ACADEMIC') return 'Academic Office';
  if (category === 'SECURITY') return 'Campus Security';
  if (category === 'LOST_FOUND') return 'Lost & Found Office';
  return 'General Maintenance';
}

export function getPriority(message) {
  const text = message.toLowerCase();

  if (['fire', 'emergency', 'unsafe', 'injur', 'theft', 'stolen'].some((k) => text.includes(k))) {
    return 'CRITICAL';
  }
  if (['presentation', 'exam', 'today', 'right now', 'urgent', 'asap', 'in an hour'].some((k) => text.includes(k))) {
    return 'HIGH';
  }
  if (['whenever', 'no rush', 'not urgent', 'minor'].some((k) => text.includes(k))) {
    return 'LOW';
  }
  return 'MEDIUM';
}

// Looks for a room/building-style token, e.g. "AB2-304", "Library-2F", "Room 12".
export function extractLocation(message) {
  const roomCode = message.match(/\b[A-Za-z]{1,4}\d{1,4}[-\s]?\d{0,4}\b/);
  if (roomCode) return roomCode[0].trim();
  const roomWord = message.match(/\broom\s+\w+/i);
  if (roomWord) return roomWord[0].trim();
  return null;
}

export function classifyRuleBased(message) {
  return {
    category: getCategory(message),
    department: getDepartment(message),
    location: extractLocation(message),
    priority: getPriority(message),
    summary: message.trim().slice(0, 200)
  };
}
