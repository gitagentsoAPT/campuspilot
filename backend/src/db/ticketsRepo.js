// Real Exasol-backed implementation of the tickets repository.
// Routes/agents depend on this *shape*, not on Exasol directly — tests
// inject an in-memory fake with the same shape (see test/fakeTicketsRepo.js).
import { withConnection } from './connection.js';

function rowToTicket(row) {
  return {
    ticketId: row.TICKET_ID,
    studentId: row.STUDENT_ID,
    description: row.DESCRIPTION,
    category: row.CATEGORY,
    department: row.DEPARTMENT,
    location: row.LOCATION,
    priority: row.PRIORITY,
    status: row.STATUS,
    createdAt: row.CREATED_AT,
    updatedAt: row.UPDATED_AT
  };
}

// The driver's prepared-statement `execute()` (used for INSERT/UPDATE below)
// doesn't return rows in a convenient shape, so reads that need a dynamic
// value go through `query()` with a manually-escaped literal instead of a
// placeholder. Only ever call this on values you're about to inline into
// SQL text — never build a string with a raw, un-escaped value.
function escapeSqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

export const exasolTicketsRepo = {
  async nextTicketId() {
    return withConnection(async (driver) => {
      const result = await driver.query('SELECT COUNT(*) AS CNT FROM TICKETS');
      const count = Number(result.getRows()[0].CNT);
      return `CP${1000 + count + 1}`;
    });
  },

  async createTicket(ticket) {
    return withConnection(async (driver) => {
      const statement = await driver.prepare(
        `INSERT INTO TICKETS
          (TICKET_ID, STUDENT_ID, DESCRIPTION, CATEGORY, DEPARTMENT, LOCATION, PRIORITY, STATUS)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      );
      try {
        await statement.execute(
          ticket.ticketId,
          ticket.studentId ?? null,
          ticket.description,
          ticket.category,
          ticket.department,
          ticket.location ?? null,
          ticket.priority,
          ticket.status ?? 'OPEN'
        );
      } finally {
        await statement.close();
      }
      return ticket;
    });
  },

  async listTickets() {
    return withConnection(async (driver) => {
      const result = await driver.query('SELECT * FROM TICKETS ORDER BY CREATED_AT DESC');
      return result.getRows().map(rowToTicket);
    });
  },

  async getTicket(ticketId) {
    return withConnection(async (driver) => {
      const result = await driver.query(
        `SELECT * FROM TICKETS WHERE TICKET_ID = ${escapeSqlString(ticketId)}`
      );
      const rows = result.getRows();
      return rows.length ? rowToTicket(rows[0]) : null;
    });
  },

  async updateTicketStatus(ticketId, status) {
    return withConnection(async (driver) => {
      const statement = await driver.prepare(
        'UPDATE TICKETS SET STATUS = ?, UPDATED_AT = CURRENT_TIMESTAMP WHERE TICKET_ID = ?'
      );
      try {
        await statement.execute(status, ticketId);
      } finally {
        await statement.close();
      }
    });
  },

  async listOpenTickets() {
    return withConnection(async (driver) => {
      const result = await driver.query(
        "SELECT * FROM TICKETS WHERE STATUS = 'OPEN' ORDER BY CREATED_AT ASC"
      );
      return result.getRows().map(rowToTicket);
    });
  },

  async createFollowup(followup) {
    return withConnection(async (driver) => {
      const statement = await driver.prepare(
        'INSERT INTO FOLLOWUPS (TICKET_ID, ACTION, MESSAGE) VALUES (?, ?, ?)'
      );
      try {
        await statement.execute(followup.ticketId, followup.action, followup.message);
      } finally {
        await statement.close();
      }
    });
  }
};
