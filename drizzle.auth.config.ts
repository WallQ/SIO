import { env } from '@/env';
import { type Config } from 'drizzle-kit';

export default {
	schema: './src/server/db/auth-schema.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: env.AUTH_DB_URL,
	},
} satisfies Config;
