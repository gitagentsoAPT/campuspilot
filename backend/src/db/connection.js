import 'dotenv/config';
import { ExasolDriver } from '@exasol/exasol-driver-ts';
import { WebSocket } from 'ws';

/**
 * Opens a fresh Exasol connection.
 *
 * MVP-scale choice: we open/close a connection per request instead of
 * pooling. Exasol Personal is single-user and this app has a handful of
 * demo users at most, so the extra ~100ms per request is a fine trade for
 * not having to build/manage a connection pool in a one-day hackathon.
 * If this ever needs to handle real concurrent load, swap this for a
 * pooled driver instance shared across requests.
 */
export function openConnection() {
  const { EXASOL_HOST, EXASOL_PORT, EXASOL_USER, EXASOL_PASSWORD, EXASOL_SCHEMA } = process.env;

  if (!EXASOL_HOST || !EXASOL_USER || !EXASOL_PASSWORD) {
    throw new Error(
      'Missing Exasol connection env vars. Copy backend/.env.example to backend/.env ' +
        'and fill in EXASOL_HOST / EXASOL_USER / EXASOL_PASSWORD from `exasol info`.'
    );
  }

  const driver = new ExasolDriver((url) => new WebSocket(url), {
    host: EXASOL_HOST,
    port: Number(EXASOL_PORT || 8563),
    user: EXASOL_USER,
    password: EXASOL_PASSWORD,
    schema: EXASOL_SCHEMA || 'CAMPUSPILOT'
  });

  return driver;
}

/**
 * Runs `fn(driver)` against a fresh connection and always closes it
 * afterwards, even if fn throws.
 */
export async function withConnection(fn) {
  const driver = openConnection();
  await driver.connect();
  try {
    return await fn(driver);
  } finally {
    await driver.close();
  }
}
