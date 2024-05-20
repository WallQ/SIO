import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { companyDimension } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const companiesRouter = createTRPCRouter({
	getCompanies: protectedProcedure.query(({ ctx }) => {
		return ctx.db
			.select()
			.from(companyDimension)
			.orderBy(companyDimension.name);
	}),

	getCompany: protectedProcedure
		.input(z.object({ text: z.string() }))
		.query(({ input, ctx }) => {
			return ctx.db
				.select()
				.from(companyDimension)
				.where(eq(companyDimension.name, input.text));
		}),
});
