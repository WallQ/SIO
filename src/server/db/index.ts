import { env } from '@/env';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as relationalSchema from './relational-schema';
import * as starSchema from './star-schema';

const globalForDb = globalThis as unknown as {
	conn: postgres.Sql | undefined;
};

const relationaDbConnection =
	globalForDb.conn ?? postgres(env.RELATIONAL_DB_URL);
if (env.NODE_ENV !== 'production') globalForDb.conn = relationaDbConnection;
const starDbConnection = globalForDb.conn ?? postgres(env.STAR_DB_URL);
if (env.NODE_ENV !== 'production') globalForDb.conn = starDbConnection;

export const relationalDb = drizzle(relationaDbConnection, {
	schema: relationalSchema,
});
export const starDb = drizzle(starDbConnection, { schema: starSchema });
