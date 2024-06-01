import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import {
	customerDimension,
	salesFact,
	timeDimension,
} from '@/server/db/star-schema';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';

import { monthNumberToString } from '@/lib/utils';

export const overviewRouter = createTRPCRouter({
	totalSalesRevenueByYear: protectedProcedure
		.input(
			z.object({ companyId: z.number(), year: z.number().default(2023) }),
		)
		.query(async ({ input, ctx }) => {
			const monthlySales = await ctx.db.star
				.select({
					month: timeDimension.month,
					amount: sql<number>`SUM(${salesFact.gross_total})`.as(
						'amount',
					),
				})
				.from(salesFact)
				.innerJoin(
					timeDimension,
					eq(timeDimension.id, salesFact.time_id),
				)
				.where(
					eq(timeDimension.year, input.year) &&
						eq(salesFact.company_id, input.companyId),
				)
				.groupBy(timeDimension.month)
				.orderBy(timeDimension.month);

			const totalSales = await ctx.db.star
				.select({
					amount: sql<number>`SUM(${salesFact.gross_total})`.as(
						'amount',
					),
				})
				.from(salesFact)
				.where(
					eq(timeDimension.year, input.year) &&
						eq(salesFact.company_id, input.companyId),
				)
				.then((rows) => rows[0]);

			const formattedMonthlySales = monthlySales.map((sale) => ({
				month: monthNumberToString(sale.month),
				amount: sale.amount,
			}));

			return {
				total_sales: totalSales ? totalSales.amount : 0,
				sales_by_month: formattedMonthlySales,
			};
		}),

	totalSalesRevenueByTrimester: protectedProcedure
		.input(
			z.object({ companyId: z.number(), year: z.number().default(2023) }),
		)
		.query(async ({ input, ctx }) => {
			return await ctx.db.star
				.select({
					trimester: timeDimension.quarter,
					amount: sql<number>`SUM(${salesFact.gross_total})`.as(
						'amount',
					),
				})
				.from(salesFact)
				.innerJoin(
					timeDimension,
					eq(timeDimension.id, salesFact.time_id),
				)
				.where(
					eq(timeDimension.year, input.year) &&
						eq(salesFact.company_id, input.companyId),
				)
				.groupBy(timeDimension.quarter)
				.orderBy(timeDimension.quarter);
		}),

	customersByRevenue: protectedProcedure
		.input(
			z.object({ companyId: z.number(), year: z.number().default(2023) }),
		)
		.query(({ input, ctx }) => {
			return ctx.db.star
				.select({
					name: customerDimension.name,
					amount: sql<number>`SUM(${salesFact.gross_total})`.as(
						'amount',
					),
				})
				.from(salesFact)
				.innerJoin(
					customerDimension,
					eq(customerDimension.id, salesFact.customer_id),
				)
				.where(
					eq(timeDimension.year, input.year) &&
						eq(salesFact.company_id, input.companyId),
				)
				.groupBy(customerDimension.name)
				.orderBy(sql<number>`SUM(${salesFact.gross_total}) DESC`)
				.limit(5);
		}),
});
