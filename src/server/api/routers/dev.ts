/* eslint-disable drizzle/enforce-delete-with-where */
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import {
	addresses,
	companies,
	customers,
	invoices,
	lines,
	products,
	suppliers,
} from '@/server/db/relational-schema';
import {
	companyDimension,
	customerDimension,
	geoDimension,
	productDimension,
	salesFact,
	timeDimension,
} from '@/server/db/star-schema';
import { z } from 'zod';

export const devRouter = createTRPCRouter({
	populate: publicProcedure
		.input(z.object({ text: z.string().min(1) }))
		.mutation(async ({ input, ctx }) => {
			await Promise.all([
				ctx.db.relational.delete(addresses),
				ctx.db.relational.delete(companies),
				ctx.db.relational.delete(suppliers),
				ctx.db.relational.delete(customers),
				ctx.db.relational.delete(products),
				ctx.db.relational.delete(invoices),
				ctx.db.relational.delete(lines),

				ctx.db.star.delete(companyDimension),
				ctx.db.star.delete(productDimension),
				ctx.db.star.delete(customerDimension),
				ctx.db.star.delete(geoDimension),
				ctx.db.star.delete(timeDimension),
				ctx.db.star.delete(salesFact),
			]);

			return `${input.text} - Database populated with development data!`;
		}),
});
