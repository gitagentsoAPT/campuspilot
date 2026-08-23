import 'dotenv/config';
import { ExasolDriver } from '@exasol/exasol-driver-ts';
import { WebSocket } from 'ws';

export function openConnection() {
  const { EXASOL_HOST, EXASOL_PORT, EXASOL_USER, EXASOL_PASSWORD, EXASOL_SCHEMA } = process.env;

  if (!EXASOL_HOST || !EXASOL_USER || !EXASOL_PASSWORD) {
    throw new Error(
      'Missing Exasol connection env vars. Copy backend/.env.example to backend/.env ' +
        'and fill in EXASOL_HOST / EXASOL_USER / EXASOL_PASSWORD from `exasol info`.'
    );
  }

  const driver = new ExasolDriver((url) => new WebSocket(url, { rejectUnauthorized: false }), {
    host: EXASOL_HOST,
    port: Number(EXASOL_PORT || 8563),
    user: EXASOL_USER,
    password: EXASOL_PASSWORD,
    schema: EXASOL_SCHEMA || undefined
  });

  return driver;
}

export async function withConnection(fn) {
  const driver = openConnection();
  await driver.connect();
  try {
    return await fn(driver);
  } finally {
    await driver.close();
  }
}