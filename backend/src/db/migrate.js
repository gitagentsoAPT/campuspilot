// Runs schema.sql against Exasol. Usage: npm run db:migrate
// Splits on ';' — fine for this file since none of our statements contain
// a semicolon inside a string/comment.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { openConnection } from './connection.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const sql = readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
  const statements = sql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'));

  const driver = openConnection();
  await driver.connect();

  try {
    for (const statement of statements) {
      console.log(`Running: ${statement.slice(0, 60)}...`);
      await driver.execute(statement);
    }
    console.log(`Migration complete. Ran ${statements.length} statements.`);
  } finally {
    await driver.close();
  }
}

migrate().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
