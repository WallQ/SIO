import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';

import { companiesRouter } from './routers/companies';
import { uploadRouter } from './routers/upload';

export const appRouter = createTRPCRouter({
	// overview: overviewRouter,
	// analytics: analyticsRouter,
	companies: companiesRouter,
	upload: uploadRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
