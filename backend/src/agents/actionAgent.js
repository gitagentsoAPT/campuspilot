/**
 * Action Agent: takes the Triage Agent's validated structured output and
 * turns it into a real ticket — the step that makes this an agent that
 * *acts* rather than a chatbot that *answers*.
 *
 * `repo` is injected (real Exasol repo in production, fake in-memory repo
 * in tests) so this module has zero direct dependency on Exasol.
 */
export async function createTicketFromTriage({ repo, studentId, description, triageResult }) {
  const ticketId = await repo.nextTicketId();

  const ticket = {
    ticketId,
    studentId: studentId ?? null,
    description,
    category: triageResult.category,
    department: triageResult.department,
    location: triageResult.location,
    priority: triageResult.priority,
    status: 'OPEN'
  };

  await repo.createTicket(ticket);
  return ticket;
}

export async function resolveTicket({ repo, ticketId, status = 'RESOLVED' }) {
  const ticket = await repo.getTicket(ticketId);
  if (!ticket) return null;
  await repo.updateTicketStatus(ticketId, status);
  return { ...ticket, status };
}
