-- CampusPilot schema for Exasol Personal
-- Run with: npm run db:migrate

CREATE SCHEMA IF NOT EXISTS CAMPUSPILOT;
OPEN SCHEMA CAMPUSPILOT;

CREATE TABLE IF NOT EXISTS students (
  student_id  VARCHAR(50)   NOT NULL,
  name        VARCHAR(200),
  email       VARCHAR(200),
  CONSTRAINT students_pk PRIMARY KEY (student_id)
);

-- ticket_id is a human-friendly code like 'CP1024', generated in the
-- Action Agent (see src/agents/actionAgent.js) rather than a raw DB
-- identity value, so it matches what the spec shows students/admins.
CREATE TABLE IF NOT EXISTS tickets (
  ticket_id    VARCHAR(20)    NOT NULL,
  student_id   VARCHAR(50),
  description  VARCHAR(2000)  NOT NULL,
  category     VARCHAR(50)    NOT NULL,
  department   VARCHAR(100)   NOT NULL,
  location     VARCHAR(200),
  priority     VARCHAR(20)    NOT NULL,
  status       VARCHAR(20)    NOT NULL DEFAULT 'OPEN',
  created_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT tickets_pk PRIMARY KEY (ticket_id)
);

CREATE TABLE IF NOT EXISTS followups (
  followup_id  INTEGER IDENTITY,
  ticket_id    VARCHAR(20)   NOT NULL,
  action       VARCHAR(50)   NOT NULL,
  message      VARCHAR(1000),
  created_at   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT followups_pk PRIMARY KEY (followup_id)
);
