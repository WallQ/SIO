import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import {
	addresses,
	companies,
	customers,
	invoices,
	lines,
	products,
} from '@/server/db/relational-schema';
import {
	companyDimension,
	customerDimension,
	geoDimension,
	productDimension,
	salesFact,
	timeDimension,
} from '@/server/db/star-schema';
import {
	formatISO,
	getDate,
	getDay,
	getMonth,
	getQuarter,
	getWeek,
	getYear,
	parseISO,
} from 'date-fns';
import { eq, sql } from 'drizzle-orm';
import { XMLParser } from 'fast-xml-parser';
import { z } from 'zod';

import { type SAFT } from '@/types/saft';
import { convertStringToXML, transformXML } from '@/lib/utils';

export const uploadRouter = createTRPCRouter({
	file: protectedProcedure
		.input(z.object({ file: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const xml = convertStringToXML(input.file);

			const parser = new XMLParser();
			const result = parser.parse(xml) as SAFT;
			if (!result) throw new Error('Invalid XML file!');

			const { Company, Customers, Invoices, Products } =
				transformXML(result).TOCOnline;
			if (!Company || !Customers || !Invoices || !Products)
				throw new Error('Invalid XML file!');

			const insertedCompanyAddress = await ctx.db.relational
				.insert(addresses)
				.values({
					street: Company.Address.Street,
					city: Company.Address.City,
					postal_code: Company.Address.PostalCode,
					country: Company.Address.Country,
				})
				.onConflictDoNothing()
				.returning()
				.then((res) => res[0]);
			if (!insertedCompanyAddress)
				throw new Error('Failed to insert company address!');

			const insertedCompany = await ctx.db.relational
				.insert(companies)
				.values({
					name: Company.Name,
					address_id: insertedCompanyAddress.id,
					fiscal_year: Company.FiscalYear,
					start_date: parseISO(Company.StartDate),
					end_date: parseISO(Company.EndDate),
				})
				.onConflictDoNothing()
				.returning()
				.then((res) => res[0]);
			if (!insertedCompany) throw new Error('Failed to insert company!');

			const addressesSet = new Set<typeof addresses.$inferInsert>();
			Customers.forEach((customer) => {
				addressesSet.add({
					street: customer.Address.Street,
					city: customer.Address.City,
					postal_code: customer.Address.PostalCode,
					country: customer.Address.Country,
				});
			});
			const insertedAddresses = await ctx.db.relational
				.insert(addresses)
				.values([...addressesSet])
				.onConflictDoNothing()
				.returning();
			if (!insertedAddresses)
				throw new Error('Failed to insert addresses!');

			const parsedCustomers: (typeof customers.$inferInsert & {
				old_id: number;
			})[] = [
				...Customers.map((customer) => {
					const address = insertedAddresses.find(
						(a) =>
							a.street === customer.Address.Street &&
							a.city === customer.Address.City,
					);
					if (!address)
						throw new Error('Customer address not found!');
					return {
						old_id: customer.Id,
						name: customer.Name,
						tax_id: customer.TaxId,
						address_id: address.id,
						telephone: customer.Telephone,
						email: customer.Email,
					};
				}),
			];
			const insertedCustomers = await ctx.db.relational
				.insert(customers)
				.values(parsedCustomers)
				.onConflictDoNothing()
				.returning();
			if (!insertedCustomers)
				throw new Error('Failed to insert customers!');

			const parsedProducts: (typeof products.$inferInsert & {
				old_id: number;
			})[] = [
				...Products.map((product) => {
					if (product.Id.toString().toUpperCase() === 'OUTROS')
						return null;

					return {
						old_id: product.Id,
						category: product.Category,
						name: product.Name,
						company_id: insertedCompany.id,
					};
				}).filter((product) => product !== null),
			];
			const insertedProducts = await ctx.db.relational
				.insert(products)
				.values(parsedProducts)
				.onConflictDoNothing()
				.returning();
			if (!insertedProducts)
				throw new Error('Failed to insert products!');

			const parsedInvoices: (typeof invoices.$inferInsert)[] = [
				...Invoices.map((invoice) => {
					if (invoice.Status.toUpperCase() === 'A') return null;

					const oldCustomer = parsedCustomers.find(
						(c) => c.old_id === invoice.CustomerId,
					);
					if (!oldCustomer)
						throw new Error('Old customer id not found!');

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
						company_id: insertedCompany.id,
					};
				}).filter((invoice) => invoice !== null),
			];
			const insertedInvoices = await ctx.db.relational
				.insert(invoices)
				.values(parsedInvoices)
				.onConflictDoNothing()
				.returning();
			if (!insertedInvoices)
				throw new Error('Failed to insert invoices!');

			const parsedLines: (typeof lines.$inferInsert)[] = Invoices.flatMap(
				(invoice) => {
					if (invoice.Status.toUpperCase() === 'A') return [];

					return invoice.Line.map((line) => {
						const invoiceOfLine = insertedInvoices.find(
							(i) => i.hash === invoice.Hash,
						);
						if (!invoiceOfLine)
							throw new Error('Invoice id not found!');

						const oldProduct = parsedProducts.find(
							(p) => p.old_id === line.ProductId,
						);
						if (!oldProduct)
							throw new Error('Old product ID not found!');

						const product = insertedProducts.find(
							(p) =>
								p.name === oldProduct.name &&
								p.category === oldProduct.category,
						);
						if (!product) throw new Error('Product not found!');

						return {
							quantity: line.Quantity,
							unit_price: line.UnitPrice,
							amount: line.Amount,
							tax_percentage: line.Tax.TaxPercentage,
							product_id: product.id,
							invoice_id: invoiceOfLine.id,
						};
					});
				},
			);

			await ctx.db.relational
				.insert(lines)
				.values(parsedLines)
				.onConflictDoNothing();

			const selectedCompany: (typeof companies.$inferSelect & {
				address: typeof addresses.$inferSelect;
			})[] = await ctx.db.relational
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

			await ctx.db.star.delete(salesFact);

			const parsedCompaniesDim: (typeof companyDimension.$inferInsert)[] =
				selectedCompany.map((company) => ({
					id: company.id,
					name: company.name,
					street: company.address.street,
					city: company.address.city,
					postal_code: company.address.postal_code,
					country: company.address.country,
				}));

			await ctx.db.star
				.insert(companyDimension)
				.values(parsedCompaniesDim)
				.onConflictDoNothing();

			const selectedProducts: (typeof products.$inferSelect)[] =
				await ctx.db.relational.select().from(products);

			const parsedProductsDim: (typeof productDimension.$inferInsert)[] =
				selectedProducts.map((product) => ({
					id: product.id,
					name: product.name,
					category: product.category,
				}));

			await ctx.db.star
				.insert(productDimension)
				.values(parsedProductsDim)
				.onConflictDoNothing();

			const selectedCustomers: (typeof customers.$inferSelect & {
				address: typeof addresses.$inferSelect;
			})[] = await ctx.db.relational
				.select({
					id: customers.id,
					name: customers.name,
					address_id: customers.address_id,
					email: customers.email,
					telephone: customers.telephone,
					tax_id: customers.tax_id,
					address: addresses,
				})
				.from(customers)
				.innerJoin(addresses, eq(customers.address_id, addresses.id));

			const parsedCustomersDim: (typeof customerDimension.$inferInsert)[] =
				selectedCustomers.map((customer) => ({
					id: customer.id,
					name: customer.name,
					street: customer.address.street,
					email: customer.email,
					city: customer.address.city,
					postal_code: customer.address.postal_code,
					country: customer.address.country,
				}));

			await ctx.db.star
				.insert(customerDimension)
				.values(parsedCustomersDim)
				.onConflictDoNothing();

			const selectedGeo: (typeof geoDimension.$inferSelect)[] =
				await ctx.db.star.select().from(geoDimension);

			const parsedGeoDim = new Set<typeof geoDimension.$inferInsert>([
				...selectedGeo,
			]);

			parsedCustomersDim.forEach((customer) => {
				parsedGeoDim.add({
					city: customer.city,
					country: customer.country,
				});
			});

			const insertedGeoDim = await ctx.db.star
				.insert(geoDimension)
				.values([...parsedGeoDim])
				.onConflictDoNothing()
				.returning();

			const selectedTime: (typeof timeDimension.$inferSelect)[] =
				await ctx.db.star.select().from(timeDimension);

			const parsedTimeDim = new Set<typeof timeDimension.$inferInsert>([
				...selectedTime,
			]);

			const selectedInvoices: (typeof invoices.$inferSelect & {
				company: typeof companies.$inferSelect;
				customer: typeof customers.$inferSelect;
			})[] = await ctx.db.relational
				.select({
					id: invoices.id,
					status: invoices.status,
					hash: invoices.hash,
					date: invoices.date,
					type: invoices.type,
					tax_payable: invoices.tax_payable,
					net_total: invoices.net_total,
					gross_total: invoices.gross_total,
					company_id: invoices.company_id,
					customer_id: invoices.customer_id,
					company: companies,
					customer: customers,
				})
				.from(invoices)
				.innerJoin(companies, eq(invoices.company_id, companies.id))
				.innerJoin(customers, eq(invoices.customer_id, customers.id));

			selectedInvoices.forEach((invoice) => {
				parsedTimeDim.add({
					date: invoice.date,
					year: getYear(invoice.date),
					month: getMonth(invoice.date) + 1,
					day: getDate(invoice.date),
					day_of_week: getDay(invoice.date),
					week: getWeek(invoice.date),
					quarter: getQuarter(invoice.date),
				});
			});

			const insertedTimeDim = await ctx.db.star
				.insert(timeDimension)
				.values([...parsedTimeDim])
				.onConflictDoNothing()
				.returning();

			const selectedSales = await ctx.db.relational
				.select({
					company_id: companies.id,
					product_id: products.id,
					customer_id: customers.id,
					date: invoices.date,
					city: addresses.city,
					country: addresses.country,
					tax_payable:
						sql<number>`SUM(${lines.amount} * (${lines.tax_percentage} * 0.01))`.as(
							'tax_payable',
						),
					net_total: sql<number>`SUM(${lines.amount})`.as(
						'net_total',
					),
					gross_total:
						sql<number>`SUM(${lines.amount} + (${lines.amount} * (${lines.tax_percentage} * 0.01)))`.as(
							'gross_total',
						),
					quantity: sql<number>`SUM(${lines.quantity})`.as(
						'quantity',
					),
				})
				.from(invoices)
				.innerJoin(lines, eq(lines.invoice_id, invoices.id))
				.innerJoin(products, eq(products.id, lines.product_id))
				.innerJoin(companies, eq(companies.id, invoices.company_id))
				.innerJoin(customers, eq(customers.id, invoices.customer_id))
				.innerJoin(addresses, eq(addresses.id, customers.address_id))
				.groupBy(
					companies.id,
					products.id,
					customers.id,
					invoices.date,
					addresses.city,
					addresses.country,
				);

			const parsedSalesDim: (typeof salesFact.$inferInsert)[] = [
				...selectedSales.map((sale) => {
					const geo = insertedGeoDim.find(
						(g) =>
							g.city === sale.city && g.country === sale.country,
					);
					if (!geo) throw new Error('Geo id not found!');

					const time = insertedTimeDim.find(
						(t) => formatISO(t.date) === formatISO(sale.date),
					);
					if (!time) throw new Error('Time id not found!');

					return {
						tax_payable: sale.tax_payable,
						net_total: sale.net_total,
						gross_total: sale.gross_total,
						quantity: sale.quantity,
						geo_id: geo.id,
						time_id: time.id,
						company_id: sale.company_id,
						product_id: sale.product_id,
						customer_id: sale.customer_id,
					};
				}),
			];

			await ctx.db.star
				.insert(salesFact)
				.values(parsedSalesDim)
				.onConflictDoNothing()
				.returning();
		}),
});
