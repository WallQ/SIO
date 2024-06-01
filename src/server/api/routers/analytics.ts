import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import {
	customerDimension,
	geoDimension,
	productDimension,
	salesFact,
	timeDimension,
} from '@/server/db/star-schema';
import { and, eq, sql } from 'drizzle-orm';
import { z } from 'zod';

import { monthNumberToString } from '@/lib/utils';

export const analyticsRouter = createTRPCRouter({
	totalSalesRevenue: protectedProcedure
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

	totalCustomers: protectedProcedure.query(({ ctx }) => {
		return ctx.db.star
			.select({
				amount: sql<number>`COUNT(${customerDimension.id})`.as(
					'amount',
				),
			})
			.from(customerDimension);
	}),

	productsByRevenue: protectedProcedure.query(({ ctx }) => {
		return ctx.db.star
			.select({
				product: productDimension.name,
				quantity: sql<number>`COUNT(${salesFact.id})`.as('quantity'),
				amount: sql<number>`SUM(${salesFact.gross_total})`.as('amount'),
			})
			.from(salesFact)
			.innerJoin(
				productDimension,
				eq(salesFact.product_id, productDimension.id),
			)
			.groupBy(productDimension.name)
			.orderBy(sql<number>`SUM(${salesFact.gross_total}) DESC`)
			.limit(3);
	}),

	citiesByRevenue: protectedProcedure.query(({ ctx }) => {
		return ctx.db.star
			.select({
				city: geoDimension.city,
				amount: sql<number>`SUM(${salesFact.gross_total})`.as('amount'),
			})
			.from(salesFact)
			.innerJoin(
				customerDimension,
				eq(salesFact.customer_id, customerDimension.id),
			)
			.innerJoin(
				geoDimension,
				and(
					eq(customerDimension.city, geoDimension.city),
					eq(customerDimension.country, geoDimension.country),
				),
			)
			.groupBy(geoDimension.city)
			.orderBy(sql<number>`SUM(${salesFact.gross_total}) DESC`)
			.limit(5);
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
