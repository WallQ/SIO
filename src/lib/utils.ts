import { env } from '@/env';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { type ParsedXML } from '@/types/file';
import { type SAFT } from '@/types/saft';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const convertFileToBase64 = (file: File) => {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();

		fileReader.readAsDataURL(file);

		fileReader.onload = () => {
			resolve(fileReader.result);
		};

		fileReader.onerror = (error) => {
			reject(error);
		};
	});
};

export const convertStringToXML = (base64: string) => {
	const base64Data = base64.replace(/^data:text\/xml;base64,/, '');

	const decodedData = Buffer.from(base64Data, 'base64').toString('utf-8');

	return decodedData;
};

export const formatCurrency = (
	value: number,
	compact = false,
	showCents = true,
) => {
	return new Intl.NumberFormat('pt-PT', {
		style: 'currency',
		currency: 'EUR',
		notation: compact ? 'compact' : 'standard',
		minimumFractionDigits: showCents ? 2 : 0,
		maximumFractionDigits: showCents ? 2 : 0,
	}).format(value);
};

export const formatNumber = (
	value: number,
	compact = false,
	showDecimals = true,
) => {
	return new Intl.NumberFormat('pt-PT', {
		style: 'decimal',
		notation: compact ? 'compact' : 'standard',
		minimumFractionDigits: showDecimals ? 2 : 0,
		maximumFractionDigits: showDecimals ? 2 : 0,
	}).format(value);
};

export const getInitials = (name: string): string => {
	return name
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase())
		.join('');
};

export function formatBytes(
	bytes: number,
	opts: {
		decimals?: number;
		sizeType?: 'accurate' | 'normal';
	} = {},
) {
	const { decimals = 0, sizeType = 'normal' } = opts;

	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
	if (bytes === 0) return '0 Byte';
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
		sizeType === 'accurate'
			? accurateSizes[i] ?? 'Bytest'
			: sizes[i] ?? 'Bytes'
	}`;
}

export function getBaseUrl() {
	if (env.NODE_ENV === 'development') {
		return 'http://localhost:3000';
	} else {
		return `https://${env.NEXTAUTH_URL}`;
	}
}

export const ensureArray = <T>(value: T | T[]): T[] =>
	Array.isArray(value) ? value : [value];

export const transformXML = (parsedXML: SAFT) => {
	const { AuditFile } = parsedXML;
	const { Header, MasterFiles, SourceDocuments } = AuditFile;

	const transformedData: ParsedXML = {
		TOCOnline: {
			Company: {
				Id: Header.CompanyID,
				Name: Header.CompanyName,
				Address: {
					Street: Header.CompanyAddress.AddressDetail,
					City: Header.CompanyAddress.City,
					PostalCode: Header.CompanyAddress.PostalCode,
					Country: Header.CompanyAddress.Country,
				},
				FiscalYear: Header.FiscalYear,
				StartDate: Header.StartDate.toISOString(),
				EndDate: Header.EndDate.toISOString(),
			},
			Customers: MasterFiles.Customer.map((customer) => ({
				Id: customer.CustomerID,
				Name: customer.CompanyName,
				TaxId: customer.CustomerTaxID,
				Address: {
					Street: customer.BillingAddress.AddressDetail,
					City: customer.BillingAddress.City,
					PostalCode: customer.BillingAddress.PostalCode,
					Country: customer.BillingAddress.Country,
				},
				Telephone: customer.Telephone,
				Email: customer.Email,
			})),
			Products: MasterFiles.Product.map((product) => ({
				Id: product.ProductCode,
				Category: product.ProductGroup,
				Name: product.ProductDescription,
			})),
			Invoices: SourceDocuments.SalesInvoices.Invoice.map((invoice) => ({
				Id: invoice.InvoiceNo,
				Status: {
					InvoiceStatus: invoice.DocumentStatus.InvoiceStatus,
					SourceBilling: invoice.DocumentStatus.SourceBilling,
				},
				Hash: invoice.Hash,
				Date: invoice.InvoiceDate.toISOString(),
				Type: invoice.InvoiceType,
				CustomerId: invoice.CustomerID,
				Line: invoice.Line.map((line) => ({
					Id: line.LineNumber,
					ProductId: line.ProductCode,
					ProductName: line.ProductDescription,
					Quantity: line.Quantity,
					UnitPrice: line.UnitPrice,
					Amount: line.CreditAmount,
					Tax: {
						TaxType: line.Tax.TaxType,
						TaxCountryRegion: line.Tax.TaxCountryRegion,
						TaxPercentage: line.Tax.TaxPercentage,
					},
				})),
				TaxPayable: invoice.DocumentTotals.TaxPayable,
				NetTotal: invoice.DocumentTotals.NetTotal,
				GrossTotal: invoice.DocumentTotals.GrossTotal,
			})),
		},
	};

	return transformedData;
};
