import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { customerDimension, geoDimension, productDimension, salesFact, timeDimension } from '@/server/db/star-schema';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';



import { monthNumberToString, trimesterNumberToString } from '@/lib/utils';





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

	totalSalesRevenueByProduct: protectedProcedure
		.input(
			z.object({ companyId: z.number(), year: z.number().default(2023) }),
		)
		.query(async ({ input, ctx }) => {
			const productSales = await ctx.db.star
				.select({
					name: productDimension.name,
					value: sql<number>`SUM(${salesFact.gross_total})`.as(
						'value',
					),
				})
				.from(salesFact)
				.innerJoin(
					productDimension,
					eq(productDimension.id, salesFact.product_id),
				)
				.where(
					eq(timeDimension.year, input.year) &&
						eq(salesFact.company_id, input.companyId),
				)
				.groupBy(productDimension.name)
				.orderBy(sql<number>`SUM(${salesFact.gross_total}) DESC`)
				.limit(10);

			const formattedProductSales = productSales.map((product) => ({
				name: product.name,
				value: parseFloat(product.value.toFixed(2)),
			}));

			return {
				sales_by_product: formattedProductSales,
			};
		}),

	totalSalesRevenueByCity: protectedProcedure
		.input(
			z.object({ companyId: z.number(), year: z.number().default(2023) }),
		)
		.query(async ({ input, ctx }) => {
			const countrySales = await ctx.db.star
				.select({
					country: geoDimension.country,
					value: sql<number>`SUM(${salesFact.gross_total})`.as(
						'value',
					),
				})
				.from(salesFact)
				.innerJoin(geoDimension, eq(geoDimension.id, salesFact.geo_id))
				.where(
					eq(timeDimension.year, input.year) &&
						eq(salesFact.company_id, input.companyId),
				)
				.groupBy(geoDimension.country);

			const formattedCountrySales = countrySales.map((item) => [
				item.country,
				item.value,
			]);

			formattedCountrySales.unshift(['Country', 'Total Sales Revenue']);

			return {
				sales_by_city: formattedCountrySales,
			};
		}),

	totalSalesRevenueByTrimester: protectedProcedure
		.input(
			z.object({ companyId: z.number(), year: z.number().default(2023) }),
		)
		.query(async ({ input, ctx }) => {
			const trimesterSales = await ctx.db.star
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

			const formattedtrimesterSales = trimesterSales.map((sale) => ({
				trimester: trimesterNumberToString(sale.trimester),
				amount: sale.amount,
			}));

			return {
				sales_by_trimester: formattedtrimesterSales,
			};
		}),

	totalSalesRevenueByCustomer: protectedProcedure
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