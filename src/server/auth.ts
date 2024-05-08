import { env } from '@/env';
import { APP_ROUTES } from '@/routes/app';
import { db } from '@/server/db';
import { createTable } from '@/server/db/schema';
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
	adapter: DrizzleAdapter(db, createTable) as Adapter,
	providers: [
		// CredentialsProvider({
		// 	id: 'credentials',
		// 	name: 'Credentials',
		// 	credentials: {
		// 		email: {
		// 			label: 'Email',
		// 			type: 'email',
		// 			placeholder: 'sio@estg.ipp.pt',
		// 		},
		// 		password: {
		// 			label: 'Password',
		// 			type: 'password',
		// 			placeholder: '********',
		// 		},
		// 	},
		// 	authorize: async (credentials: SignIn) => {
		// 		const parsedCredentials = SignInSchema.safeParse(credentials);

		// 		if (!parsedCredentials.success) {
		// 			return null;
		// 		}

		// 		const { email, password } = parsedCredentials.data;

		// 		const user = await db.query.users.findFirst({
		// 			where: (user, { eq }) => eq(user.email, email),
		// 		});

		// 		if (!user) return null;

		// 		const passwordsMatch = await compare(password, user.password!);

		// 		if (!passwordsMatch) return null;

		// 		return user;
		// 	},
		// }),
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
			if (!user) throw 'unreachable with session strategy';
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
	secret: env.NEXTAUTH_SECRET,
	useSecureCookies: env.NODE_ENV === 'production',
	debug: env.NODE_ENV === 'development',
};

export const getServerAuthSession = () => getServerSession(authOptions);
