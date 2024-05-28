import { env } from '@/env';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as relationalSchema from './relational-schema';
import * as starSchema from './star-schema';

// const globalForDb = globalThis as unknown as {
// 	conn: postgres.Sql | undefined;
// };

export const relationalDb = drizzle(postgres(env.RELATIONAL_DB_URL), {
	schema: relationalSchema,
});

export const starDb = drizzle(postgres(env.STAR_DB_URL), {
	schema: starSchema,
});
