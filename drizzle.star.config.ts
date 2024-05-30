import { env } from '@/env';
import { type Config } from 'drizzle-kit';

export default {
	schema: './src/server/db/star-schema.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: env.STAR_DB_URL,
	},
} satisfies Config;
