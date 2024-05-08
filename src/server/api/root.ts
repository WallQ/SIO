import { devRouter } from '@/server/api/routers/dev';
import { postRouter } from '@/server/api/routers/post';
import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';

import { analyticsRouter } from './routers/analytics';

export const appRouter = createTRPCRouter({
	dev: devRouter,
	analytics: analyticsRouter,
	post: postRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
