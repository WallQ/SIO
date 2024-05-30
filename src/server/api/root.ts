import { devRouter } from '@/server/api/routers/dev';
import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';

import { analyticsRouter } from './routers/analytics';
import { companiesRouter } from './routers/companies';
import { uploadRouter } from './routers/upload';

export const appRouter = createTRPCRouter({
	dev: devRouter,
	analytics: analyticsRouter,
	companies: companiesRouter,
	upload: uploadRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
