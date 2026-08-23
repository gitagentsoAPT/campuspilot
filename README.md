# CampusPilot

Autonomous campus operations agent. A student describes a problem in plain
English; CampusPilot triages it, creates and routes a ticket, stores it in
Exasol, shows it on an admin dashboard, and follows up automatically if it
stays unresolved.

- **Frontend** — this directory (Vite + React). `npm install && npm run dev`.
- **Backend** — [`backend/`](./backend) (Node.js/Express + Exasol Personal +
  the Triage/Action/Follow-up agents). Start there for setup: **get Exasol
  running first**, per [`backend/README.md`](./backend/README.md).

## Repo layout

```text
.
├── src/               frontend (Vite/React) — complaint page + admin dashboard
├── backend/            Express API, Exasol schema/migration, 3 logical agents
│   ├── src/agents/      triageAgent.js, actionAgent.js, followupAgent.js
│   ├── src/db/          connection.js, schema.sql, migrate.js, ticketsRepo.js
│   ├── src/routes/      complaints.js, tickets.js, followup.js
│   └── test/            unit + integration tests (LLM and Exasol both mocked)
└── .github/workflows/  CI: frontend tests+build, backend unit+integration tests
```

## Quick start (both halves)

```bash
# Terminal 1 — backend (see backend/README.md for the Exasol setup step first)
cd backend && npm install && npm run db:migrate && npm run dev

# Terminal 2 — frontend
npm install && npm run dev
```