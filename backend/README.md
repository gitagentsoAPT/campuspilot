# CampusPilot Backend

Node.js/Express backend implementing the Triage Agent, Action Agent, and
Follow-up Agent as logical modules, backed by Exasol Personal.

## Phase 1 — Get Exasol Personal running (do this first)

Exasol Personal's local mode currently supports **macOS only** (Apple
silicon, macOS 15+, 8 GB+ RAM). Run these in a real Terminal on your Mac —
not in a container/VM.

```bash
# 1. Install the Exasol Launcher (installs to ~/.local/bin)
curl https://www.exasol.com/install/ | sh

# 2. Deploy a local single-user database (~10-20 min the first time)
mkdir -p ~/campuspilot-exasol && cd ~/campuspilot-exasol
exasol install local

# 3. Get your connection details (host, port, user, password)
exasol info

# 4. Sanity-check the client works
exasol connect
```

`exasol info` prints the values you need for `backend/.env` — copy
`backend/.env.example` to `backend/.env` and fill in `EXASOL_HOST`,
`EXASOL_PORT`, `EXASOL_USER`, `EXASOL_PASSWORD` from that output.

**Common errors**
- `command not found: exasol` → `~/.local/bin` isn't on your `PATH`. Add
  `export PATH="$HOME/.local/bin:$PATH"` to your shell profile and open a
  new terminal.
- Install hangs or fails on Intel Macs → local deployment currently
  requires Apple silicon. Use one of the cloud options (`exasol install
  aws`, etc.) instead, or ask a teammate with an M-series Mac to host it.
- `exasol connect` hangs → check Docker/virtualization isn't blocked by
  an MDM/corporate profile; corporate laptops can block this.

## Phase 2/3/4 — Install, configure, migrate, run

```bash
cd backend
npm install
cp .env.example .env        # then fill in the EXASOL_* values from `exasol info`
npm run db:migrate          # creates the CAMPUSPILOT schema + 3 tables
npm run dev                 # starts the API on http://localhost:4000
```

Verify the schema was created:

```bash
exasol connect
# then, at the SQL prompt:
SELECT * FROM CAMPUSPILOT.TICKETS;
```

Verify the API is up:

```bash
curl http://localhost:4000/api/health
# {"ok":true}
```

## Triage Agent / LLM key (optional)

If `backend/.env` has no `ANTHROPIC_API_KEY`, the Triage Agent
automatically falls back to a deterministic keyword classifier
(`src/agents/classifier.js`) — the app still works end-to-end, just with
simpler classification. Add `ANTHROPIC_API_KEY=sk-ant-...` to `.env` to
use the real LLM. Either way, the backend validates whatever comes back
against the allowed category/priority lists before it's ever written to
Exasol — see `validateTriageResult` in `src/agents/triageAgent.js`.

## API

| Method | Path                | Purpose                              |
|--------|---------------------|---------------------------------------|
| POST   | `/api/complaints`   | Triage + create a ticket              |
| GET    | `/api/tickets`      | List all tickets (dashboard)          |
| GET    | `/api/tickets/:id`  | Get one ticket                        |
| PUT    | `/api/tickets/:id`  | Update status (e.g. resolve)          |
| POST   | `/api/followup`     | Run the Follow-up Agent (the "Simulate Follow-up" button) |

## Tests

```bash
npm run test:unit          # pure functions: classifier.js, triageAgent validation
npm run test:integration   # full request -> triage -> ticket flow, Exasol mocked
npm test                   # both
```

Integration tests never touch a live Exasol instance or a live LLM — they
inject an in-memory fake repo (`test/fakeTicketsRepo.js`) and a mocked
Triage Agent function into `createApp()`. This is what makes them safe to
run in CI (see `.github/workflows/ci.yml` at the repo root) without an
Exasol database available.

## Architecture notes (why it's built this way)

- **One connection per request, no pool.** Exasol Personal is single-user
  and this is a hackathon demo with a handful of concurrent users at
  most — see the comment in `src/db/connection.js`.
- **Ticket IDs are app-generated (`CP1024`, ...), not raw Exasol
  identities.** Matches the spec's example tickets and keeps the ID
  format decoupled from the DB.
- **Writes use prepared statements; the one dynamic read
  (`getTicket(id)`) uses an escaped literal**, because the driver's
  prepared-statement `execute()` doesn't return rows in a convenient
  shape. Routes also reject any `:id` that doesn't match `^CP\d+$` before
  it reaches SQL, as a second layer of defense — see
  `src/db/ticketsRepo.js` and `src/routes/tickets.js`.
- **The LLM is isolated behind `triage()` and never trusted blindly** —
  its JSON output is validated against the allowed category/priority
  enums, and any failure (missing key, network error, bad JSON, invalid
  enum value) falls back to the rule-based classifier instead of
  crashing the request.
