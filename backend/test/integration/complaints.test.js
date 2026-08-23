import { describe, test, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { createFakeTicketsRepo } from '../fakeTicketsRepo.js';

// Mocked Triage Agent, per spec section 18 — integration tests must be
// deterministic and never depend on a live LLM.
const mockTriageAgent = vi.fn().mockResolvedValue({
  category: 'MAINTENANCE',
  department: 'AV Maintenance',
  priority: 'HIGH',
  location: 'AB2-304',
  summary: 'Projector not working'
});

describe('full complaint -> ticket workflow (Exasol mocked with in-memory repo)', () => {
  test('POST /api/complaints creates an OPEN ticket with the triaged fields', async () => {
    const repo = createFakeTicketsRepo();
    const app = createApp({ repo, triageAgent: mockTriageAgent });

    const response = await request(app)
      .post('/api/complaints')
      .send({ student_id: 'STU101', message: "Projector in AB2-304 isn't working" });

    expect(response.status).toBe(201);
    expect(response.body.category).toBe('MAINTENANCE');
    expect(response.body.department).toBe('AV Maintenance');
    expect(response.body.status).toBe('OPEN');
    expect(response.body.ticketId).toMatch(/^CP\d+$/);

    const ticket = await repo.getTicket(response.body.ticketId);
    expect(ticket).toMatchObject({ category: 'MAINTENANCE', department: 'AV Maintenance', status: 'OPEN' });
  });

  test('POST /api/complaints with an empty message is rejected', async () => {
    const app = createApp({ repo: createFakeTicketsRepo(), triageAgent: mockTriageAgent });
    const response = await request(app).post('/api/complaints').send({ message: '   ' });
    expect(response.status).toBe(400);
  });

  test('GET /api/tickets lists created tickets, and PUT resolves one', async () => {
    const repo = createFakeTicketsRepo();
    const app = createApp({ repo, triageAgent: mockTriageAgent });

    const created = await request(app)
      .post('/api/complaints')
      .send({ message: 'Projector broken' });
    const { ticketId } = created.body;

    const list = await request(app).get('/api/tickets');
    expect(list.body).toHaveLength(1);

    const resolved = await request(app).put(`/api/tickets/${ticketId}`).send({ status: 'RESOLVED' });
    expect(resolved.status).toBe(200);
    expect(resolved.body.status).toBe('RESOLVED');
  });

  test('PUT /api/tickets/:id with an invalid status is rejected', async () => {
    const app = createApp({ repo: createFakeTicketsRepo(), triageAgent: mockTriageAgent });
    const response = await request(app).put('/api/tickets/CP9999').send({ status: 'NOT_A_STATUS' });
    expect(response.status).toBe(400);
  });
});
