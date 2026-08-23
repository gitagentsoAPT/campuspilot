import { Router } from 'express';
import { createTicketFromTriage } from '../agents/actionAgent.js';

export function complaintsRouter({ repo, triageAgent }) {
  const router = Router();

  router.post('/', async (req, res) => {
    const { student_id: studentId, message } = req.body ?? {};

    if (typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ error: 'message is required' });
    }

    try {
      const triageResult = await triageAgent(message);
      const ticket = await createTicketFromTriage({
        repo,
        studentId,
        description: message,
        triageResult
      });

      res.status(201).json({
        ticketId: ticket.ticketId,
        category: ticket.category,
        department: ticket.department,
        location: ticket.location,
        priority: ticket.priority,
        status: ticket.status
      });
    } catch (err) {
      console.error('POST /api/complaints failed:', err);
      res.status(500).json({ error: 'Failed to create ticket' });
    }
  });

  return router;
}
