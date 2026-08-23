# CampusPilot

A hackathon project — students report campus issues (broken projector, leaking pipe, whatever) in plain text, and the system figures out what it is, how urgent it is, who should fix it, creates a ticket, and follows up if nobody handles it in time.

## What's in here

- `frontend/` — the React app students and admins actually use
- `backend/` — APIs + the AI agents that do the triage/routing/follow-up (Person 2's part)

## Running the frontend

```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:5173`

## Tests

```bash
cd frontend
npm run test
```

## Pages

- `/` — submit a complaint
- `/dashboard` — admin view, resolve tickets, trigger follow-up
- `/ticket/:id` — view a single ticket

## Status

Frontend's done. Backend and the AI agents are still being built — once that's ready we'll hook this up to real data instead of the placeholder stuff it's using now.