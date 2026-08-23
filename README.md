# CampusPilot

A hackathon project — students report campus issues (broken projector, leaking pipe, whatever) in plain text, and the system figures out what it is, how urgent it is, who should fix it, creates a ticket, and follows up if nobody handles it in time.

## Demo

[Watch the demo video](https://drive.google.com/file/d/1br9YY90PgAbBUDAZOyWWy0u_ajKTFUh6/view?usp=sharing)

## Whats in here

- `frontend/` — the React app students and admins actually use
- `backend/` — APIs + the AI agents that do the triage/routing/follow-up, backed by Exasol

## Running it

### Backend

Needs Docker (for a local Exasol instance) and Node.js.

```bash
docker run -d --privileged --name campuspilot-exasol -p 8563:8563 exasol/docker-db:latest

cd backend
npm install
cp .env.example .env   # fill in EXASOL_PASSWORD=exasol
npm run db:migrate
npm run dev
```

Runs on `http://localhost:4000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`

## Tests

```bash
cd frontend
npm run test

cd backend
npm run test
```

## Pages

- `/` — submit a comlaint
- `/dashboard` — admin view, resolve tickets, trigger follow-up
- `/ticket/:id` — view a single ticket

## Status

Working end to end — complaint submission, AI triage, ticket creation, dashboard, resolve, and the follow-up agent are all live and connected to a real Exasol database.