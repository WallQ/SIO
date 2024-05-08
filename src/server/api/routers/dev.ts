/* eslint-disable drizzle/enforce-delete-with-where */
import {
	companies,
	customers,
	geos,
	products,
	sales,
	times,
} from '@/data/database';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import {
	companyDimension,
	customerDimension,
	geoDimension,
	productDimension,
	salesFact,
	timeDimension,
} from '@/server/db/schema';
import { z } from 'zod';

export const devRouter = createTRPCRouter({
	populate: publicProcedure
		.input(z.object({ text: z.string().min(1) }))
		.mutation(async ({ input, ctx }) => {
			await ctx.db.delete(companyDimension);
			await ctx.db.delete(productDimension);
			await ctx.db.delete(customerDimension);
			await ctx.db.delete(geoDimension);
			await ctx.db.delete(timeDimension);
			await ctx.db.delete(salesFact);

			await ctx.db.insert(companyDimension).values(companies);
			await ctx.db.insert(productDimension).values(products);
			await ctx.db.insert(customerDimension).values(customers);
			await ctx.db.insert(geoDimension).values(geos);
			await ctx.db.insert(timeDimension).values(times);
			await ctx.db.insert(salesFact).values(sales);

			return `${input.text} - Database populated with development data!`;
		}),
});
