import type * as relationalSchema from '@/server/db/relational-schema';
import {
	addresses,
	companies,
	customers,
	invoices,
	lines,
	products,
} from '@/server/db/relational-schema';
import type * as starSchema from '@/server/db/star-schema';
import {
	companyDimension,
	customerDimension,
	geoDimension,
	productDimension,
	salesFact,
	timeDimension,
} from '@/server/db/star-schema';
import { eq, sql } from 'drizzle-orm';
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export const totalSalesRevenuePerYear = async (
	dbRelational: PostgresJsDatabase<typeof relationalSchema>,
	dbStar: PostgresJsDatabase<typeof starSchema>,
	year: string,
	company: string,
) => {
	const skCompany = await dbStar
		.select({
			sk: companyDimension.sk,
		})
		.from(companyDimension)
		.where(
			sql`name = ${company} AND COALESCE(city, '') = '' AND COALESCE(country, '') = ''`,
		)
		.then((res) => res[0]);
	if (!skCompany) throw new Error('Failed to get SK Company!');

	const skTime = await dbStar
		.select({
			sk: timeDimension.sk,
		})
		.from(timeDimension)
		.where(
			sql`year = ${year} AND COALESCE(quarter, '') = '' AND COALESCE(month, '') = ''`,
		)
		.then((res) => res[0]);
	if (!skTime) throw new Error('Failed to get SK Time!');

	const totalSales = await dbRelational
		.select({
			total: sql<number>`SUM(gross_total)`.as('total'),
		})
		.from(invoices)
		.innerJoin(companies, eq(invoices.company_id, companies.id))
		.where(
			sql`EXTRACT(year from invoices.date) = ${year} AND companies.name = ${company}`,
		)
		.then((res) => res[0]);
	if (!totalSales) throw new Error('Failed to get total sales!');

	const composedSK = `${skCompany.sk}_${skTime.sk}`;

	const result = totalSales.total ? totalSales.total.toString() : '0';

	await dbStar
		.insert(salesFact)
		.values({
			sk: composedSK,
			value: result,
		})
		.onConflictDoUpdate({
			target: salesFact.sk,
			set: {
				value: result,
			},
		});
};

export const totalSalesRevenuePerQuarter = async (
	dbRelational: PostgresJsDatabase<typeof relationalSchema>,
	dbStar: PostgresJsDatabase<typeof starSchema>,
	year: string,
	quarter: string,
	company: string,
) => {
	const skCompany = await dbStar
		.select({
			sk: companyDimension.sk,
		})
		.from(companyDimension)
		.where(
			sql`name = ${company} AND COALESCE(city, '') = '' AND COALESCE(country, '') = ''`,
		)
		.then((res) => res[0]);
	if (!skCompany) throw new Error('Failed to get SK Company!');

	const skTime = await dbStar
		.select({
			sk: timeDimension.sk,
		})
		.from(timeDimension)
		.where(
			sql`year = ${year} AND quarter = ${quarter} AND COALESCE(month, '') = ''`,
		)
		.then((res) => res[0]);
	if (!skTime) throw new Error('Failed to get SK Time!');

	const totalSales = await dbRelational
		.select({
			total: sql<number>`SUM(gross_total)`.as('total'),
		})
		.from(invoices)
		.innerJoin(companies, eq(invoices.company_id, companies.id))
		.where(
			sql`EXTRACT(year from invoices.date) = ${year} AND EXTRACT(quarter from invoices.date) = ${quarter} AND companies.name = ${company}`,
		)
		.then((res) => res[0]);
	if (!totalSales) throw new Error('Failed to get total sales!');

	const composedSK = `${skCompany.sk}_${skTime.sk}`;

	const result = totalSales.total ? totalSales.total.toString() : '0';

	await dbStar
		.insert(salesFact)
		.values({
			sk: composedSK,
			value: result,
		})
		.onConflictDoUpdate({
			target: salesFact.sk,
			set: {
				value: result,
			},
		});
};

export const totalSalesRevenuePerMonth = async (
	dbRelational: PostgresJsDatabase<typeof relationalSchema>,
	dbStar: PostgresJsDatabase<typeof starSchema>,
	year: string,
	quarter: string,
	month: string,
	company: string,
) => {
	const skCompany = await dbStar
		.select({
			sk: companyDimension.sk,
		})
		.from(companyDimension)
		.where(
			sql`name = ${company} AND COALESCE(city, '') = '' AND COALESCE(country, '') = ''`,
		)
		.then((res) => res[0]);
	if (!skCompany) throw new Error('Failed to get SK Company!');

	const skTime = await dbStar
		.select({
			sk: timeDimension.sk,
		})
		.from(timeDimension)
		.where(
			eq(timeDimension.year, year) &&
				eq(timeDimension.quarter, quarter) &&
				eq(timeDimension.month, month),
		)
		.then((res) => res[0]);
	if (!skTime) throw new Error('Failed to get SK Time!');

	const totalSales = await dbRelational
		.select({
			total: sql<number>`SUM(gross_total)`.as('total'),
		})
		.from(invoices)
		.innerJoin(companies, eq(invoices.company_id, companies.id))
		.where(
			sql`EXTRACT(year from invoices.date) = ${year} AND EXTRACT(quarter from invoices.date) = ${quarter} AND EXTRACT(month from invoices.date) = ${month} AND companies.name = ${company}`,
		)
		.then((res) => res[0]);
	if (!totalSales) throw new Error('Failed to get total sales!');

	const composedSK = `${skCompany.sk}_${skTime.sk}`;

	const result = totalSales.total ? totalSales.total.toString() : '0';

	await dbStar
		.insert(salesFact)
		.values({
			sk: composedSK,
			value: result,
		})
		.onConflictDoUpdate({
			target: salesFact.sk,
			set: {
				value: result,
			},
		});
};

export const totalSalesRevenuePerYearProduct = async (
	dbRelational: PostgresJsDatabase<typeof relationalSchema>,
	dbStar: PostgresJsDatabase<typeof starSchema>,
	year: string,
	company: string,
	product: string,
) => {
	const skCompany = await dbStar
		.select({
			sk: companyDimension.sk,
		})
		.from(companyDimension)
		.where(
			sql`name = ${company} AND COALESCE(city, '') = '' AND COALESCE(country, '') = ''`,
		)
		.then((res) => res[0]);
	if (!skCompany) throw new Error('Failed to get SK Company!');

	const skTime = await dbStar
		.select({
			sk: timeDimension.sk,
		})
		.from(timeDimension)
		.where(
			sql`year = ${year} AND COALESCE(quarter, '') = '' AND COALESCE(month, '') = ''`,
		)
		.then((res) => res[0]);
	if (!skTime) throw new Error('Failed to get SK Time!');

	const skProduct = await dbStar
		.select({
			sk: productDimension.sk,
		})
		.from(productDimension)
		.where(sql`name = ${product} AND COALESCE(category, '') = ''`)
		.then((res) => res[0]);
	if (!skProduct) throw new Error('Failed to get SK Product!');

	const totalSales = await dbRelational
		.select({
			total: sql<number>`SUM(gross_total)`.as('total'),
		})
		.from(lines)
		.innerJoin(invoices, eq(lines.invoice_id, invoices.id))
		.innerJoin(companies, eq(invoices.company_id, companies.id))
		.innerJoin(products, eq(lines.product_id, products.id))
		.where(
			sql`EXTRACT(year from invoices.date) = ${year} AND companies.name = ${company} AND products.name = ${product}`,
		)
		.then((res) => res[0]);
	if (!totalSales) throw new Error('Failed to get total sales!');

	const composedSK = `${skCompany.sk}_${skTime.sk}_${skProduct.sk}`;

	const result = totalSales.total ? totalSales.total.toString() : '0';

	await dbStar
		.insert(salesFact)
		.values({
			sk: composedSK,
			value: result,
		})
		.onConflictDoUpdate({
			target: salesFact.sk,
			set: {
				value: result,
			},
		});
};

export const totalSalesRevenuePerQuarterProduct = async (
	dbRelational: PostgresJsDatabase<typeof relationalSchema>,
	dbStar: PostgresJsDatabase<typeof starSchema>,
	year: string,
	quarter: string,
	company: string,
	product: string,
) => {
	const skCompany = await dbStar
		.select({
			sk: companyDimension.sk,
		})
		.from(companyDimension)
		.where(
			sql`name = ${company} AND COALESCE(city, '') = '' AND COALESCE(country, '') = ''`,
		)
		.then((res) => res[0]);
	if (!skCompany) throw new Error('Failed to get SK Company!');

	const skTime = await dbStar
		.select({
			sk: timeDimension.sk,
		})
		.from(timeDimension)
		.where(
			sql`year = ${year} AND quarter = ${quarter} AND COALESCE(month, '') = ''`,
		)
		.then((res) => res[0]);
	if (!skTime) throw new Error('Failed to get SK Time!');

	const skProduct = await dbStar
		.select({
			sk: productDimension.sk,
		})
		.from(productDimension)
		.where(sql`name = ${product} AND COALESCE(category, '') = ''`)
		.then((res) => res[0]);
	if (!skProduct) throw new Error('Failed to get SK Product!');

	const totalSales = await dbRelational
		.select({
			total: sql<number>`SUM(gross_total)`.as('total'),
		})
		.from(lines)
		.innerJoin(invoices, eq(lines.invoice_id, invoices.id))
		.innerJoin(companies, eq(invoices.company_id, companies.id))
		.innerJoin(products, eq(lines.product_id, products.id))
		.where(
			sql`EXTRACT(year from invoices.date) = ${year} AND EXTRACT(quarter from invoices.date) = ${quarter} AND companies.name = ${company} AND products.name = ${product}`,
		)
		.then((res) => res[0]);
	if (!totalSales) throw new Error('Failed to get total sales!');

	const composedSK = `${skCompany.sk}_${skTime.sk}_${skProduct.sk}`;

	const result = totalSales.total ? totalSales.total.toString() : '0';

	await dbStar
		.insert(salesFact)
		.values({
			sk: composedSK,
			value: result,
		})
		.onConflictDoUpdate({
			target: salesFact.sk,
			set: {
				value: result,
			},
		});
};

export const totalSalesRevenuePerMonthProduct = async (
	dbRelational: PostgresJsDatabase<typeof relationalSchema>,
	dbStar: PostgresJsDatabase<typeof starSchema>,
	year: string,
	quarter: string,
	month: string,
	company: string,
	product: string,
) => {
	const skCompany = await dbStar
		.select({
			sk: companyDimension.sk,
		})
		.from(companyDimension)
		.where(
			sql`name = ${company} AND COALESCE(city, '') = '' AND COALESCE(country, '') = ''`,
		)
		.then((res) => res[0]);
	if (!skCompany) throw new Error('Failed to get SK Company!');

	const skTime = await dbStar
		.select({
			sk: timeDimension.sk,
		})
		.from(timeDimension)
		.where(
			eq(timeDimension.year, year) &&
				eq(timeDimension.quarter, quarter) &&
				eq(timeDimension.month, month),
		)
		.then((res) => res[0]);
	if (!skTime) throw new Error('Failed to get SK Time!');

	const skProduct = await dbStar
		.select({
			sk: productDimension.sk,
		})
		.from(productDimension)
		.where(sql`name = ${product} AND COALESCE(category, '') = ''`)
		.then((res) => res[0]);
	if (!skProduct) throw new Error('Failed to get SK Product!');

	const totalSales = await dbRelational
		.select({
			total: sql<number>`SUM(gross_total)`.as('total'),
		})
		.from(lines)
		.innerJoin(invoices, eq(lines.invoice_id, invoices.id))
		.innerJoin(companies, eq(invoices.company_id, companies.id))
		.innerJoin(products, eq(lines.product_id, products.id))
		.where(
			sql`EXTRACT(year from invoices.date) = ${year} AND EXTRACT(quarter from invoices.date) = ${quarter} AND EXTRACT(month from invoices.date) = ${month} AND companies.name = ${company} AND products.name = ${product}`,
		)
		.then((res) => res[0]);
	if (!totalSales) throw new Error('Failed to get total sales!');

	const composedSK = `${skCompany.sk}_${skTime.sk}_${skProduct.sk}`;

	const result = totalSales.total ? totalSales.total.toString() : '0';

	await dbStar
		.insert(salesFact)
		.values({
			sk: composedSK,
			value: result,
		})
		.onConflictDoUpdate({
			target: salesFact.sk,
			set: {
				value: result,
			},
		});
};

export const totalSalesRevenuePerYearCountry = async (
	dbRelational: PostgresJsDatabase<typeof relationalSchema>,
	dbStar: PostgresJsDatabase<typeof starSchema>,
	year: string,
	company: string,
	country: string,
) => {
	const skCompany = await dbStar
		.select({
			sk: companyDimension.sk,
		})
		.from(companyDimension)
		.where(
			sql`name = ${company} AND COALESCE(city, '') = '' AND COALESCE(country, '') = ''`,
		)
		.then((res) => res[0]);
	if (!skCompany) throw new Error('Failed to get SK Company!');

	const skTime = await dbStar
		.select({
			sk: timeDimension.sk,
		})
		.from(timeDimension)
		.where(
			sql`year = ${year} AND COALESCE(quarter, '') = '' AND COALESCE(month, '') = ''`,
		)
		.then((res) => res[0]);
	if (!skTime) throw new Error('Failed to get SK Time!');

	const skCountry = await dbStar
		.select({
			sk: geoDimension.sk,
		})
		.from(geoDimension)
		.where(sql`country = ${country} AND COALESCE(city, '') = ''`)
		.then((res) => res[0]);
	if (!skCountry) throw new Error('Failed to get SK Country!');

	const totalSales = await dbRelational
		.select({
			total: sql<number>`SUM(gross_total)`.as('total'),
		})
		.from(invoices)
		.innerJoin(companies, eq(invoices.company_id, companies.id))
		.innerJoin(customers, eq(invoices.customer_id, customers.id))
		.innerJoin(addresses, eq(customers.address_id, addresses.id))
		.where(
			sql`EXTRACT(year from invoices.date) = ${year} AND companies.name = ${company} AND addresses.country = ${country}`,
		)
		.then((res) => res[0]);
	if (!totalSales) throw new Error('Failed to get total sales!');

	const composedSK = `${skCompany.sk}_${skTime.sk}_${skCountry.sk}`;

	const result = totalSales.total ? totalSales.total.toString() : '0';

	await dbStar
		.insert(salesFact)
		.values({
			sk: composedSK,
			value: result,
		})
		.onConflictDoUpdate({
			target: salesFact.sk,
			set: {
				value: result,
			},
		});
};

export const totalSalesRevenuePerQuarterCountry = async (
	dbRelational: PostgresJsDatabase<typeof relationalSchema>,
	dbStar: PostgresJsDatabase<typeof starSchema>,
	year: string,
	quarter: string,
	company: string,
	country: string,
) => {
	const skCompany = await dbStar
		.select({
			sk: companyDimension.sk,
		})
		.from(companyDimension)
		.where(
			sql`name = ${company} AND COALESCE(city, '') = '' AND COALESCE(country, '') = ''`,
		)
		.then((res) => res[0]);
	if (!skCompany) throw new Error('Failed to get SK Company!');

	const skTime = await dbStar
		.select({
			sk: timeDimension.sk,
		})
		.from(timeDimension)
		.where(
			sql`year = ${year} AND quarter = ${quarter} AND COALESCE(month, '') = ''`,
		)
		.then((res) => res[0]);
	if (!skTime) throw new Error('Failed to get SK Time!');

	const skCountry = await dbStar
		.select({
			sk: geoDimension.sk,
		})
		.from(geoDimension)
		.where(sql`country = ${country} AND COALESCE(city, '') = ''`)
		.then((res) => res[0]);
	if (!skCountry) throw new Error('Failed to get SK Country!');

	const totalSales = await dbRelational
		.select({
			total: sql<number>`SUM(gross_total)`.as('total'),
		})
		.from(invoices)
		.innerJoin(companies, eq(invoices.company_id, companies.id))
		.innerJoin(customers, eq(invoices.customer_id, customers.id))
		.innerJoin(addresses, eq(customers.address_id, addresses.id))
		.where(
			sql`EXTRACT(year from invoices.date) = ${year} AND EXTRACT(quarter from invoices.date) = ${quarter} AND companies.name = ${company} AND addresses.country = ${country}`,
		)
		.then((res) => res[0]);
	if (!totalSales) throw new Error('Failed to get total sales!');

	const composedSK = `${skCompany.sk}_${skTime.sk}_${skCountry.sk}`;

	const result = totalSales.total ? totalSales.total.toString() : '0';

	await dbStar
		.insert(salesFact)
		.values({
			sk: composedSK,
			value: result,
		})
		.onConflictDoUpdate({
			target: salesFact.sk,
			set: {
				value: result,
			},
		});
};

export const totalSalesRevenuePerMonthCountry = async (
	dbRelational: PostgresJsDatabase<typeof relationalSchema>,
	dbStar: PostgresJsDatabase<typeof starSchema>,
	year: string,
	quarter: string,
	month: string,
	company: string,
	country: string,
) => {
	const skCompany = await dbStar
		.select({
			sk: companyDimension.sk,
		})
		.from(companyDimension)
		.where(
			sql`name = ${company} AND COALESCE(city, '') = '' AND COALESCE(country, '') = ''`,
		)
		.then((res) => res[0]);
	if (!skCompany) throw new Error('Failed to get SK Company!');

	const skTime = await dbStar
		.select({
			sk: timeDimension.sk,
		})
		.from(timeDimension)
		.where(
			eq(timeDimension.year, year) &&
				eq(timeDimension.quarter, quarter) &&
				eq(timeDimension.month, month),
		)
		.then((res) => res[0]);
	if (!skTime) throw new Error('Failed to get SK Time!');

	const skCountry = await dbStar
		.select({
			sk: geoDimension.sk,
		})
		.from(geoDimension)
		.where(sql`country = ${country} AND COALESCE(city, '') = ''`)
		.then((res) => res[0]);
	if (!skCountry) throw new Error('Failed to get SK Country!');

	const totalSales = await dbRelational
		.select({
			total: sql<number>`SUM(gross_total)`.as('total'),
		})
		.from(invoices)
		.innerJoin(companies, eq(invoices.company_id, companies.id))
		.innerJoin(customers, eq(invoices.customer_id, customers.id))
		.innerJoin(addresses, eq(customers.address_id, addresses.id))
		.where(
			sql`EXTRACT(year from invoices.date) = ${year} AND EXTRACT(quarter from invoices.date) = ${quarter} AND EXTRACT(month from invoices.date) = ${month} AND companies.name = ${company} AND addresses.country = ${country}`,
		)
		.then((res) => res[0]);
	if (!totalSales) throw new Error('Failed to get total sales!');

	const composedSK = `${skCompany.sk}_${skTime.sk}_${skCountry.sk}`;

	const result = totalSales.total ? totalSales.total.toString() : '0';

	await dbStar
		.insert(salesFact)
		.values({
			sk: composedSK,
			value: result,
		})
		.onConflictDoUpdate({
			target: salesFact.sk,
			set: {
				value: result,
			},
		});
};

export const totalSalesRevenuePerYearCity = async (
	dbRelational: PostgresJsDatabase<typeof relationalSchema>,
	dbStar: PostgresJsDatabase<typeof starSchema>,
	year: string,
	company: string,
	city: string,
) => {
	const skCompany = await dbStar
		.select({
			sk: companyDimension.sk,
		})
		.from(companyDimension)
		.where(
			sql`name = ${company} AND COALESCE(city, '') = '' AND COALESCE(country, '') = ''`,
		)
		.then((res) => res[0]);
	if (!skCompany) throw new Error('Failed to get SK Company!');

	const skTime = await dbStar
		.select({
			sk: timeDimension.sk,
		})
		.from(timeDimension)
		.where(
			sql`year = ${year} AND COALESCE(quarter, '') = '' AND COALESCE(month, '') = ''`,
		)
		.then((res) => res[0]);
	if (!skTime) throw new Error('Failed to get SK Time!');

	const skCity = await dbStar
		.select({
			sk: geoDimension.sk,
		})
		.from(geoDimension)
		.where(eq(geoDimension.city, city))
		.then((res) => res[0]);
	if (!skCity) throw new Error('Failed to get SK City!');

	const totalSales = await dbRelational
		.select({
			total: sql<number>`SUM(gross_total)`.as('total'),
		})
		.from(invoices)
		.innerJoin(companies, eq(invoices.company_id, companies.id))
		.innerJoin(customers, eq(invoices.customer_id, customers.id))
		.innerJoin(addresses, eq(customers.address_id, addresses.id))
		.where(
			sql`EXTRACT(year from invoices.date) = ${year} AND companies.name = ${company} AND addresses.city = ${city}`,
		)
		.then((res) => res[0]);
	if (!totalSales) throw new Error('Failed to get total sales!');

	const composedSK = `${skCompany.sk}_${skTime.sk}_${skCity.sk}`;

	const result = totalSales.total ? totalSales.total.toString() : '0';

	await dbStar
		.insert(salesFact)
		.values({
			sk: composedSK,
			value: result,
		})
		.onConflictDoUpdate({
			target: salesFact.sk,
			set: {
				value: result,
			},
		});
};

export const totalSalesRevenuePerQuarterCity = async (
	dbRelational: PostgresJsDatabase<typeof relationalSchema>,
	dbStar: PostgresJsDatabase<typeof starSchema>,
	year: string,
	quarter: string,
	company: string,
	city: string,
) => {
	const skCompany = await dbStar
		.select({
			sk: companyDimension.sk,
		})
		.from(companyDimension)
		.where(
			sql`name = ${company} AND COALESCE(city, '') = '' AND COALESCE(country, '') = ''`,
		)
		.then((res) => res[0]);
	if (!skCompany) throw new Error('Failed to get SK Company!');

	const skTime = await dbStar
		.select({
			sk: timeDimension.sk,
		})
		.from(timeDimension)
		.where(
			sql`year = ${year} AND quarter = ${quarter} AND COALESCE(month, '') = ''`,
		)
		.then((res) => res[0]);
	if (!skTime) throw new Error('Failed to get SK Time!');

	const skCity = await dbStar
		.select({
			sk: geoDimension.sk,
		})
		.from(geoDimension)
		.where(eq(geoDimension.city, city))
		.then((res) => res[0]);
	if (!skCity) throw new Error('Failed to get SK City!');

	const totalSales = await dbRelational
		.select({
			total: sql<number>`SUM(gross_total)`.as('total'),
		})
		.from(invoices)
		.innerJoin(companies, eq(invoices.company_id, companies.id))
		.innerJoin(customers, eq(invoices.customer_id, customers.id))
		.innerJoin(addresses, eq(customers.address_id, addresses.id))
		.where(
			sql`EXTRACT(year from invoices.date) = ${year} AND EXTRACT(quarter from invoices.date) = ${quarter} AND companies.name = ${company} AND addresses.city = ${city}`,
		)
		.then((res) => res[0]);
	if (!totalSales) throw new Error('Failed to get total sales!');

	const composedSK = `${skCompany.sk}_${skTime.sk}_${skCity.sk}`;

	const result = totalSales.total ? totalSales.total.toString() : '0';

	await dbStar
		.insert(salesFact)
		.values({
			sk: composedSK,
			value: result,
		})
		.onConflictDoUpdate({
			target: salesFact.sk,
			set: {
				value: result,
			},
		});
};

export const totalSalesRevenuePerMonthCity = async (
	dbRelational: PostgresJsDatabase<typeof relationalSchema>,
	dbStar: PostgresJsDatabase<typeof starSchema>,
	year: string,
	quarter: string,
	month: string,
	company: string,
	city: string,
) => {
	const skCompany = await dbStar
		.select({
			sk: companyDimension.sk,
		})
		.from(companyDimension)
		.where(
			sql`name = ${company} AND COALESCE(city, '') = '' AND COALESCE(country, '') = ''`,
		)
		.then((res) => res[0]);
	if (!skCompany) throw new Error('Failed to get SK Company!');

	const skTime = await dbStar
		.select({
			sk: timeDimension.sk,
		})
		.from(timeDimension)
		.where(
			sql`year = ${year} AND quarter = ${quarter} AND month = ${month}`,
		)
		.then((res) => res[0]);
	if (!skTime) throw new Error('Failed to get SK Time!');

	const skCity = await dbStar
		.select({
			sk: geoDimension.sk,
		})
		.from(geoDimension)
		.where(eq(geoDimension.city, city))
		.then((res) => res[0]);
	if (!skCity) throw new Error('Failed to get SK City!');

	const totalSales = await dbRelational
		.select({
			total: sql<number>`SUM(gross_total)`.as('total'),
		})
		.from(invoices)
		.innerJoin(companies, eq(invoices.company_id, companies.id))
		.innerJoin(customers, eq(invoices.customer_id, customers.id))
		.innerJoin(addresses, eq(customers.address_id, addresses.id))
		.where(
			sql`EXTRACT(year from invoices.date) = ${year} AND EXTRACT(quarter from invoices.date) = ${quarter} AND EXTRACT(month from invoices.date) = ${month} AND companies.name = ${company} AND addresses.city = ${city}`,
		)
		.then((res) => res[0]);
	if (!totalSales) throw new Error('Failed to get total sales!');

	const composedSK = `${skCompany.sk}_${skTime.sk}_${skCity.sk}`;

	const result = totalSales.total ? totalSales.total.toString() : '0';

	await dbStar
		.insert(salesFact)
		.values({
			sk: composedSK,
			value: result,
		})
		.onConflictDoUpdate({
			target: salesFact.sk,
			set: {
				value: result,
			},
		});
};

export const totalSalesRevenuePerYearCustomer = async (
	dbRelational: PostgresJsDatabase<typeof relationalSchema>,
	dbStar: PostgresJsDatabase<typeof starSchema>,
	year: string,
	company: string,
	customer: string,
) => {
	const skCompany = await dbStar
		.select({
			sk: companyDimension.sk,
		})
		.from(companyDimension)
		.where(
			sql`name = ${company} AND COALESCE(city, '') = '' AND COALESCE(country, '') = ''`,
		)
		.then((res) => res[0]);
	if (!skCompany) throw new Error('Failed to get SK Company!');

	const skTime = await dbStar
		.select({
			sk: timeDimension.sk,
		})
		.from(timeDimension)
		.where(
			sql`year = ${year} AND COALESCE(quarter, '') = '' AND COALESCE(month, '') = ''`,
		)
		.then((res) => res[0]);
	if (!skTime) throw new Error('Failed to get SK Time!');

	const skCustomer = await dbStar
		.select({
			sk: customerDimension.sk,
		})
		.from(customerDimension)
		.where(eq(customerDimension.name, customer))
		.then((res) => res[0]);
	if (!skCustomer) throw new Error('Failed to get SK Customer!');

	const totalSales = await dbRelational
		.select({
			total: sql<number>`SUM(gross_total)`.as('total'),
		})
		.from(invoices)
		.innerJoin(companies, eq(invoices.company_id, companies.id))
		.innerJoin(customers, eq(invoices.customer_id, customers.id))
		.where(
			sql`EXTRACT(year from invoices.date) = ${year} AND companies.name = ${company} AND customers.name = ${customer}`,
		)
		.then((res) => res[0]);
	if (!totalSales) throw new Error('Failed to get total sales!');

	const composedSK = `${skCompany.sk}_${skTime.sk}_${skCustomer.sk}`;

	const result = totalSales.total ? totalSales.total.toString() : '0';

	await dbStar
		.insert(salesFact)
		.values({
			sk: composedSK,
			value: result,
		})
		.onConflictDoUpdate({
			target: salesFact.sk,
			set: {
				value: result,
			},
		});
};

export const totalSalesRevenuePerQuarterCustomer = async (
	dbRelational: PostgresJsDatabase<typeof relationalSchema>,
	dbStar: PostgresJsDatabase<typeof starSchema>,
	year: string,
	quarter: string,
	company: string,
	customer: string,
) => {
	const skCompany = await dbStar
		.select({
			sk: companyDimension.sk,
		})
		.from(companyDimension)
		.where(
			sql`name = ${company} AND COALESCE(city, '') = '' AND COALESCE(country, '') = ''`,
		)
		.then((res) => res[0]);
	if (!skCompany) throw new Error('Failed to get SK Company!');

	const skTime = await dbStar
		.select({
			sk: timeDimension.sk,
		})
		.from(timeDimension)
		.where(
			sql`year = ${year} AND quarter = ${quarter} AND COALESCE(month, '') = ''`,
		)
		.then((res) => res[0]);
	if (!skTime) throw new Error('Failed to get SK Time!');

	const skCustomer = await dbStar
		.select({
			sk: customerDimension.sk,
		})
		.from(customerDimension)
		.where(eq(customerDimension.name, customer))
		.then((res) => res[0]);
	if (!skCustomer) throw new Error('Failed to get SK Customer!');

	const totalSales = await dbRelational
		.select({
			total: sql<number>`SUM(gross_total)`.as('total'),
		})
		.from(invoices)
		.innerJoin(companies, eq(invoices.company_id, companies.id))
		.innerJoin(customers, eq(invoices.customer_id, customers.id))
		.where(
			sql`EXTRACT(year from invoices.date) = ${year} AND EXTRACT(quarter from invoices.date) = ${quarter} AND companies.name = ${company} AND customers.name = ${customer}`,
		)
		.then((res) => res[0]);
	if (!totalSales) throw new Error('Failed to get total sales!');

	const composedSK = `${skCompany.sk}_${skTime.sk}_${skCustomer.sk}`;

	const result = totalSales.total ? totalSales.total.toString() : '0';

	await dbStar
		.insert(salesFact)
		.values({
			sk: composedSK,
			value: result,
		})
		.onConflictDoUpdate({
			target: salesFact.sk,
			set: {
				value: result,
			},
		});
};

export const totalSalesRevenuePerMonthCustomer = async (
	dbRelational: PostgresJsDatabase<typeof relationalSchema>,
	dbStar: PostgresJsDatabase<typeof starSchema>,
	year: string,
	quarter: string,
	month: string,
	company: string,
	customer: string,
) => {
	const skCompany = await dbStar
		.select({
			sk: companyDimension.sk,
		})
		.from(companyDimension)
		.where(
			sql`name = ${company} AND COALESCE(city, '') = '' AND COALESCE(country, '') = ''`,
		)
		.then((res) => res[0]);
	if (!skCompany) throw new Error('Failed to get SK Company!');

	const skTime = await dbStar
		.select({
			sk: timeDimension.sk,
		})
		.from(timeDimension)
		.where(
			eq(timeDimension.year, year) &&
				eq(timeDimension.quarter, quarter) &&
				eq(timeDimension.month, month),
		)
		.then((res) => res[0]);
	if (!skTime) throw new Error('Failed to get SK Time!');

	const skCustomer = await dbStar
		.select({
			sk: customerDimension.sk,
		})
		.from(customerDimension)
		.where(eq(customerDimension.name, customer))
		.then((res) => res[0]);
	if (!skCustomer) throw new Error('Failed to get SK Customer!');

	const totalSales = await dbRelational
		.select({
			total: sql<number>`SUM(gross_total)`.as('total'),
		})
		.from(invoices)
		.innerJoin(companies, eq(invoices.company_id, companies.id))
		.innerJoin(customers, eq(invoices.customer_id, customers.id))
		.where(
			sql`EXTRACT(year from invoices.date) = ${year} AND EXTRACT(quarter from invoices.date) = ${quarter} AND EXTRACT(month from invoices.date) = ${month} AND companies.name = ${company} AND customers.name = ${customer}`,
		)
		.then((res) => res[0]);
	if (!totalSales) throw new Error('Failed to get total sales!');

	const composedSK = `${skCompany.sk}_${skTime.sk}_${skCustomer.sk}`;

	const result = totalSales.total ? totalSales.total.toString() : '0';

	await dbStar
		.insert(salesFact)
		.values({
			sk: composedSK,
			value: result,
		})
		.onConflictDoUpdate({
			target: salesFact.sk,
			set: {
				value: result,
			},
		});
};

export const analitycs = async (
	dbRelational: PostgresJsDatabase<typeof relationalSchema>,
	dbStar: PostgresJsDatabase<typeof starSchema>,
) => {
	const selectedYears = await dbStar
		.selectDistinct({
			year: timeDimension.year,
		})
		.from(timeDimension);
	if (!selectedYears) throw new Error('Failed to get years!');

	const selectedCompanies = await dbStar
		.selectDistinct({
			company: companyDimension.name,
		})
		.from(companyDimension);
	if (!selectedCompanies) throw new Error('Failed to get companies!');

	const selectedProducts = await dbStar
		.selectDistinct({
			product: productDimension.name,
		})
		.from(productDimension);
	if (!selectedProducts) throw new Error('Failed to get products!');

	const selectedCountries = await dbStar
		.selectDistinct({
			country: geoDimension.country,
		})
		.from(geoDimension);
	if (!selectedCountries) throw new Error('Failed to get countries!');

	const selectedCities = await dbStar
		.selectDistinct({
			city: geoDimension.city,
		})
		.from(geoDimension)
		.where(sql`COALESCE(city, '') != ''`);
	if (!selectedCities) throw new Error('Failed to get cities!');

	console.log('selectedCities', selectedCities);

	const selectedCustomers = await dbStar
		.selectDistinct({
			customer: customerDimension.name,
		})
		.from(customerDimension);
	if (!selectedCustomers) throw new Error('Failed to get customers!');

	for (const year of selectedYears) {
		for (const company of selectedCompanies) {
			if (!company.company) throw new Error('Failed to get company!');
			if (!year.year) throw new Error('Failed to get year!');

			await totalSalesRevenuePerYear(
				dbRelational,
				dbStar,
				year.year,
				company.company,
			);

			const quartersPromises = [];
			for (let quarter = 1; quarter <= 4; quarter++) {
				quartersPromises.push(
					totalSalesRevenuePerQuarter(
						dbRelational,
						dbStar,
						year.year,
						quarter.toString(),
						company.company,
					),
				);
			}
			await Promise.all(quartersPromises);

			const monthsPromises = [];
			for (let month = 1; month <= 12; month++) {
				monthsPromises.push(
					totalSalesRevenuePerMonth(
						dbRelational,
						dbStar,
						year.year,
						Math.ceil(month / 3).toString(),
						month.toString(),
						company.company,
					),
				);
			}
			await Promise.all(monthsPromises);

			for (const product of selectedProducts) {
				if (!product.product) throw new Error('Failed to get product!');

				const productCompany = await dbRelational
					.select({
						company: companies.name,
					})
					.from(products)
					.innerJoin(companies, eq(products.company_id, companies.id))
					.where(
						eq(products.name, product.product) &&
							eq(companies.name, company.company),
					)
					.then((res) => res[0]);

				if (!productCompany) continue;

				await totalSalesRevenuePerYearProduct(
					dbRelational,
					dbStar,
					year.year,
					company.company,
					product.product,
				);

				const quartersPromises = [];
				for (let quarter = 1; quarter <= 4; quarter++) {
					quartersPromises.push(
						totalSalesRevenuePerQuarterProduct(
							dbRelational,
							dbStar,
							year.year,
							quarter.toString(),
							company.company,
							product.product,
						),
					);
				}
				await Promise.all(quartersPromises);

				const monthsPromises = [];
				for (let month = 1; month <= 12; month++) {
					monthsPromises.push(
						totalSalesRevenuePerMonthProduct(
							dbRelational,
							dbStar,
							year.year,
							Math.ceil(month / 3).toString(),
							month.toString(),
							company.company,
							product.product,
						),
					);
				}
				await Promise.all(monthsPromises);
			}

			for (const country of selectedCountries) {
				if (!country.country) throw new Error('Failed to get country!');

				await totalSalesRevenuePerYearCountry(
					dbRelational,
					dbStar,
					year.year,
					company.company,
					country.country,
				);

				const quartersPromises = [];
				for (let quarter = 1; quarter <= 4; quarter++) {
					quartersPromises.push(
						totalSalesRevenuePerQuarterCountry(
							dbRelational,
							dbStar,
							year.year,
							quarter.toString(),
							company.company,
							country.country,
						),
					);
				}
				await Promise.all(quartersPromises);

				const monthsPromises = [];
				for (let month = 1; month <= 12; month++) {
					monthsPromises.push(
						totalSalesRevenuePerMonthCountry(
							dbRelational,
							dbStar,
							year.year,
							Math.ceil(month / 3).toString(),
							month.toString(),
							company.company,
							country.country,
						),
					);
				}
				await Promise.all(monthsPromises);
			}

			for (const city of selectedCities) {
				if (!city.city) throw new Error('Failed to get city!');

				await totalSalesRevenuePerYearCity(
					dbRelational,
					dbStar,
					year.year,
					company.company,
					city.city,
				);

				const quartersPromises = [];
				for (let quarter = 1; quarter <= 4; quarter++) {
					quartersPromises.push(
						totalSalesRevenuePerQuarterCity(
							dbRelational,
							dbStar,
							year.year,
							quarter.toString(),
							company.company,
							city.city,
						),
					);
				}
				await Promise.all(quartersPromises);

				const monthsPromises = [];
				for (let month = 1; month <= 12; month++) {
					monthsPromises.push(
						totalSalesRevenuePerMonthCity(
							dbRelational,
							dbStar,
							year.year,
							Math.ceil(month / 3).toString(),
							month.toString(),
							company.company,
							city.city,
						),
					);
				}
				await Promise.all(monthsPromises);
			}

			for (const customer of selectedCustomers) {
				if (!customer.customer)
					throw new Error('Failed to get customer!');

				const customerCompany = await dbRelational
					.select({
						company: companies.name,
					})
					.from(customers)
					.innerJoin(
						companies,
						eq(customers.company_id, companies.id),
					)
					.where(
						eq(customers.name, customer.customer) &&
							eq(companies.name, company.company),
					)
					.then((res) => res[0]);

				if (!customerCompany) continue;

				await totalSalesRevenuePerYearCustomer(
					dbRelational,
					dbStar,
					year.year,
					company.company,
					customer.customer,
				);

				const quartersPromises = [];
				for (let quarter = 1; quarter <= 4; quarter++) {
					quartersPromises.push(
						totalSalesRevenuePerQuarterCustomer(
							dbRelational,
							dbStar,
							year.year,
							quarter.toString(),
							company.company,
							customer.customer,
						),
					);
				}
				await Promise.all(quartersPromises);

				const monthsPromises = [];
				for (let month = 1; month <= 12; month++) {
					monthsPromises.push(
						totalSalesRevenuePerMonthCustomer(
							dbRelational,
							dbStar,
							year.year,
							Math.ceil(month / 3).toString(),
							month.toString(),
							company.company,
							customer.customer,
						),
					);
				}
				await Promise.all(monthsPromises);
			}
		}
	}
};
