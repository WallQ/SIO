import { getServerAuthSession } from '@/server/auth';
import { authDb, relationalDb, starDb } from '@/server/db';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

export const createTRPCContext = async (opts: { headers: Headers }) => {
	const session = await getServerAuthSession();
	return {
		db: {
			authDb: authDb,
			relational: relationalDb,
			star: starDb,
		},
		session,
		...opts,
	};
};

const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.cause instanceof ZodError
						? error.cause.flatten()
						: null,
			},
		};
	},
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.session || !ctx.session.user)
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	return next({
		ctx: {
			session: { ...ctx.session, user: ctx.session.user },
		},
	});
});
