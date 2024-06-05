import * as relationalSchema from '@/server/db/relational-schema';
import { parseISO } from 'date-fns';
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import {
	type Company,
	type Customer,
	type Invoice,
	type Product,
} from '@/types/raw-data';

export const insertCompanyAddress = async (
	db: PostgresJsDatabase<typeof relationalSchema>,
	company: Company,
) => {
	const insertedCompanyAddress = await db
		.insert(relationalSchema.addresses)
		.values({
			street: company.Address.Street,
			city: company.Address.City,
			postal_code: company.Address.PostalCode,
			country: company.Address.Country,
		})
		.onConflictDoNothing()
		.returning()
		.then((res) => res[0]);

	if (!insertedCompanyAddress)
		throw new Error('Failed to insert company address!');

	return insertedCompanyAddress;
};

export const insertCompany = async (
	db: PostgresJsDatabase<typeof relationalSchema>,
	company: Company,
	insertedCompanyAddress: typeof relationalSchema.addresses.$inferSelect,
) => {
	const insertedCompany = await db
		.insert(relationalSchema.companies)
		.values({
			name: company.Name,
			address_id: insertedCompanyAddress.id,
			fiscal_year: company.FiscalYear,
			start_date: parseISO(company.StartDate),
			end_date: parseISO(company.EndDate),
		})
		.onConflictDoNothing()
		.returning()
		.then((res) => res[0]);

	if (!insertedCompany) throw new Error('Failed to insert company!');

	return insertedCompany;
};

export const insertAddresses = async (
	db: PostgresJsDatabase<typeof relationalSchema>,
	customers: Customer[],
) => {
	const addressesSet = new Set<
		typeof relationalSchema.addresses.$inferInsert
	>(
		customers.map((customer) => ({
			street: customer.Address.Street,
			city: customer.Address.City,
			postal_code: customer.Address.PostalCode,
			country: customer.Address.Country,
		})),
	);

	const insertedAddresses = await db
		.insert(relationalSchema.addresses)
		.values([...addressesSet])
		.onConflictDoNothing()
		.returning();

	if (!insertedAddresses.length)
		throw new Error('Failed to insert addresses!');

	return insertedAddresses;
};

export const insertCustomers = async (
	db: PostgresJsDatabase<typeof relationalSchema>,
	customers: Customer[],
	insertedAddresses: (typeof relationalSchema.addresses.$inferSelect)[],
) => {
	const parsedCustomers: (typeof relationalSchema.customers.$inferInsert & {
		old_id: number;
	})[] = customers.map((customer) => {
		const address = insertedAddresses.find(
			(address) =>
				address.street === customer.Address.Street &&
				address.city === customer.Address.City,
		);

		if (!address) throw new Error('Customer address not found!');

		return {
			old_id: customer.Id,
			tax_id: customer.TaxId,
			name: customer.Name,
			email: customer.Email,
			telephone: customer.Telephone,
			address_id: address.id,
		};
	});

	const insertedCustomers = await db
		.insert(relationalSchema.customers)
		.values(parsedCustomers)
		.onConflictDoNothing()
		.returning();

	if (!insertedCustomers.length)
		throw new Error('Failed to insert customers!');

	return {
		parsedCustomers,
		insertedCustomers,
	};
};

export const insertProducts = async (
	db: PostgresJsDatabase<typeof relationalSchema>,
	products: Product[],
	company: typeof relationalSchema.companies.$inferSelect,
) => {
	const parsedProducts: (typeof relationalSchema.products.$inferInsert & {
		old_id: number;
	})[] = products
		.map((product) => {
			if (product.Id.toString().toUpperCase() === 'OUTROS') return null;

			return {
				old_id: product.Id,
				category: product.Category,
				name: product.Name,
				company_id: company.id,
			};
		})
		.filter((product) => product !== null);

	const insertedProducts = await db
		.insert(relationalSchema.products)
		.values(parsedProducts)
		.onConflictDoNothing()
		.returning();

	if (!insertedProducts) throw new Error('Failed to insert products!');

	return {
		parsedProducts,
		insertedProducts,
	};
};

export const insertInvoices = async (
	db: PostgresJsDatabase<typeof relationalSchema>,
	invoices: Invoice[],
	parsedCustomers: (typeof relationalSchema.customers.$inferInsert & {
		old_id: number;
	})[],
	insertedCustomers: (typeof relationalSchema.customers.$inferSelect)[],
	company: typeof relationalSchema.companies.$inferSelect,
) => {
	const parsedInvoices: (typeof relationalSchema.invoices.$inferInsert)[] = [
		...invoices
			.map((invoice) => {
				if (invoice.Status.toUpperCase() !== 'N') return null;

				const oldCustomer = parsedCustomers.find(
					(c) => c.old_id === invoice.CustomerId,
				);

				if (!oldCustomer) throw new Error('Old customer id not found!');

				const customer = insertedCustomers.find(
					(c) => c.email === oldCustomer.email,
				);

				if (!customer) throw new Error('Customer not found!');

				return {
					status: invoice.Status,
					hash: invoice.Hash,
					date: parseISO(invoice.Date),
					type: invoice.Type,
					tax_payable: invoice.TaxPayable,
					net_total: invoice.NetTotal,
					gross_total: invoice.GrossTotal,
					customer_id: customer.id,
					company_id: company.id,
				};
			})
			.filter((invoice) => invoice !== null),
	];

	const insertedInvoices = await db
		.insert(relationalSchema.invoices)
		.values(parsedInvoices)
		.onConflictDoNothing()
		.returning();

	if (!insertedInvoices) throw new Error('Failed to insert invoices!');

	return insertedInvoices;
};

export const insertLines = async (
	db: PostgresJsDatabase<typeof relationalSchema>,
	invoices: Invoice[],
	insertedInvoices: (typeof relationalSchema.invoices.$inferSelect)[],
	parsedProducts: (typeof relationalSchema.products.$inferInsert & {
		old_id: number;
	})[],
	insertedProducts: (typeof relationalSchema.products.$inferSelect)[],
) => {
	const parsedLines: (typeof relationalSchema.lines.$inferInsert)[] =
		invoices.flatMap((invoice) => {
			if (invoice.Status.toUpperCase() !== 'N') return [];

			return invoice.Line.map((line) => {
				const invoiceOfLine = insertedInvoices.find(
					(i) => i.hash === invoice.Hash,
				);
				if (!invoiceOfLine) throw new Error('Invoice id not found!');

				const oldProduct = parsedProducts.find(
					(p) => p.old_id === line.ProductId,
				);
				if (!oldProduct) throw new Error('Old product ID not found!');

				const product = insertedProducts.find(
					(p) =>
						p.name === oldProduct.name &&
						p.category === oldProduct.category,
				);
				if (!product) throw new Error('Product not found!');

				return {
					quantity: line.Quantity,
					unit_price: line.UnitPrice,
					net_total: line.NetTotal,
					tax_percentage: line.Tax.TaxPercentage,
					product_id: product.id,
					invoice_id: invoiceOfLine.id,
				};
			});
		});

	const insertedLines = await db
		.insert(relationalSchema.lines)
		.values(parsedLines)
		.onConflictDoNothing()
		.returning();

	if (!insertedLines) throw new Error('Failed to insert lines!');

	return insertedLines;
};
