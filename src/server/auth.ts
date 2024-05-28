import { env } from '@/env';
import { APP_ROUTES } from '@/routes/app';
import { starDb } from '@/server/db';
import { createTable } from '@/server/db/star-schema';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import {
	getServerSession,
	type DefaultSession,
	type NextAuthOptions,
} from 'next-auth';
import { type Adapter } from 'next-auth/adapters';
import DiscordProvider from 'next-auth/providers/discord';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

declare module 'next-auth' {
	interface Session extends DefaultSession {
		user: {
			id: string;
			// ...other properties
			// role: UserRole;
		} & DefaultSession['user'];
	}

	// interface User {
	//   // ...other properties
	//   // role: UserRole;
	// }
}

export const authOptions: NextAuthOptions = {
	adapter: DrizzleAdapter(starDb, createTable) as Adapter,
	providers: [
		DiscordProvider({
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET,
		}),
		GitHubProvider({
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
		}),
		GoogleProvider({
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		}),
	],
	callbacks: {
		session: ({ session, user }) => {
			if (!user) throw 'Unreachable with session strategy!';
			return {
				...session,
				user: {
					...session.user,
					id: user.id,
				},
			};
		},
	},
	pages: {
		signIn: APP_ROUTES.AUTH.SIGN_IN,
		newUser: APP_ROUTES.AUTH.SIGN_UP,
		signOut: APP_ROUTES.AUTH.SIGN_OUT,
	},
	debug: env.NODE_ENV === 'development',
};

export const getServerAuthSession = () => getServerSession(authOptions);
