import { describe, test, expect } from 'vitest';
import { runFollowupCheck } from '../../src/agents/followupAgent.js';
import { createFakeTicketsRepo } from '../fakeTicketsRepo.js';

describe('Follow-up Agent', () => {
  test('an overdue OPEN ticket gets a reminder', async () => {
    const repo = createFakeTicketsRepo();
    await repo.createTicket({
      ticketId: 'CP1001',
      description: 'Projector broken',
      category: 'MAINTENANCE',
      department: 'AV Maintenance',
      priority: 'HIGH',
      status: 'OPEN'
    });
    // backdate creation so it counts as overdue
    repo._debug.tickets.get('CP1001').createdAt = new Date(Date.now() - 10 * 60_000).toISOString();

    const results = await runFollowupCheck({ repo, overdueMinutes: 2 });

    expect(results).toEqual([
      expect.objectContaining({ ticketId: 'CP1001', reminded: true, department: 'AV Maintenance' })
    ]);
    expect(repo._debug.followups).toHaveLength(1);
    expect(repo._debug.followups[0].action).toBe('REMINDER');
  });

  test('a fresh OPEN ticket does not get a reminder yet', async () => {
    const repo = createFakeTicketsRepo();
    await repo.createTicket({
      ticketId: 'CP1002',
      description: 'Chair broken',
      category: 'MAINTENANCE',
      department: 'General Maintenance',
      priority: 'LOW',
      status: 'OPEN'
    });

    const results = await runFollowupCheck({ repo, overdueMinutes: 2 });

    expect(results).toEqual([expect.objectContaining({ ticketId: 'CP1002', reminded: false })]);
    expect(repo._debug.followups).toHaveLength(0);
  });

  test('a RESOLVED ticket is not checked at all', async () => {
    const repo = createFakeTicketsRepo();
    await repo.createTicket({
      ticketId: 'CP1003',
      description: 'Wifi down',
      category: 'IT',
      department: 'IT Support',
      priority: 'MEDIUM',
      status: 'OPEN'
    });
    await repo.updateTicketStatus('CP1003', 'RESOLVED');

    const results = await runFollowupCheck({ repo, overdueMinutes: 0 });

    expect(results).toHaveLength(0);
    expect(repo._debug.followups).toHaveLength(0);
  });
});
