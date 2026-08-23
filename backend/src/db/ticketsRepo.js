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
    status: row.TICKET_STATUS,
    createdAt: row.CREATED_AT,
    updatedAt: row.UPDATED_AT
  };
}

function esc(value) {
  if (value === null || value === undefined) return 'NULL';
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
      const sql = `INSERT INTO TICKETS
        (TICKET_ID, STUDENT_ID, DESCRIPTION, CATEGORY, DEPARTMENT, LOCATION, PRIORITY, TICKET_STATUS)
       VALUES (${esc(ticket.ticketId)}, ${esc(ticket.studentId ?? null)}, ${esc(ticket.description)}, ${esc(ticket.category)}, ${esc(ticket.department)}, ${esc(ticket.location ?? null)}, ${esc(ticket.priority)}, ${esc(ticket.status ?? 'OPEN')})`;
      await driver.execute(sql);
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
        `SELECT * FROM TICKETS WHERE TICKET_ID = ${esc(ticketId)}`
      );
      const rows = result.getRows();
      return rows.length ? rowToTicket(rows[0]) : null;
    });
  },

  async updateTicketStatus(ticketId, status) {
    return withConnection(async (driver) => {
      const sql = `UPDATE TICKETS SET TICKET_STATUS = ${esc(status)}, UPDATED_AT = CURRENT_TIMESTAMP WHERE TICKET_ID = ${esc(ticketId)}`;
      await driver.execute(sql);
    });
  },

  async listOpenTickets() {
    return withConnection(async (driver) => {
      const result = await driver.query(
        "SELECT * FROM TICKETS WHERE TICKET_STATUS = 'OPEN' ORDER BY CREATED_AT ASC"
      );
      return result.getRows().map(rowToTicket);
    });
  },

  async createFollowup(followup) {
    return withConnection(async (driver) => {
      const sql = `INSERT INTO FOLLOWUPS (TICKET_ID, ACTION_TYPE, MESSAGE) VALUES (${esc(followup.ticketId)}, ${esc(followup.action)}, ${esc(followup.message)})`;
      await driver.execute(sql);
    });
  }
};