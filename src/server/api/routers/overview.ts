// import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
// import {
// 	customerDimension,
// 	geoDimension,
// 	productDimension,
// 	salesFact,
// 	timeDimension,
// } from '@/server/db/star-schema';
// import { getDate, getMonth, getQuarter, getWeek, getYear } from 'date-fns';
// import { eq, sql } from 'drizzle-orm';
// import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { addresses, companies, customers, invoices, lines, products } from '@/server/db/relational-schema';
import {
	companyDimension,
	salesFact,
	timeDimension,
} from '@/server/db/star-schema';
import { getQuarter } from 'date-fns';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';

const overviewRouter = createTRPCRouter({
	totalSalesRevenueByYear: protectedProcedure
    .input(
        z.object({
            company: z.string().default(''),
            year: z.number().default(2023),
        }),
    )
    .query(async ({ input, ctx }) => {
        // Fetch the SK for the company
        const skCompany = await ctx.db.star
            .select({
                sk: companyDimension.sk,
            })
            .from(companyDimension)
            .where(sql`name = ${input.company}`)
            .then((res) => res[0]);

        if (!skCompany) {
            throw new Error('Failed to get SK Company!');
        }

        // Fetch the SK for the year (without quarter and month)
        const skTimeYear = await ctx.db.star
            .select({
                sk: timeDimension.sk,
            })
            .from(timeDimension)
            .where(sql`year = ${input.year} AND COALESCE(quarter, '') = '' AND COALESCE(month, '') = ''`)
            .then((res) => res[0]);

        if (!skTimeYear) {
            throw new Error('Failed to get SK Time for the year!');
        }

        const composedSKYear = `${skCompany.sk}_${skTimeYear.sk}`;

        const totalSalesYear = await ctx.db.star
            .select({
                value: salesFact.value,
            })
            .from(salesFact)
            .where(sql`sk = ${composedSKYear}`)
            .then((res) => res[0]);

        if (!totalSalesYear) {
            throw new Error('Failed to get total sales for the year!');
        }

        const monthPromises = [];
        for (let month = 1; month <= 12; month++) {
            monthPromises.push(
                (async () => {
                    const skTimeMonth = await ctx.db.star
                        .select({
                            sk: timeDimension.sk,
                        })
                        .from(timeDimension)
                        .where(sql`year = ${input.year} AND month = ${month} AND COALESCE(quarter, '') = ''`)
                        .then((res) => res[0]);

                    if (!skTimeMonth) {
                        // If SK Time is not found for the month, return zero sales for that month
                        return {
                            month,
                            amount: 0,
                        };
                    }

                    const composedSKMonth = `${skCompany.sk}_${skTimeMonth.sk}`;

                    const totalSalesByMonth = await ctx.db.star
                        .select({
                            value: salesFact.value,
                        })
                        .from(salesFact)
                        .where(sql`sk = ${composedSKMonth}`)
                        .then((res) => res[0]);

                    if (!totalSalesByMonth) {
                        // If total sales are not found for the month, return zero sales for that month
                        return {
                            month,
                            amount: 0,
                        };
                    }

                    return {
                        month,
                        amount: Number(totalSalesByMonth.value),
                    };
                })()
            );
        }

        const monthlyResults = await Promise.all(monthPromises);

        return {
            total_sales: Number(totalSalesYear.value),
            sales_by_month: monthlyResults,
        };
    }),

	totalSalesRevenueThisMonth: protectedProcedure
		.input(
			z.object({
				company: z.string().default(''),
				year: z.number().default(2023),
				month: z.number().default(new Date().getMonth() + 1),
			}),
		)
		.query(async ({ input, ctx }) => {
			const skCompany = await ctx.db.star
				.select({
					sk: companyDimension.sk,
				})
				.from(companyDimension)
				.where(sql`name = ${input.company}`)
				.then((res) => res[0]);

			if (!skCompany) {
				throw new Error('Failed to get SK Company!');
			}

			const skTime = await ctx.db.star
				.select({
					sk: timeDimension.sk,
				})
				.from(timeDimension)
				.where(sql`year = ${input.year} AND month = ${input.month} AND QUARTER = ${Math.ceil(input.month / 3)}`)
				.then((res) => res[0]);

			if (!skTime) {
				throw new Error('Failed to get SK Time!');
			}

			const composedSK = `${skCompany.sk}_${skTime.sk}`;

			const totalSalesForMonth = await ctx.db.star
				.select({
					total_sales: sql`SUM(sales_fact.value)::FLOAT`.as('total_sales')
				})
				.from(salesFact)
				.where(sql`sales_fact.sk = ${composedSK}`)
				.then((res) => res[0]);

			return {
				total_sales: totalSalesForMonth?.total_sales ?? 0,
			};
		}),

	totalSalesRevenueThisQuarter: protectedProcedure
		.input(
			z.object({
				company: z.string().default(''),
				year: z.number().default(2023),
			}),
		)
		.query(async ({ input, ctx }) => {

			const skCompany = await ctx.db.star
				.select({
					sk: companyDimension.sk,
				})
				.from(companyDimension)
				.where(
					sql`name = ${input.company}`,
				)
				.then((res) => res[0]);

			if (!skCompany) {
				throw new Error('Failed to get SK Company!');
			}

			const skTime = await ctx.db.star
				.select({
					sk: timeDimension.sk,
				})
				.from(timeDimension)
				.where(sql`year = ${input.year} AND Quarter = ${getQuarter(Date.now())} AND COALESCE(month, '') = ''`)
				.then((res) => res[0]);

			if (!skTime) {
				throw new Error('Failed to get SK Time!');
			}

			const composedSK = `${skCompany.sk}_${skTime.sk}`;

			const totalSales = await ctx.db.star
				.select({
					value: salesFact.value,
				})
				.from(salesFact)
				.where(sql`sk = ${composedSK}`)
				.then((res) => res[0]);

			if (!totalSales) {
				throw new Error('Failed to get total sales!');
			}

			return {
				total_sales: totalSales.value ? parseFloat(totalSales.value) : 0,
			}
		}),

	averageSaleRevenuePerSale: protectedProcedure
		.input(
			z.object({
				company: z.string().default(''),
			}),
		)
		.query(async ({ input, ctx }) => {

			const skCompany = await ctx.db.star
				.select({
					sk: companyDimension.sk,
				})
				.from(companyDimension)
				.where(
					sql`name = ${input.company}`,
				)
				.then((res) => res[0]);

			if (!skCompany) {
				throw new Error('Failed to get SK Company!');
			}

			const averageSaleRevenue = await ctx.db.relational
				.select({
					average: sql<number>`AVG(gross_total)`.as('average'),
				})
				.from(invoices)
				.innerJoin(companies, eq(invoices.company_id, companies.id))
				.where(
					sql`companies.name = ${input.company}`,
				)
				.then((res) => res[0]);

			if (!averageSaleRevenue) {
				throw new Error('Failed to get average sale revenue!');
			}

			return {
				average: averageSaleRevenue ? averageSaleRevenue.average : 0,
			};
		}),

		totalSalesRevenueByTrimester: protectedProcedure
    .input(
        z.object({
            company: z.string().default(''),
            year: z.number().default(2023),
        }),
    )
    .query(async ({ input, ctx }) => {

        const skCompany = await ctx.db.star
            .select({
                sk: companyDimension.sk,
            })
            .from(companyDimension)
            .where(
                sql`name = ${input.company}`,
            )
            .then((res) => res[0]);

        if (!skCompany) {
            throw new Error('Failed to get SK Company!');
        }

        const quartersPromises = [];
        
        for (let quarter = 1; quarter <= 4; quarter++) {
            quartersPromises.push(
                (async () => {
                    const skTime = await ctx.db.star
                        .select({
                            sk: timeDimension.sk,
                        })
                        .from(timeDimension)
                        .where(sql`year = ${input.year} AND Quarter = ${quarter} AND COALESCE(month, '') = ''`)
                        .then((res) => res[0]);

                    if (!skTime) {
                        throw new Error('Failed to get SK Time!');
                    }

                    const composedSK = `${skCompany.sk}_${skTime.sk}`;

                    const totalSales = await ctx.db.star
                        .select({
                            value: salesFact.value,
                        })
                        .from(salesFact)
                        .where(sql`sk = ${composedSK}`)
                        .then((res) => res[0]);

                    if (!totalSales) {
                        throw new Error('Failed to get total sales!');
                    }

                    return {
                        trimester: `Q${quarter}`,
                        amount: Number(totalSales.value) 
                    };
                })()
            );
        }

        const results = await Promise.all(quartersPromises);

        return {
            sales_by_trimester: results,
        };
    }),

	totalSalesRevenueByCustomer: protectedProcedure
		.input(
			z.object({
				company: z.string().default(''),
				year: z.number().default(2023),
			}),
		)
		.query(async ({ input, ctx }) => {
			const totalSalesByCustomer = await ctx.db.relational
				.select({
					name: sql<string>`subquery.name`.as('name'),
					amount: sql<number>`SUM(subquery.gross_total)`.as('amount'),
				})
				.from(sql`
                (SELECT c.name, i.gross_total 
                FROM ${customers} AS c
                JOIN ${invoices} AS i ON c.id = i.customer_id
                JOIN ${companies} AS cmp ON i.company_id = cmp.id
                WHERE EXTRACT(YEAR FROM i.date) = ${input.year} AND cmp.name = ${input.company}
                ) AS subquery
            `)
				.groupBy(sql<string>`name`)
				.orderBy(sql<number>`amount DESC`);

			return totalSalesByCustomer;
		}),

	totalSalesRevenueByProduct: protectedProcedure
		.input(
			z.object({
				company: z.string().default(''),
				year: z.number().default(2023),
			}),
		)
		.query(async ({ input, ctx }) => {
			const totalSalesByProduct = await ctx.db.relational
				.select({
					name: sql<string>`subquery.name`.as('name'),
					value: sql<number>`SUM(subquery.gross_total)`.as('value'),
				})
				.from(sql`
                (SELECT p.name, i.gross_total 
                FROM ${products} AS p
                JOIN ${lines} AS l ON p.id = l.product_id
                JOIN ${invoices} AS i ON l.invoice_id = i.id
                JOIN ${companies} AS cmp ON i.company_id = cmp.id
                WHERE EXTRACT(YEAR FROM i.date) = ${input.year} 
                  AND cmp.name = ${input.company}
                ) AS subquery
            `)
				.groupBy(sql<string>`subquery.name`)
				.orderBy(sql<number>`value DESC`);

			return { sales_by_product: totalSalesByProduct };
		}),

	totalSalesRevenueByCity: protectedProcedure
		.input(
			z.object({
				company: z.string().default(''),
				year: z.number().default(2023),
			}),
		)
		.query(async ({ input, ctx }) => {
			const totalSalesByCity = await ctx.db.relational
				.select({
					city: sql<string>`a.city`.as('city'),
					amount: sql<number>`SUM(i.gross_total)`.as('amount'),
				})
				.from(sql`
                ${customers} AS c
                JOIN ${addresses} AS a ON c.address_id = a.id
                JOIN ${invoices} AS i ON c.id = i.customer_id
                JOIN ${companies} AS cmp ON i.company_id = cmp.id
                WHERE EXTRACT(YEAR FROM i.date) = ${input.year} AND cmp.name = ${input.company}
            `)
				.groupBy(sql<string>`a.city`)
				.orderBy(sql<number>`amount DESC`);

			return totalSalesByCity;
		}),
});

export { overviewRouter };

function monthNumberToString(month: number | undefined): string {
	if (typeof month === 'undefined') {
		return 'Unknown';
	}

	const months = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];
	return months[month - 1] || 'Unknown';
}
