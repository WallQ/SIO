import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';

import { companiesRouter } from './routers/companies';
import { uploadRouter } from './routers/upload';
import { yearsRouter } from './routers/year';
import { overviewRouter } from './routers/overview';

export const appRouter = createTRPCRouter({
	overview: overviewRouter,
	// analytics: analyticsRouter,
	companies: companiesRouter,
	years: yearsRouter,
	upload: uploadRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
