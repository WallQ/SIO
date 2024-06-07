import type * as relationalSchema from '@/server/db/relational-schema';
import {
	addresses,
	companies,
	customers,
	invoices,
	products,
} from '@/server/db/relational-schema';
import type * as starSchema from '@/server/db/star-schema';
import {
	companyDimension,
	customerDimension,
	geoDimension,
	productDimension,
	timeDimension,
} from '@/server/db/star-schema';
import { eq, sql } from 'drizzle-orm';
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export const insertCompaniesDim = async (
	dbRelational: PostgresJsDatabase<typeof relationalSchema>,
	dbStar: PostgresJsDatabase<typeof starSchema>,
) => {
	const selectedCompanies: (typeof companies.$inferSelect & {
		address: typeof addresses.$inferSelect;
	})[] = await dbRelational
		.select({
			id: companies.id,
			name: companies.name,
			address_id: companies.address_id,
			fiscal_year: companies.fiscal_year,
			start_date: companies.start_date,
			end_date: companies.end_date,
			address: addresses,
		})
		.from(companies)
		.innerJoin(addresses, eq(companies.address_id, addresses.id));

	const parsedCompaniesDimName: (typeof companyDimension.$inferInsert)[] =
		selectedCompanies.map((company) => {
			const sk = `SK_${company.name.replace(/\s+/g, '-')}`;
			return {
				sk,
				name: company.name,
				city: null,
				country: null,
			};
		});

	const parsedCompaniesDimCity: (typeof companyDimension.$inferInsert)[] =
		selectedCompanies.map((company) => {
			const sk = `SK_${company.name.replace(/\s+/g, '-')}_${company.address.city.replace(/\s+/g, '-')}`;
			return {
				sk,
				name: company.name,
				city: company.address.city,
				country: null,
			};
		});

	const parsedCompaniesDimCountry: (typeof companyDimension.$inferInsert)[] =
		selectedCompanies.map((company) => {
			const sk = `SK_${company.name.replace(/\s+/g, '-')}_${company.address.country.replace(/\s+/g, '-')}`;
			return {
				sk,
				name: company.name,
				city: null,
				country: company.address.country,
			};
		});

	const parsedCompaniesCityCountry: (typeof companyDimension.$inferInsert)[] =
		selectedCompanies.map((company) => {
			const sk = `SK_${company.name.replace(/\s+/g, '-')}_${company.address.city.replace(/\s+/g, '-')}_${company.address.country.replace(/\s+/g, '-')}`;
			return {
				sk,
				name: company.name,
				city: company.address.city,
				country: company.address.country,
			};
		});

	const parsedCompaniesDim: (typeof companyDimension.$inferInsert)[] = [
		...parsedCompaniesDimName,
		...parsedCompaniesDimCity,
		...parsedCompaniesDimCountry,
		...parsedCompaniesCityCountry,
	];

	const insertedCompaniesDim = await dbStar
		.insert(companyDimension)
		.values(parsedCompaniesDim)
		.onConflictDoNothing()
		.returning();

	if (!insertedCompaniesDim)
		throw new Error('Failed to insert companies dimension!');

	return insertedCompaniesDim;
};

export const insertProductsDim = async (
	dbRelational: PostgresJsDatabase<typeof relationalSchema>,
	dbStar: PostgresJsDatabase<typeof starSchema>,
) => {
	const selectedProducts: (typeof products.$inferSelect)[] =
		await dbRelational.select().from(products);

	const parsedProductsDimName: (typeof productDimension.$inferInsert)[] =
		selectedProducts.map((product) => {
			const sk = `SK_${product.name.replace(/\s+/g, '-')}`;
			return {
				sk,
				name: product.name,
				category: null,
			};
		});

	const parsedProductsDimCategory: (typeof productDimension.$inferInsert)[] =
		selectedProducts.map((product) => {
			const sk = `SK_${product.category.replace(/\s+/g, '-')}`;
			return {
				sk,
				name: null,
				category: product.category,
			};
		});

	const parsedProductsDimNameCategory: (typeof productDimension.$inferInsert)[] =
		selectedProducts.map((product) => {
			const sk = `SK_${product.name.replace(/\s+/g, '-')}_${product.category.replace(/\s+/g, '-')}`;
			return {
				sk,
				name: product.name,
				category: product.category,
			};
		});

	const parsedProductsDim: (typeof productDimension.$inferInsert)[] = [
		...parsedProductsDimName,
		...parsedProductsDimCategory,
		...parsedProductsDimNameCategory,
	];

	const insertedProductsDim = await dbStar
		.insert(productDimension)
		.values(parsedProductsDim)
		.onConflictDoNothing()
		.returning();

	if (!insertedProductsDim)
		throw new Error('Failed to insert companies dimension!');

	return insertedProductsDim;
};

export const insertCustomersDim = async (
	dbRelational: PostgresJsDatabase<typeof relationalSchema>,
	dbStar: PostgresJsDatabase<typeof starSchema>,
) => {
	const selectedCustomers: (typeof customers.$inferSelect & {
		address: typeof addresses.$inferSelect;
		company: typeof companies.$inferSelect;
	})[] = await dbRelational
		.select({
			id: customers.id,
			name: customers.name,
			address_id: customers.address_id,
			email: customers.email,
			telephone: customers.telephone,
			tax_id: customers.tax_id,
			company_id: customers.company_id,
			address: addresses,
			company: companies,
		})
		.from(customers)
		.innerJoin(addresses, eq(customers.address_id, addresses.id))
		.innerJoin(companies, eq(customers.company_id, companies.id));

	const parsedCustomersDimName: (typeof customerDimension.$inferInsert)[] =
		selectedCustomers.map((customer) => {
			const sk = `SK_${customer.name.replace(/\s+/g, '-')}`;
			return {
				sk,
				name: customer.name,
				city: null,
				country: null,
			};
		});

	const parsedCustomersDimCity: (typeof customerDimension.$inferInsert)[] =
		selectedCustomers.map((customer) => {
			const sk = `SK_${customer.name.replace(/\s+/g, '-')}_${customer.address.city.replace(/\s+/g, '-')}`;
			return {
				sk,
				name: customer.name,
				city: customer.address.city,
				country: null,
			};
		});

	const parsedCustomersDimCountry: (typeof customerDimension.$inferInsert)[] =
		selectedCustomers.map((customer) => {
			const sk = `SK_${customer.name.replace(/\s+/g, '-')}_${customer.address.country.replace(/\s+/g, '-')}`;
			return {
				sk,
				name: customer.name,
				city: null,
				country: customer.address.country,
			};
		});

	const parsedCustomersDimCityCountry: (typeof customerDimension.$inferInsert)[] =
		selectedCustomers.map((customer) => {
			const sk = `SK_${customer.name.replace(/\s+/g, '-')}_${customer.address.city.replace(/\s+/g, '-')}_${customer.address.country.replace(/\s+/g, '-')}`;
			return {
				sk,
				name: customer.name,
				city: customer.address.city,
				country: customer.address.country,
			};
		});

	const parsedCustomersDim: (typeof customerDimension.$inferInsert)[] = [
		...parsedCustomersDimName,
		...parsedCustomersDimCity,
		...parsedCustomersDimCountry,
		...parsedCustomersDimCityCountry,
	];

	const insertedCustomersDim = await dbStar
		.insert(customerDimension)
		.values(parsedCustomersDim)
		.onConflictDoNothing()
		.returning();

	if (!insertedCustomersDim)
		throw new Error('Failed to insert customers dimension!');
};

export const insertGeoDim = async (
	dbRelational: PostgresJsDatabase<typeof relationalSchema>,
	dbStar: PostgresJsDatabase<typeof starSchema>,
) => {
	const selectedAddresses = await dbRelational
		.selectDistinct({
			city: addresses.city,
			country: addresses.country,
		})
		.from(addresses);

	const parsedGeoDimCities: (typeof geoDimension.$inferInsert)[] =
		selectedAddresses.map((address) => {
			const sk = `SK_${address.city.replace(/\s+/g, '-')}`;
			return {
				sk,
				city: address.city,
				country: null,
			};
		});

	const parsedGeoDimCountries: (typeof geoDimension.$inferInsert)[] =
		selectedAddresses.map((address) => {
			const sk = `SK_${address.country.replace(/\s+/g, '-')}`;
			return {
				sk,
				city: null,
				country: address.country,
			};
		});

	const parsedGeoDimCountryCity: (typeof geoDimension.$inferInsert)[] =
		selectedAddresses.map((address) => {
			const sk = `SK_${address.country.replace(/\s+/g, '-')}_${address.city.replace(/\s+/g, '-')}`;
			return {
				sk,
				city: address.city,
				country: address.country,
			};
		});

	const parsedGeoDim: (typeof geoDimension.$inferInsert)[] = [
		...parsedGeoDimCities,
		...parsedGeoDimCountries,
		...parsedGeoDimCountryCity,
	];

	const insertedGeoDim = await dbStar
		.insert(geoDimension)
		.values(parsedGeoDim)
		.onConflictDoNothing()
		.returning();

	if (!insertedGeoDim) throw new Error('Failed to insert geo dimension!');

	return insertedGeoDim;
};

export const insertTimeDim = async (
	dbRelational: PostgresJsDatabase<typeof relationalSchema>,
	dbStar: PostgresJsDatabase<typeof starSchema>,
) => {
	const selectedTime = await dbRelational
		.selectDistinct({
			year: sql<string>`EXTRACT(YEAR FROM ${invoices.date})`.as('year'),
		})
		.from(invoices);

	const parsedTimeDimYear: (typeof timeDimension.$inferInsert)[] =
		selectedTime.map((time) => {
			const sk = `SK_${time.year}`;
			return {
				sk,
				year: time.year,
				quarter: null,
				month: null,
			};
		});

	const parsedTimeDimQuarter: (typeof timeDimension.$inferInsert)[] =
		selectedTime.flatMap((time) => {
			const quarters = Array.from({ length: 4 }, (_, i) => i + 1);
			return quarters.map((quarter) => {
				const sk = `SK_${time.year}_${quarter}`;
				return {
					sk,
					year: time.year,
					quarter: quarter.toString(),
					month: null,
				};
			});
		});

	const parsedTimeDimMonth: (typeof timeDimension.$inferInsert)[] =
		selectedTime.flatMap((time) => {
			const months = Array.from({ length: 12 }, (_, i) => i + 1);
			return months.map((month) => {
				const sk = `SK_${time.year}_${month}`;
				return {
					sk,
					year: time.year,
					month: month.toString(),
					quarter: null,
				};
			});
		});

	const parsedTimeDimYearQuarterMonth: (typeof timeDimension.$inferInsert)[] =
		selectedTime.flatMap((time) => {
			const quarters = Array.from({ length: 4 }, (_, i) => i + 1);
			const months = Array.from({ length: 12 }, (_, i) => i + 1);
			return quarters.flatMap((quarter) => {
				return months.map((month) => {
					const sk = `SK_${time.year}_${quarter}_${month}`;
					return {
						sk,
						year: time.year,
						quarter: quarter.toString(),
						month: month.toString(),
					};
				});
			});
		});

	const parsedTimeDim: (typeof timeDimension.$inferInsert)[] = [
		...parsedTimeDimYear,
		...parsedTimeDimQuarter,
		...parsedTimeDimMonth,
		...parsedTimeDimYearQuarterMonth,
	];

	const insertedTimeDim = await dbStar
		.insert(timeDimension)
		.values(parsedTimeDim)
		.onConflictDoNothing()
		.returning();

	if (!insertedTimeDim) throw new Error('Failed to insert time dimension!');

	return insertedTimeDim;
};
