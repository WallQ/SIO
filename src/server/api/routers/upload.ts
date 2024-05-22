import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import {
	companyDimension,
	customerDimension,
	geoDimension,
	productDimension,
	salesFact,
	timeDimension,
} from '@/server/db/schema';
import {
	getDate,
	getMonth,
	getQuarter,
	getWeek,
	getYear,
	parseISO,
} from 'date-fns';
import { XMLParser } from 'fast-xml-parser';
import { z } from 'zod';

import { type ParsedXML } from '@/types/file';
import { convertStringToXML, ensureArray } from '@/lib/utils';

export const uploadRouter = createTRPCRouter({
	file: protectedProcedure
		.input(z.object({ file: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const xml = convertStringToXML(input.file);
			const parser = new XMLParser();
			const result = parser.parse(xml) as ParsedXML;

			const { Company, Customers, Products, Invoices } = result.TOCOnline;
			if (!Company || !Customers || !Products || !Invoices)
				throw new Error('Invalid XML file');

			const insertedCompany = await ctx.db
				.insert(companyDimension)
				.values({
					name: Company.Name,
					street: Company.Address.Street,
					city: Company.Address.City,
					postal_code: Company.Address.PostalCode,
					country: Company.Address.Country,
				})
				.onConflictDoNothing()
				.returning()
				.then((res) => res[0]);

			if (!insertedCompany) throw new Error('Failed to insert company!');

			const parsedProducts = Products.Product.map((product) => ({
				old_id: product.Id,
				name: product.Name,
				category: product.Category,
			}));

			const insertedProducts = await ctx.db
				.insert(productDimension)
				.values(parsedProducts)
				.onConflictDoNothing()
				.returning();

			const parsedCustomers = Customers.Customer.map((customer) => ({
				old_id: customer.Id,
				name: customer.Name,
				email: customer.Email,
				telephone: customer.Telephone,
				street: customer.Address.Street,
				city: customer.Address.City,
				postal_code: customer.Address.PostalCode,
				country: customer.Address.Country,
			}));

			const insertedCustomers = await ctx.db
				.insert(customerDimension)
				.values(parsedCustomers)
				.onConflictDoNothing()
				.returning();

			const storedGeo = await ctx.db.select().from(geoDimension);
			const geoMap = new Map<string, { city: string; country: string }>(
				storedGeo.map((g) => [`${g.city}_${g.country}`, g]),
			);

			parsedCustomers.forEach((customer) => {
				const key = `${customer.city}_${customer.country}`;
				if (!geoMap.has(key))
					geoMap.set(key, {
						city: customer.city,
						country: customer.country,
					});
			});

			const parsedGeo = [...geoMap.values()];
			await ctx.db
				.insert(geoDimension)
				.values(parsedGeo)
				.onConflictDoNothing();

			const geoIdMap = new Map(
				await ctx.db
					.select()
					.from(geoDimension)
					.then((geo) =>
						geo.map((g) => [`${g.city}_${g.country}`, g.id]),
					),
			);

			const storedTime = await ctx.db.select().from(timeDimension);
			const timeMap = new Map<string, Date>(
				storedTime.map((t) => [t.date.toISOString(), t.date]),
			);

			Invoices.Invoice.forEach((invoice) => {
				const date = parseISO(invoice.Date);
				const key = date.toISOString();
				if (!timeMap.has(key)) timeMap.set(key, date);
			});

			const parsedTime = [...timeMap.values()].map((date) => ({
				date: date,
				year: getYear(date),
				month: getMonth(date) + 1,
				day: getDate(date),
				day_of_week: date.getDay(),
				week: getWeek(date),
				quarter: getQuarter(date),
			}));

			await ctx.db
				.insert(timeDimension)
				.values(parsedTime)
				.onConflictDoNothing();

			const timeIdMap = new Map(
				await ctx.db
					.select()
					.from(timeDimension)
					.then((times) =>
						times.map((t) => [t.date.toISOString(), t.id]),
					),
			);

			const parsedSales = Invoices.Invoice.flatMap((invoice) => {
				const timeId = timeIdMap.get(
					parseISO(invoice.Date).toISOString(),
				);
				if (!timeId) throw new Error('Time ID not found!');

				const oldCustomer = parsedCustomers.find(
					(c) => c.old_id === invoice.CustomerID,
				);
				if (!oldCustomer) throw new Error('Old customer ID not found!');

				const customer = insertedCustomers.find(
					(c) => c.email === oldCustomer.email,
				);
				if (!customer) throw new Error('Customer not found!');

				const geoKey = `${customer.city}_${customer.country}`;
				const geoId = geoIdMap.get(geoKey);
				if (!geoId) throw new Error('Geo ID not found!');

				const lines = ensureArray(invoice.Line);

				return lines.map((line) => {
					const oldProduct = parsedProducts.find(
						(p) => p.old_id === line.ProductID,
					);
					if (!oldProduct)
						throw new Error('Old product ID not found!');

					const product = insertedProducts.find(
						(p) => p.name === oldProduct.name,
					);
					if (!product) throw new Error('Product not found!');

					return {
						tax_payable: invoice.TaxPayable,
						net_total: invoice.NetTotal,
						gross_total: invoice.GrossTotal,
						company_id: insertedCompany.id,
						product_id: product.id,
						customer_id: customer.id,
						geo_id: geoId,
						time_id: timeId,
					};
				});
			});

			await ctx.db
				.insert(salesFact)
				.values(parsedSales)
				.onConflictDoNothing();
		}),
});
