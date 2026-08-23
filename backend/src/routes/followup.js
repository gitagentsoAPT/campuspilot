import { Router } from 'express';
import { runFollowupCheck } from '../agents/followupAgent.js';

export function followupRouter({ repo }) {
  const router = Router();

  router.post('/', async (_req, res) => {
    try {
      const results = await runFollowupCheck({ repo });
      res.json({ results });
    } catch (err) {
      console.error('POST /api/followup failed:', err);
      res.status(500).json({ error: 'Follow-up check failed' });
    }
  });

  return router;
}
