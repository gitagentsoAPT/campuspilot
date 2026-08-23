// In-memory stand-in for src/db/ticketsRepo.js, matching the same shape.
// Used by tests so nothing touches a live Exasol instance (see spec
// section 18/21: mock the LLM AND don't depend on live infra in CI).
export function createFakeTicketsRepo() {
  const tickets = new Map();
  const followups = [];

  return {
    async nextTicketId() {
      return `CP${1000 + tickets.size + 1}`;
    },
    async createTicket(ticket) {
      const now = new Date().toISOString();
      const stored = { ...ticket, createdAt: now, updatedAt: now };
      tickets.set(ticket.ticketId, stored);
      return stored;
    },
    async listTickets() {
      return [...tickets.values()].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    },
    async getTicket(ticketId) {
      return tickets.get(ticketId) ?? null;
    },
    async updateTicketStatus(ticketId, status) {
      const ticket = tickets.get(ticketId);
      if (ticket) {
        ticket.status = status;
        ticket.updatedAt = new Date().toISOString();
      }
    },
    async listOpenTickets() {
      return [...tickets.values()].filter((t) => t.status === 'OPEN');
    },
    async createFollowup(followup) {
      followups.push({ ...followup, createdAt: new Date().toISOString() });
    },
    // test-only helpers, not part of the real repo's shape
    _debug: { tickets, followups }
  };
}
