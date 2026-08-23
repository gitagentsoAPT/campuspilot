/**
 * Follow-up Agent: checks OPEN tickets and, for ones that have been
 * sitting too long, sends a reminder to the department and notifies the
 * student. For the hackathon this is triggered manually by the
 * "Simulate Follow-up" button (POST /api/followup) instead of a real
 * scheduler — see README for why that's the right call for a 1-day MVP.
 */
const DEFAULT_OVERDUE_MINUTES = Number(process.env.FOLLOWUP_OVERDUE_MINUTES || 2);

function minutesSince(date) {
  return (Date.now() - new Date(date).getTime()) / 60000;
}

export async function runFollowupCheck({ repo, overdueMinutes = DEFAULT_OVERDUE_MINUTES, now = new Date() }) {
  const openTickets = await repo.listOpenTickets();
  const results = [];

  for (const ticket of openTickets) {
    const overdue = minutesSince(ticket.createdAt ?? now) >= overdueMinutes;
    if (!overdue) {
      results.push({ ticketId: ticket.ticketId, reminded: false, reason: 'not overdue yet' });
      continue;
    }

    const message = `Reminder sent to ${ticket.department}. Student notified.`;
    await repo.createFollowup({ ticketId: ticket.ticketId, action: 'REMINDER', message });

    results.push({
      ticketId: ticket.ticketId,
      reminded: true,
      department: ticket.department,
      message: `Ticket ${ticket.ticketId} is still unresolved. ${message}`
    });
  }

  return results;
}
