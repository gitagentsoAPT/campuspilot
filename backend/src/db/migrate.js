import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { openConnection } from './connection.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const sql = readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');

  const statements = sql
    .split(';')
    .map((s) =>
      s
        .split('\n')
        .filter((line) => !line.trim().startsWith('--'))
        .join('\n')
        .trim()
    )
    .filter((s) => s.length > 0);

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
  console.error('Migration failed:', err);
  process.exit(1);
});