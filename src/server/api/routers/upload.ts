import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import {
	address,
	company,
	companyDimension,
	customer,
	customerDimension,
	geoDimension,
	invoice,
	invoiceLine,
	product,
	productDimension,
	salesFact,
	timeDimension,
} from '@/server/db/schema';
import {
	add,
	getDate,
	getMonth,
	getQuarter,
	getWeek,
	getYear,
	parseISO,
	set,
} from 'date-fns';
import { XMLParser } from 'fast-xml-parser';
import { string, z } from 'zod';

import { type ParsedXML } from '@/types/file';
import { convertStringToXML, ensureArray } from '@/lib/utils';
import { Name } from 'drizzle-orm';
import { Address } from 'cluster';
import { hash } from 'crypto';
import { Hash } from 'lucide-react';

const getAdressID = (insertedAddress: {
    id: number;
    street: string;
    city: string;
    postal_code: string;
    country: string;
}[], street: string,
	city: string,
	postal_code: string,
	country: string) => {

		insertedAddress.forEach((address) => {
			if (address.street === street && address.city === city && address.postal_code === postal_code && address.country === country) {
				return address.id;
			}
		});
		throw new Error('Failed to get address!');
}

const getCustomerID = (insertedCustomers: {
    id: number;
    name: string;
    address_id: number;
    email: string;
    telephone: string;
	}[],
	name: string,
	address_id: number,
	email: string,
	telephone: string,) => {
		insertedCustomers.forEach((customer) => {
			if (customer.name === name && customer.address_id === address_id && customer.email === email && customer.telephone === telephone) {
				return customer.id;
			}
		});
		throw new Error('Failed to get address!');
}

const getProductID = (insertedProducts: {
    id: number;
    name: string;
    category: string;
    company_id: number;
	}[], name: string,
	category: string,
	company_id: number) => {
	insertedProducts.forEach((product) => {
		if (product.name === name && product.category === category && product.company_id === company_id) {
			return product.id;
		}
	});
	throw new Error('Failed to get address!');
}

const getInvoiceID = (insertedInvoices: {
    company_id: number,
    id: number,
    date: Date,
    hash: string,
    invoiceType: string,
    taxPayable: number,
    netTotal: number,
    grossTotal: number,
    customer_id: number | null,
    supplier_id: number | null,
}[],
	hash: string,
	company_id: number) => {
		insertedInvoices.forEach((invoice) => {
			if (invoice.hash === hash && invoice.company_id === company_id) {
				return invoice.id;
			}
	});
	throw new Error('Failed to get invoice!');
}


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

			const companyAdress = await ctx.db
				.insert(address)
				.values({
					city: Company.Address.City,
					country: Company.Address.Country,
					postal_code: Company.Address.PostalCode,
					street: Company.Address.Street,
				})
				.onConflictDoNothing()
				.returning()
				.then((res) => res[0]);

			if (!companyAdress) throw new Error('Failed to insert company address!');
			const insertedCompany = await ctx.db
				.insert(company)
				.values({
					name: Company.Name,
					address_id: companyAdress.id,
				})
				.onConflictDoNothing()
				.returning()
				.then((res) => res[0]);

			const addressMap = new Set<{street: string;
										city: string;
										postal_code: string;
										country: string}>();

			if (!insertedCompany) throw new Error('Failed to insert company!');
			Customers.Customer.map((customer) => {
				addressMap.add({
					street: customer.Address.Street,
					city: customer.Address.City,
					postal_code: customer.Address.PostalCode,
					country: customer.Address.Country,
				});
			});
			const insertedAddress = await ctx.db
				.insert(address)
				.values([...addressMap])
				.onConflictDoNothing()
				.returning();
			
			if (!insertedAddress) throw new Error('Failed to insert address!');
			const parsedCustomers = Customers.Customer.map((customer) => {
				return {
					old_id: customer.Id,
					name: customer.Name,
					email: customer.Email,
					telephone: customer.Telephone,
					address_id: getAdressID(insertedAddress, customer.Address.Street, customer.Address.City, customer.Address.PostalCode, customer.Address.Country),
				}
			});
			const insertedCustomers = await ctx.db
				.insert(customer)
				.values(parsedCustomers)
				.onConflictDoNothing()
				.returning();

				const parsedProducts = Products.Product.map((product) => ({
					old_id: product.Id,
					name: product.Name,
					category: product.Category,
					company_id: insertedCompany.id,
				}));

				const insertedProducts = await ctx.db
				.insert(product)
				.values(parsedProducts)
				.onConflictDoNothing()
				.returning();

				const parsedInvoices = Invoices.Invoice.map((invoice) => {
					const customerParsed = parsedCustomers.find(
						(c) => c.old_id === invoice.CustomerID,
					);
					if (!customerParsed) throw new Error('Old customer ID not found!');
					const customer = getCustomerID(insertedCustomers, customerParsed.name, customerParsed.address_id, customerParsed.email, customerParsed.telephone);		
					if (!customer) throw new Error('Old customer ID not found!');

					return {
						hash: invoice.Hash,
						invoiceType: 'Compra',
						date: parseISO(invoice.Date),
						taxPayable: invoice.TaxPayable,
						netTotal: invoice.NetTotal,
						grossTotal: invoice.GrossTotal,
						customer_id: customer,
						company_id: insertedCompany.id,
						supplier_id: null,
					};
				});

				const insertedInvoices = await ctx.db
				.insert(invoice)
				.values(parsedInvoices)
				.onConflictDoNothing()
				.returning();
				
				const parsedInvoicesLines = Invoices.Invoice.map((invoice) => {
					return invoice.Line.map((line) => {
						const invoiceParsed = parsedInvoices.find(
							(i) => i.hash === invoice.Hash,
						);
						if (!invoiceParsed) throw new Error('Old invoice ID not found!');
						const invoiceId = getInvoiceID(insertedInvoices, invoiceParsed.hash, invoiceParsed.company_id);		
						if (!invoiceId) throw new Error('Old customer ID not found!');
						
						const productParsed = parsedProducts.find(
							(p) => p.old_id === line.ProductID,
						);
						if (!productParsed) throw new Error('Old product ID not found!');
						const product = getProductID(insertedProducts, productParsed.name, productParsed.category, productParsed.company_id);		
						if (!product) throw new Error('Old customer ID not found!');

						return {
							quantity: line.Quantity,
							unitPrice: line.UnitPrice,
							amount: line.Amount,
							Tax: line.Tax,
							product_id: product,
							invoice_id: invoiceId,
						};
					});

					
				});

				await ctx.db
				.insert(invoiceLine)
				.values(parsedInvoicesLines.flat())
				.onConflictDoNothing()
				.returning();












			// const insertedCompany = await ctx.db
			// 	.insert(companyDimension)
			// 	.values({
			// 		name: Company.Name,
			// 		street: Company.Address.Street,
			// 		city: Company.Address.City,
			// 		postal_code: Company.Address.PostalCode,
			// 		country: Company.Address.Country,
			// 	})
			// 	.onConflictDoNothing()
			// 	.returning()
			// 	.then((res) => res[0]);

			// if (!insertedCompany) throw new Error('Failed to insert company!');

			// const parsedProducts = Products.Product.map((product) => ({
			// 	old_id: product.Id,
			// 	name: product.Name,
			// 	category: product.Category,
			// }));

			// const insertedProducts = await ctx.db
			// 	.insert(productDimension)
			// 	.values(parsedProducts)
			// 	.onConflictDoNothing()
			// 	.returning();

			// const parsedCustomers = Customers.Customer.map((customer) => ({
			// 	old_id: customer.Id,
			// 	name: customer.Name,
			// 	email: customer.Email,
			// 	telephone: customer.Telephone,
			// 	street: customer.Address.Street,
			// 	city: customer.Address.City,
			// 	postal_code: customer.Address.PostalCode,
			// 	country: customer.Address.Country,
			// }));

			// const insertedCustomers = await ctx.db
			// 	.insert(customerDimension)
			// 	.values(parsedCustomers)
			// 	.onConflictDoNothing()
			// 	.returning();

			// const storedGeo = await ctx.db.select().from(geoDimension);
			// const geoMap = new Map<string, { city: string; country: string }>(
			// 	storedGeo.map((g) => [`${g.city}_${g.country}`, g]),
			// );

			// parsedCustomers.forEach((customer) => {
			// 	const key = `${customer.city}_${customer.country}`;
			// 	if (!geoMap.has(key))
			// 		geoMap.set(key, {
			// 			city: customer.city,
			// 			country: customer.country,
			// 		});
			// });

			// const parsedGeo = [...geoMap.values()];
			// await ctx.db
			// 	.insert(geoDimension)
			// 	.values(parsedGeo)
			// 	.onConflictDoNothing();

			// const geoIdMap = new Map(
			// 	await ctx.db
			// 		.select()
			// 		.from(geoDimension)
			// 		.then((geo) =>
			// 			geo.map((g) => [`${g.city}_${g.country}`, g.id]),
			// 		),
			// );

			// const storedTime = await ctx.db.select().from(timeDimension);
			// const timeMap = new Map<string, Date>(
			// 	storedTime.map((t) => [t.date.toISOString(), t.date]),
			// );

			// Invoices.Invoice.forEach((invoice) => {
			// 	const date = parseISO(invoice.Date);
			// 	const key = date.toISOString();
			// 	if (!timeMap.has(key)) timeMap.set(key, date);
			// });

			// const parsedTime = [...timeMap.values()].map((date) => ({
			// 	date: date,
			// 	year: getYear(date),
			// 	month: getMonth(date) + 1,
			// 	day: getDate(date),
			// 	day_of_week: date.getDay(),
			// 	week: getWeek(date),
			// 	quarter: getQuarter(date),
			// }));

			// await ctx.db
			// 	.insert(timeDimension)
			// 	.values(parsedTime)
			// 	.onConflictDoNothing();

			// const timeIdMap = new Map(
			// 	await ctx.db
			// 		.select()
			// 		.from(timeDimension)
			// 		.then((times) =>
			// 			times.map((t) => [t.date.toISOString(), t.id]),
			// 		),
			// );

			// const parsedSales = Invoices.Invoice.flatMap((invoice) => {
			// 	const timeId = timeIdMap.get(
			// 		parseISO(invoice.Date).toISOString(),
			// 	);
			// 	if (!timeId) throw new Error('Time ID not found!');

			// 	const oldCustomer = parsedCustomers.find(
			// 		(c) => c.old_id === invoice.CustomerID,
			// 	);
			// 	if (!oldCustomer) throw new Error('Old customer ID not found!');

			// 	const customer = insertedCustomers.find(
			// 		(c) => c.email === oldCustomer.email,
			// 	);
			// 	if (!customer) throw new Error('Customer not found!');

			// 	const geoKey = `${customer.city}_${customer.country}`;
			// 	const geoId = geoIdMap.get(geoKey);
			// 	if (!geoId) throw new Error('Geo ID not found!');

			// 	const lines = ensureArray(invoice.Line);

			// 	return lines.map((line) => {
			// 		const oldProduct = parsedProducts.find(
			// 			(p) => p.old_id === line.ProductID,
			// 		);
			// 		if (!oldProduct)
			// 			throw new Error('Old product ID not found!');

			// 		const product = insertedProducts.find(
			// 			(p) => p.name === oldProduct.name,
			// 		);
			// 		if (!product) throw new Error('Product not found!');

			// 		return {
			// 			tax_payable: invoice.TaxPayable,
			// 			net_total: invoice.NetTotal,
			// 			gross_total: invoice.GrossTotal,
			// 			company_id: insertedCompany.id,
			// 			product_id: product.id,
			// 			customer_id: customer.id,
			// 			geo_id: geoId,
			// 			time_id: timeId,
			// 		};
			// 	});
			// });

			// await ctx.db
			// 	.insert(salesFact)
			// 	.values(parsedSales)
			// 	.onConflictDoNothing();
		}),
});
