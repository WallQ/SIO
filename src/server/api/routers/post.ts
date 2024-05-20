import { Customer, Geo, Product, sales, Sales } from '@/data/database';
import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from '@/server/api/trpc';
import {
	companyDimension,
	customerDimension,
	customerDimensionRelations,
	geoDimension,
	productDimension,
	salesFact,
	timeDimension,
} from '@/server/db/schema';
import { parseString } from 'xml2js';
import { z } from 'zod';

import { convertStringToXML } from '@/lib/utils';
import { set } from 'date-fns';
import { Invoice } from '@/types/invoice';
import { time } from 'console';
import { Time } from '@/types/time';

interface TOCOnline {
	Company: {
		CompanyID: string;
		CompanyName: string;
		CompanyAddress: {
			AddressDetail: string;
			City: string;
			PostalCode: string;
			Country: string;
		};
		FiscalYear: number;
		StartDate: string;
		EndDate: string;
	};
	Customers?: {
		Customer: {
			CustomerID: string;
			CompanyName: string;
			BillingAddress: {
				AddressDetail: string;
				City: string;
				PostalCode: string;
				Country: string;
			};
			Telephone: string;
			Email: string;
		}[];
	};
	Products?: {
		Product: {
			ProductID: string;
			ProductCategory: string;
			ProductName: string;
		}[];
	};
	Invoices?: {
		Invoice: {
			Hash: string;
			CustomerID: string;
			InvoiceDate: string;
			TaxPayable: number;
			NetTotal: number;
			GrossTotal: number;
			Line: {
				ProductID: string;
				ProductName: string;
				Quantity: number;
				UnitPrice: number;
				Amount: number;
			Tax:{
				TaxPercentage: number,
				}
			}[];
		}[];
	};
}

// Function to get the week number of the year
function getWeekNumber(date: Date): number {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const millisecondsInDay = 86400000;
    return Math.ceil(((date.getTime() - oneJan.getTime()) / millisecondsInDay + oneJan.getDay() + 1) / 7);
}

// Function to get the quarter of the year
function getQuarter(date: Date): number {
    return Math.floor((date.getMonth() + 3) / 3);
}

export const postRouter = createTRPCRouter({
	file: publicProcedure
		.input(z.object({ file: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const xml = convertStringToXML(input.file);

			parseString(xml, (err, result: TOCOnline) => {
				if (err) {
					console.error('Error parsing XML:', err);
					return null;
				}

				const handleCompany = async () => {
					const company = result.Company;
					await ctx.db.insert(companyDimension).values({
						name: company.CompanyName,
						street: company.CompanyAddress.AddressDetail,
						city: company.CompanyAddress.City,
						zip: company.CompanyAddress.PostalCode,
						country: company.CompanyAddress.Country,
					});

					const customers: Customer[] = [];
					const geos = new Set<Geo>();

					result.Customers?.Customer.map((customer, index) => {
						geos.add(
							{
								city: customer.BillingAddress.City,
								country: customer.BillingAddress.Country,
							} as Geo);

						customers[index] = {
							name: customer.CompanyName,
							email: customer.Email,
							phone: customer.Telephone,
							street: customer.BillingAddress.AddressDetail,
							city: customer.BillingAddress.City,
							zip: customer.BillingAddress.PostalCode,
							country: customer.BillingAddress.Country,
						} as Customer;
					});

					await ctx.db.insert(customerDimension).values(customers);
					await ctx.db.insert(geoDimension).values([...geos]);

					const products: Product[] = [];
					result.Products?.Product.map((product, index) => {
						products[index] = {
							name: product.ProductName,
							category: product.ProductCategory,
						} as Product;
					});

					await ctx.db.insert(productDimension).values(products);

					let times = new Set<Time>();
					result.Invoices?.Invoice.map((invoice, index) => {
						invoice.Line.map((line, index2) => {
							times.add(
								{
									date: new Date(invoice.InvoiceDate),
									year: new Date(invoice.InvoiceDate).getFullYear(),
									month: new Date(invoice.InvoiceDate).getMonth() + 1, // Adding 1 because getMonth() returns zero-based index
									day: new Date(invoice.InvoiceDate).getDate(),
									week: getWeekNumber(new Date(invoice.InvoiceDate)),
									quarter: getQuarter(new Date(invoice.InvoiceDate))
								} as Time);
						});
					});

					await ctx.db.insert(timeDimension).values([...times]);

					const timesFromDb = await ctx.db.select().from(timeDimension);
					const geosFromDb = await ctx.db.select().from(geoDimension);
					const customersFromDb = await ctx.db.select().from(customerDimension);

					const salesFacts: Sales[] = [];
					result.Invoices?.Invoice.map((invoice, index) => {
						invoice.Line.map((line, index2) => {
							const timeIndex = timesFromDb.findIndex(time =>
								time.date == new Date(invoice.InvoiceDate) &&
								time.year == new Date(invoice.InvoiceDate).getFullYear() &&
								time.month == new Date(invoice.InvoiceDate).getMonth() + 1 &&
								time.day == new Date(invoice.InvoiceDate).getDate() && 
								time.week == getWeekNumber(new Date(invoice.InvoiceDate)) &&
								time.quarter == getQuarter(new Date(invoice.InvoiceDate))
							);

							const customerIndex = customersFromDb.findIndex(customer =>
								customer.id == invoice.CustomerID
							);

							const geoIndex = geosFromDb.findIndex(geo =>
								geo.city == customersFromDb[customerIndex]?.city &&
								geo.country == customersFromDb[customerIndex]?.country
							);

							const salesFactIndex = salesFacts.findIndex(sale =>
								sale.company_id === company.CompanyID.toString() &&
								sale.product_id === line.ProductID.toString() &&
								sale.customer_id === invoice.CustomerID.toString() &&
								sale.geo_id === geosFromDb[geoIndex]?.id &&
								sale.time_id === timesFromDb[timeIndex]?.id
							);

							if (salesFactIndex > -1) {
								salesFacts?[salesFactIndex].tax_payable += (line.Amount * line.Tax.TaxPercentage);
                                salesFacts?[salesFactIndex].net_total += line.Amount;
                                salesFacts?[salesFactIndex].gross_total += (line.Amount + (line.Amount * line.Tax.TaxPercentage));
                            } else {
                                salesFacts.push({
                                    company_id: company.CompanyID,
                                    product_id: line.ProductID,
                                    customer_id: invoice.CustomerID,
                                    tax_payable: (line.Amount * line.Tax.TaxPercentage),
                                    net_total: line.Amount,
                                    gross_total: (line.Amount + (line.Amount * line.Tax.TaxPercentage)),
                                    geo_id: geosFromDb[geoIndex]?.id ,
                                    time_id: timesFromDb[timeIndex]?.id,
                                } as Sales);
                            }
						});
					});

					await ctx.db.insert(salesFact).values(salesFacts);
				};
			});

			await handleCompany();
		}),

	hello: publicProcedure
		.input(z.object({ text: z.string() }))
		.query(({ input }) => {
			return {
				greeting: `Hello ${input.text}`,
			};
		}),

	getSecretMessage: protectedProcedure.query(() => {
		return 'you can now see this secret message!';
	}),
});
