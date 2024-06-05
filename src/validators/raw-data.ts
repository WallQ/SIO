import { z } from 'zod';

export const addressSchema = z.object({
	Street: z.string(),
	City: z.string(),
	PostalCode: z.string(),
	Country: z.string(),
});

export const companySchema = z.object({
	Id: z.number(),
	Name: z.string(),
	Address: addressSchema,
	FiscalYear: z.number(),
	StartDate: z.string(),
	EndDate: z.string(),
});

export const customerSchema = z.object({
	Id: z.number(),
	Name: z.string(),
	TaxId: z.string(),
	Address: addressSchema,
	Telephone: z.string(),
	Email: z.string(),
});

export const productSchema = z.object({
	Id: z.number(),
	Category: z.string(),
	Name: z.string(),
});

export const taxSchema = z.object({
	TaxType: z.string(),
	TaxCountryRegion: z.string(),
	TaxPercentage: z.number(),
});

export const lineSchema = z.object({
	Id: z.number(),
	ProductId: z.number(),
	ProductName: z.string(),
	Quantity: z.number(),
	UnitPrice: z.number(),
	NetTotal: z.number(),
	Tax: taxSchema,
});

export const invoiceSchema = z.object({
	Id: z.string(),
	Status: z.string(),
	Hash: z.string(),
	Date: z.string(),
	Type: z.string(),
	CustomerId: z.number(),
	Line: z.array(lineSchema),
	TaxPayable: z.number(),
	NetTotal: z.number(),
	GrossTotal: z.number(),
});

export const rawDataSchema = z.object({
	Company: companySchema,
	Customers: z.array(customerSchema),
	Products: z.array(productSchema),
	Invoices: z.array(invoiceSchema),
});
