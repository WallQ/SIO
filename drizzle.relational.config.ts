import { env } from '@/env';
import { type Config } from 'drizzle-kit';

export default {
	schema: './src/server/db/relational-schema.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: env.RELATIONAL_DB_URL,
	},
	tablesFilter: ['sio_*'],
} satisfies Config;
