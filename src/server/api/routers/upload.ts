import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import {
	addresses,
	companies,
	customers,
	invoices,
	lines,
	products,
} from '@/server/db/relational-schema';
import { parseISO } from 'date-fns';
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
							a.city === customer.Address.City &&
							a.postal_code === customer.Address.PostalCode &&
							a.country === customer.Address.Country,
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
				...Products.map((product) => ({
					old_id: product.Id,
					category: product.Category,
					name: product.Name,
					company_id: insertedCompany.id,
				})),
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
					const oldCustomer = parsedCustomers.find(
						(c) => c.old_id === invoice.CustomerId,
					);
					if (!oldCustomer)
						throw new Error('Old customer id not found!');

					const customer = insertedCustomers.find(
						(c) =>
							c.address_id === oldCustomer.address_id &&
							c.email === oldCustomer.email &&
							c.name === oldCustomer.name &&
							c.tax_id === oldCustomer.tax_id &&
							c.telephone === oldCustomer.telephone,
					);
					if (!customer) throw new Error('Customer not found!');

					return {
						status: `${invoice.Status.InvoiceStatus} - ${invoice.Status.SourceBilling}`,
						hash: invoice.Hash,
						date: parseISO(invoice.Date),
						type: invoice.Type,
						tax_payable: invoice.TaxPayable,
						net_total: invoice.NetTotal,
						gross_total: invoice.GrossTotal,
						customer_id: customer.id,
						company_id: insertedCompany.id,
						supplier_id: null,
					};
				}),
			];
			const insertedInvoices = await ctx.db.relational
				.insert(invoices)
				.values(parsedInvoices)
				.onConflictDoNothing()
				.returning();
			if (!insertedInvoices)
				throw new Error('Failed to insert invoices!');

			const parsedLines: (typeof lines.$inferInsert)[] = [
				...Invoices.flatMap((invoice) =>
					invoice.Line.map((line) => {
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
								p.category === oldProduct.category &&
								p.company_id === oldProduct.company_id,
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
					}),
				),
			];

			await ctx.db.relational
				.insert(lines)
				.values(parsedLines)
				.onConflictDoNothing();
		}),
});
