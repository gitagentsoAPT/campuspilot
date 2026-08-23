# 🏫 CampusPilot

Autonomous AI system for handling student campus complaints.

Students describe a problem in plain language. The system understands it, decides its category and priority, creates a ticket, routes it to the right department, and follows up automatically if it goes unresolved.

## Project Structure

- `frontend/` — React app (student complaint form, admin dashboard, ticket detail page)
- `backend/` — Node.js APIs + AI agents (Triage, Action, Follow-up) + Exasol database

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

## Running Tests

```bash
cd frontend
npm run test
```

## Pages

- `/` — Student complaint submission
- `/dashboard` — Admin dashboard (view, resolve, and follow up on tickets)
- `/ticket/:id` — Individual ticket details

## Status

- ✅ Frontend built and tested
- ⏳ Backend + AI agents in progress
- ⏳ Backend integration pending