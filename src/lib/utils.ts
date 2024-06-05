import { env } from '@/env';
import { type DeltaType } from '@tremor/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { type RawData } from '@/types/raw-data';
import { type SAFT } from '@/types/saft';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

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

export const convertFileToBase64 = async (file: File) => {
	const fileContent = await new Promise<string>((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => {
			resolve(reader.result as string);
		};

		reader.onerror = () => {
			reject(new Error('Failed to read file content!'));
		};

		reader.readAsText(file, 'windows-1252');
	});

	const base64 = Buffer.from(fileContent).toString('base64');

	return base64;
};

export const convertBase64ToString = (base64: string) => {
	return Buffer.from(base64, 'base64').toString('utf-8');
};

export const parseXMLtoObject = (xml: SAFT) => {
	const { AuditFile } = xml;
	const { Header, MasterFiles, SourceDocuments } = AuditFile;

	const data: RawData = {
		Company: {
			Id: parseInt(Header.CompanyID),
			Name: Header.CompanyName,
			Address: {
				Street: Header.CompanyAddress.AddressDetail,
				City: Header.CompanyAddress.City,
				PostalCode: Header.CompanyAddress.PostalCode,
				Country: Header.CompanyAddress.Country,
			},
			FiscalYear: parseInt(Header.FiscalYear),
			StartDate: Header.StartDate,
			EndDate: Header.EndDate,
		},
		Customers: MasterFiles.Customer.map((customer) => ({
			Id: parseInt(customer.CustomerID),
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
			Id: parseInt(product.ProductCode),
			Category: product.ProductGroup || 'N/A',
			Name: product.ProductDescription,
		})),
		Invoices: SourceDocuments.SalesInvoices.Invoice.map((invoice) => ({
			Id: invoice.InvoiceNo,
			Status: invoice.DocumentStatus.InvoiceStatus,
			Hash: invoice.Hash,
			Date: invoice.InvoiceDate,
			Type: invoice.InvoiceType,
			CustomerId: parseInt(invoice.CustomerID),
			Line: (Array.isArray(invoice.Line)
				? invoice.Line
				: [invoice.Line]
			).map((line) => ({
				Id: parseInt(line.LineNumber),
				ProductId: parseInt(line.ProductCode),
				ProductName: line.ProductDescription,
				Quantity: parseInt(line.Quantity),
				UnitPrice: parseFloat(line.UnitPrice),
				NetTotal: parseFloat(line.CreditAmount),
				Tax: {
					TaxType: line.Tax.TaxType,
					TaxCountryRegion: line.Tax.TaxCountryRegion,
					TaxPercentage: parseInt(line.Tax.TaxPercentage),
				},
			})),
			TaxPayable: parseFloat(invoice.DocumentTotals.TaxPayable),
			NetTotal: parseFloat(invoice.DocumentTotals.NetTotal),
			GrossTotal: parseFloat(invoice.DocumentTotals.GrossTotal),
		})),
	};

	return data;
};

export function monthNumberToString(monthNumber: number): string {
	const monthNames: string[] = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	];

	if (monthNumber < 1 || monthNumber > 12) {
		throw new Error('Invalid month number. Must be between 1 and 12.');
	}

	const monthName = monthNames[monthNumber - 1];
	if (!monthName) {
		throw new Error('Invalid month number. Must be between 1 and 12.');
	}

	return monthName;
}

export function trimesterNumberToString(trimesterNumber: number): string {
	const trimesterNames: string[] = [
		'1st Trimester',
		'2nd Trimester',
		'3rd Trimester',
		'4th Trimester',
	];

	if (trimesterNumber < 1 || trimesterNumber > 4) {
		throw new Error('Invalid month number. Must be between 1 and 4.');
	}

	const trimesterName = trimesterNames[trimesterNumber - 1];
	if (!trimesterName) {
		throw new Error('Invalid month number. Must be between 1 and 4.');
	}

	return trimesterName;
}

export const getDeltaType = (trend: number): DeltaType => {
	if (trend < -35) return 'decrease';
	if (trend < 0) return 'moderateDecrease';
	if (trend === 0) return 'unchanged';
	if (trend < 30) return 'moderateIncrease';
	return 'increase';
};
