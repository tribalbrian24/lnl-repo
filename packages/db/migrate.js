import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Kysely, PostgresDialect, sql } from 'kysely';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ Error: DATABASE_URL environment variable is not set.');
  process.exit(1);
}

async function runMigrations() {
  const pool = new Pool({
    connectionString,
  });

  const db = new Kysely({
    dialect: new PostgresDialect({
      pool,
    }),
  });

  try {
    console.log('🚀 Starting migrations...');

    // 1. Ensure migration_history table exists
    await db.schema
      .createTable('migration_history')
      .ifNotExists()
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('name', 'text', (col) => col.notNull().unique())
      .addColumn('applied_at', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
      .execute();

    // 2. Find all migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      console.error(`❌ Migrations directory not found: ${migrationsDir}`);
      process.exit(1);
    }

    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.ts'))
      .sort();

    // 3. Check which migrations have already been applied
    const appliedMigrations = await db
      .selectFrom('migration_history')
      .select('name')
      .execute();

    const appliedSet = new Set(appliedMigrations.map(m => m.name));

    for (const file of files) {
      if (!appliedSet.has(file)) {
        console.log(`🛠️  Applying migration: ${file}`);

        const migrationPath = `file://${path.join(migrationsDir, file)}`;

        // @ts-ignore
        const migration = await import(migrationPath);

        await db.transaction().execute(async (trx) => {
          if (typeof migration.up === 'function') {
            await migration.up(trx);
          } else {
            throw new Error(`Migration ${file} does not export an 'up' function`);
          }

          await trx
            .insertInto('migration_history')
            .values({ name: file })
            .execute();
        });

        console.log(`✅ Successfully applied ${file}`);
      } else {
        console.log(`⏭️  Skipping ${file} (already applied)`);
      }
    }

    console.log('✨ All migrations are up to date.');
  } catch (err) {
    console.error('❌ Migration error:', err);
    process.exit(1);
  } finally {
    await db.destroy();
    // await pool.end();
  }
}

runMigrations();
