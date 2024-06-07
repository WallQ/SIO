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
import { XMLParser } from 'fast-xml-parser';
import { z } from 'zod';

import { type SAFT } from '@/types/saft';
import { analitycs } from '@/lib/analytics';
import {
	insertAddresses,
	insertCompany,
	insertCompanyAddress,
	insertCustomers,
	insertInvoices,
	insertLines,
	insertProducts,
} from '@/lib/first-etl';
import {
	insertCompaniesDim,
	insertCustomersDim,
	insertGeoDim,
	insertProductsDim,
	insertTimeDim,
} from '@/lib/second-etl';
import { convertBase64ToString, parseXMLtoObject } from '@/lib/utils';

export const uploadRouter = createTRPCRouter({
	data: protectedProcedure
		.input(z.object({ data: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const result = convertBase64ToString(input.data);
			if (!result) throw new Error('Failed to convert base64 to string!');

			const parser = new XMLParser();
			const xml = parser.parse(result) as SAFT;
			if (!xml) throw new Error('Failed to parse XML!');

			const data = parseXMLtoObject(xml);
			if (!data) throw new Error('Invalid XML structure!');

			const { Company, Customers, Invoices, Products } = data;
			if (!Company || !Customers || !Invoices || !Products)
				throw new Error('Invalid raw data!');

			const insertedCompanyAddress = await insertCompanyAddress(
				ctx.db.relational,
				Company,
			);

			const insertedCompany = await insertCompany(
				ctx.db.relational,
				Company,
				insertedCompanyAddress,
			);

			const insertedAddresses = await insertAddresses(
				ctx.db.relational,
				Customers,
			);

			const { insertedCustomers, parsedCustomers } =
				await insertCustomers(
					ctx.db.relational,
					Customers,
					insertedAddresses,
					insertedCompany,
				);

			const { insertedProducts, parsedProducts } = await insertProducts(
				ctx.db.relational,
				Products,
				insertedCompany,
			);

			const insertedInvoices = await insertInvoices(
				ctx.db.relational,
				Invoices,
				parsedCustomers,
				insertedCustomers,
				insertedCompany,
			);

			await insertLines(
				ctx.db.relational,
				Invoices,
				insertedInvoices,
				parsedProducts,
				insertedProducts,
			);

			await Promise.allSettled([
				void ctx.db.star.delete(companyDimension),
				void ctx.db.star.delete(productDimension),
				void ctx.db.star.delete(customerDimension),
				void ctx.db.star.delete(geoDimension),
				void ctx.db.star.delete(timeDimension),
				void ctx.db.star.delete(salesFact),
			])
				.then((res) => {
					for (const { status } of res) {
						if (status === 'rejected') {
							throw new Error(
								'Failed to delete star-schema table!',
							);
						} else {
							console.log('Star-schema table deleted!');
						}
					}
				})
				.catch((err) => {
					console.error("Something wen't wrong!", err);
				});

			await insertCompaniesDim(ctx.db.relational, ctx.db.star);

			await insertProductsDim(ctx.db.relational, ctx.db.star);

			await insertCustomersDim(ctx.db.relational, ctx.db.star);

			await insertGeoDim(ctx.db.relational, ctx.db.star);

			await insertTimeDim(ctx.db.relational, ctx.db.star);

			await analitycs(ctx.db.relational, ctx.db.star);
		}),
});
