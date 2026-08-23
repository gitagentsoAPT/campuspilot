CREATE SCHEMA IF NOT EXISTS CAMPUSPILOT;
OPEN SCHEMA CAMPUSPILOT;

CREATE TABLE IF NOT EXISTS students (
  student_id  VARCHAR(50)   NOT NULL,
  full_name   VARCHAR(200),
  email       VARCHAR(200),
  CONSTRAINT students_pk PRIMARY KEY (student_id)
);

CREATE TABLE IF NOT EXISTS tickets (
  ticket_id      VARCHAR(20)    NOT NULL,
  student_id     VARCHAR(50),
  description    VARCHAR(2000)  NOT NULL,
  category       VARCHAR(50)    NOT NULL,
  department     VARCHAR(100)   NOT NULL,
  location       VARCHAR(200),
  priority       VARCHAR(20)    NOT NULL,
  ticket_status  VARCHAR(20)    DEFAULT 'OPEN' NOT NULL,
  created_at     TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT tickets_pk PRIMARY KEY (ticket_id)
);

CREATE TABLE IF NOT EXISTS followups (
  followup_id  INTEGER IDENTITY,
  ticket_id    VARCHAR(20)   NOT NULL,
  action_type  VARCHAR(50)   NOT NULL,
  message      VARCHAR(1000),
  created_at   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT followups_pk PRIMARY KEY (followup_id)
);