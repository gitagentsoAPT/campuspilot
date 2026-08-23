import express from 'express';
import cors from 'cors';
import { complaintsRouter } from './routes/complaints.js';
import { ticketsRouter } from './routes/tickets.js';
import { followupRouter } from './routes/followup.js';
import { triage } from './agents/triageAgent.js';
import { exasolTicketsRepo } from './db/ticketsRepo.js';

/**
 * Builds the Express app with its dependencies injected.
 *
 * In production (src/server.js) this is called with no args and wires up
 * the real Exasol repo + real (or rule-based-fallback) Triage Agent.
 * Tests call this with a fake in-memory repo and/or a mocked triage
 * function so they never touch Exasol or the LLM — see
 * test/integration/complaints.test.js.
 */
export function createApp({ repo = exasolTicketsRepo, triageAgent = triage } = {}) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => res.json({ ok: true }));

  app.use('/api/complaints', complaintsRouter({ repo, triageAgent }));
  app.use('/api/tickets', ticketsRouter({ repo }));
  app.use('/api/followup', followupRouter({ repo }));

  return app;
}
