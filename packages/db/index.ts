import { Kysely, PostgresDialect } from 'kysely';
import { CamelCaseKeys, toCamelCase } from './utils/case-conversion';
import { Pool, QueryResultRow } from 'pg';
import { Database, Project, ProjectTask } from './types';

export interface DbConfig {
  connectionString: string;
  max?: number;
  idleTimeoutMillis?: number;
}

export interface DbClient {
  db: Kysely<Database>;
  pool: Pool;
  query: <T extends Record<string, any> = any>(
      text: string,
      params?: any[]
    ) => Promise<CamelCaseKeys<T>[] | null>;
}

declare global {
  // eslint-disable-next-line no-var
  var _dbClient: DbClient | undefined;
}

/**
 * Factory function to create a new database client.
 */
const createDbClient = (config: DbConfig): DbClient => {
  const pool = new Pool({
    connectionString: config.connectionString,
    max: config.max,
    idleTimeoutMillis: config.idleTimeoutMillis,
  });

  const db = new Kysely<Database>({
    dialect: new PostgresDialect({ pool }),
  });

  // pool.query(text, params);

  const query = async <T extends Record<string, any> = any>(
    text: string,
    params: any[] = []
  ): Promise<CamelCaseKeys<T>[] | null> => {
    const res = await pool.query(text, params);
    if (res.rows.length === 0) return null;

    return res.rows.map((row: Record<string, any>) => {
      const camelCaseRow: Record<string, any> = {};
      for (const key in row) {
        camelCaseRow[toCamelCase(key)] = row[key];
      }
      return camelCaseRow as CamelCaseKeys<T>;
    });
  };

  return { db, pool, query };
}

const getDefaultClient = (): DbClient => {
  if (typeof window !== 'undefined') {
    throw new Error('Database client cannot be used in the browser.');
  }

  if (globalThis._dbClient) {
    return globalThis._dbClient;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not defined.');
  }

  const client = createDbClient({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
  });

  if (process.env.NODE_ENV !== 'production') {
    globalThis._dbClient = client;
  }

  return client;
};

export type { Database, Project, ProjectTask };

export { getDefaultClient as getDbClient };
export default getDefaultClient;
