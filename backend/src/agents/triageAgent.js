import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import { CATEGORIES, PRIORITIES, classifyRuleBased } from './classifier.js';

const SYSTEM_PROMPT = `You are the CampusPilot Triage Agent.

Analyze the student's campus complaint and determine:
- category
- department
- location
- priority
- summary

Return ONLY valid JSON, no prose, no markdown fences. Shape:
{
  "category": "...",
  "department": "...",
  "location": "... or null",
  "priority": "...",
  "summary": "one short sentence"
}

Allowed categories: ${CATEGORIES.join(', ')}
Allowed priorities: ${PRIORITIES.join(', ')}

Department should be a short human-readable team name that fits the category,
e.g. "AV Maintenance", "IT Support", "Academic Office", "Campus Security",
"Lost & Found Office", "General Maintenance".`;

function validateTriageResult(result) {
  if (!result || typeof result !== 'object') return null;
  const { category, department, location, priority, summary } = result;

  if (!CATEGORIES.includes(category)) return null;
  if (!PRIORITIES.includes(priority)) return null;
  if (typeof department !== 'string' || department.trim() === '') return null;
  if (typeof summary !== 'string' || summary.trim() === '') return null;

  return {
    category,
    department: department.trim(),
    location: typeof location === 'string' && location.trim() !== '' ? location.trim() : null,
    priority,
    summary: summary.trim()
  };
}

function extractJson(text) {
  // Strip markdown fences if the model added them despite instructions.
  const cleaned = text.trim().replace(/^```(json)?/i, '').replace(/```$/, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

/**
 * Triage Agent: turns a free-text complaint into structured ticket fields.
 *
 * Never throws. If ANTHROPIC_API_KEY is unset, or the API call fails, or
 * the model's output doesn't validate against the allowed enums, this
 * falls back to the deterministic rule-based classifier — the backend
 * NEVER trusts raw LLM output, and the demo never breaks on a bad key or
 * a flaky network.
 */
export async function triage(message, { anthropicClient } = {}) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { ...classifyRuleBased(message), source: 'rule-based (no ANTHROPIC_API_KEY set)' };
  }

  try {
    const client = anthropicClient ?? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: message }]
    });

    const text = response.content?.[0]?.type === 'text' ? response.content[0].text : '';
    const parsed = extractJson(text);
    const validated = validateTriageResult(parsed);

    if (!validated) {
      return { ...classifyRuleBased(message), source: 'rule-based (LLM output failed validation)' };
    }
    return { ...validated, source: 'llm' };
  } catch (err) {
    return { ...classifyRuleBased(message), source: `rule-based (LLM error: ${err.message})` };
  }
}

export { validateTriageResult };
