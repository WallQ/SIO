// import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
// import {
// 	customerDimension,
// 	geoDimension,
// 	productDimension,
// 	salesFact,
// } from '@/server/db/star-schema';
// import { and, eq, sql } from 'drizzle-orm';

// export const analyticsRouter = createTRPCRouter({
// 	totalCustomers: protectedProcedure.query(({ ctx }) => {
// 		return ctx.db.star
// 			.select({
// 				amount: sql<number>`COUNT(${customerDimension.id})`.as(
// 					'amount',
// 				),
// 			})
// 			.from(customerDimension);
// 	}),

// 	productsByRevenue: protectedProcedure.query(({ ctx }) => {
// 		return ctx.db.star
// 			.select({
// 				product: productDimension.name,
// 				quantity: sql<number>`COUNT(${salesFact.id})`.as('quantity'),
// 				amount: sql<number>`SUM(${salesFact.gross_total})`.as('amount'),
// 			})
// 			.from(salesFact)
// 			.innerJoin(
// 				productDimension,
// 				eq(salesFact.product_id, productDimension.id),
// 			)
// 			.groupBy(productDimension.name)
// 			.orderBy(sql<number>`SUM(${salesFact.gross_total}) DESC`)
// 			.limit(3);
// 	}),

// 	citiesByRevenue: protectedProcedure.query(({ ctx }) => {
// 		return ctx.db.star
// 			.select({
// 				city: geoDimension.city,
// 				amount: sql<number>`SUM(${salesFact.gross_total})`.as('amount'),
// 			})
// 			.from(salesFact)
// 			.innerJoin(
// 				customerDimension,
// 				eq(salesFact.customer_id, customerDimension.id),
// 			)
// 			.innerJoin(
// 				geoDimension,
// 				and(
// 					eq(customerDimension.city, geoDimension.city),
// 					eq(customerDimension.country, geoDimension.country),
// 				),
// 			)
// 			.groupBy(geoDimension.city)
// 			.orderBy(sql<number>`SUM(${salesFact.gross_total}) DESC`)
// 			.limit(5);
// 	}),
// });
