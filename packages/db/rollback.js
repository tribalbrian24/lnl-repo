import { Pool } from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import { Kysely, PostgresDialect } from 'kysely';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/onboarding_db';

async function rollback() {
  const pool = new Pool({ connectionString });
  const db = new Kysely({
    dialect: new PostgresDialect({ pool }),
  });

  try {
    const last = await db
      .selectFrom('migration_history')
      .select('name')
      .orderBy('applied_at', 'desc')
      .limit(1)
      .executeTakeFirst();

    if (!last) {
      console.log('ℹ️  Nothing to roll back.');
      return;
    }

    console.log(`⏪ Rolling back: ${last.name}`);

    const migrationPath = `file://${path.join(__dirname, 'migrations', last.name)}`;
    const migration = await import(migrationPath);

    if (typeof migration.down !== 'function') {
      throw new Error(`Migration ${last.name} does not export a 'down' function`);
    }

    await db.transaction().execute(async (trx) => {
      await migration.down(trx);

      await trx
        .deleteFrom('migration_history')
        .where('name', '=', last.name)
        .execute();
    });

    console.log(`✅ Rolled back ${last.name}`);
  } catch (err) {
    console.error('❌ Rollback error:', err);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

rollback();
