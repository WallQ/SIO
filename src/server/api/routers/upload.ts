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

			await ctx.db
				.insert(companyDimension)
				.values({
					id: Company.Id,
					name: Company.Name,
					street: Company.Address.Street,
					city: Company.Address.City,
					postal_code: Company.Address.PostalCode,
					country: Company.Address.Country,
				})
				.onConflictDoNothing();

			const parsedProducts = Products.Product.map((product) => ({
				id: product.Id,
				name: product.Name,
				category: product.Category,
			}));

			await ctx.db
				.insert(productDimension)
				.values(parsedProducts)
				.onConflictDoNothing();

			const parsedCustomers = Customers.Customer.map((customer) => ({
				id: customer.Id,
				name: customer.Name,
				email: customer.Email,
				telephone: customer.Telephone,
				street: customer.Address.Street,
				city: customer.Address.City,
				postal_code: customer.Address.PostalCode,
				country: customer.Address.Country,
			}));

			await ctx.db
				.insert(customerDimension)
				.values(parsedCustomers)
				.onConflictDoNothing();

			const geoMap = new Map<string, { city: string; country: string }>();
			parsedCustomers.forEach((customer) => {
				const key = `${customer.city}_${customer.country}`;
				if (!geoMap.has(key))
					geoMap.set(key, {
						city: customer.city,
						country: customer.country,
					});
			});

			const parsedGeo = [...geoMap.values()];

			const insertedGeo = await ctx.db
				.insert(geoDimension)
				.values(parsedGeo)
				.onConflictDoNothing()
				.returning();

			const geoIdMap = new Map(
				insertedGeo.map((g) => [`${g.city}_${g.country}`, g.id]),
			);

			const parsedTime = [
				...new Set(
					Invoices.Invoice.map((invoice) => {
						const date = parseISO(invoice.Date);
						return {
							date: date,
							year: getYear(date),
							month: getMonth(date) + 1,
							day: getDate(date),
							week: getWeek(date),
							quarter: getQuarter(date),
						};
					}),
				),
			];

			const insertedTime = await ctx.db
				.insert(timeDimension)
				.values(parsedTime)
				.onConflictDoNothing()
				.returning();

			const timeIdMap = new Map(
				insertedTime.map((t) => [t.date.toISOString(), t.id]),
			);

			const parsedSales = Invoices.Invoice.flatMap((invoice) => {
				const timeId = timeIdMap.get(
					parseISO(invoice.Date).toISOString(),
				);
				if (!timeId) throw new Error('Time ID not found');

				const customer = parsedCustomers.find(
					(c) => c.id === invoice.CustomerID,
				);
				if (!customer) throw new Error('Customer not found');

				const geoKey = `${customer.city}_${customer.country}`;
				const geoId = geoIdMap.get(geoKey);
				if (!geoId) throw new Error('Geo ID not found');

				const lines = ensureArray(invoice.Line);

				return lines.map((line) => ({
					tax_payable: invoice.TaxPayable,
					net_total: invoice.NetTotal,
					gross_total: invoice.GrossTotal,
					company_id: Company.Id,
					product_id: line.ProductID,
					customer_id: invoice.CustomerID,
					geo_id: geoId,
					time_id: timeId,
				}));
			});

			await ctx.db
				.insert(salesFact)
				.values(parsedSales)
				.onConflictDoNothing();
		}),
});
