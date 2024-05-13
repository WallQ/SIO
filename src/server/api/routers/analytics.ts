import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import {
	customerDimension,
	geoDimension,
	productDimension,
	salesFact,
	timeDimension,
} from '@/server/db/schema';
import { and, eq, sql } from 'drizzle-orm';

export const analyticsRouter = createTRPCRouter({
	totalSalesRevenueByYear: protectedProcedure.query(({ ctx }) => {
		return ctx.db
			.select({
				month: sql<string>`DATE_TRUNC('month', ${timeDimension.date})`.as(
					'month',
				),
				amount: sql<number>`SUM(${salesFact.gross_total})`.as('amount'),
			})
			.from(salesFact)
			.innerJoin(timeDimension, eq(salesFact.time_id, timeDimension.id))
			.where(eq(timeDimension.year, 2023))
			.groupBy(timeDimension.date)
			.orderBy(timeDimension.date);
	}),

	totalCustomers: protectedProcedure.query(({ ctx }) => {
		return ctx.db
			.select({
				amount: sql<number>`COUNT(${customerDimension.id})`.as(
					'amount',
				),
			})
			.from(customerDimension);
	}),

	productsByRevenue: protectedProcedure.query(({ ctx }) => {
		return ctx.db
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
		return ctx.db
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

	customersByRevenue: protectedProcedure.query(({ ctx }) => {
		return ctx.db
			.select({
				name: customerDimension.name,
				amount: sql<number>`SUM(${salesFact.gross_total})`.as('amount'),
			})
			.from(salesFact)
			.innerJoin(
				customerDimension,
				eq(salesFact.customer_id, customerDimension.id),
			)
			.groupBy(customerDimension.name)
			.orderBy(sql<number>`SUM(${salesFact.gross_total}) DESC`)
			.limit(5);
	}),
});
