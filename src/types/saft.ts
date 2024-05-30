export interface SAFT {
	AuditFile: AuditFile;
}

export interface AuditFile {
	Header: Header;
	MasterFiles: MasterFiles;
	SourceDocuments: SourceDocuments;
	_xmlns: string;
}

export interface Header {
	AuditFileVersion: string;
	CompanyID: number;
	TaxRegistrationNumber: number;
	TaxAccountingBasis: string;
	CompanyName: string;
	BusinessName: string;
	CompanyAddress: Address;
	FiscalYear: number;
	StartDate: string;
	EndDate: string;
	CurrencyCode: string;
	DateCreated: string;
	TaxEntity: string;
	ProductCompanyTaxID: number;
	SoftwareCertificateNumber: number;
	ProductID: string;
	ProductVersion: string;
}

export interface Address {
	AddressDetail: string;
	City: string;
	PostalCode: string;
	Country: string;
}

export interface MasterFiles {
	Customer: Customer[];
	Product: Product[];
	TaxTable: TaxTable;
}

export interface Customer {
	CustomerID: number;
	AccountID: string;
	CustomerTaxID: string;
	CompanyName: string;
	BillingAddress: Address;
	ShipToAddress: Address;
	Telephone: string;
	Email: string;
	SelfBillingIndicator: number;
}

export interface Product {
	ProductType: string;
	ProductCode: number;
	ProductGroup: string;
	ProductDescription: string;
	ProductNumberCode: number;
}

export interface TaxTable {
	TaxTableEntry: Tax[];
}

export interface Tax {
	TaxType: string;
	TaxCountryRegion: string;
	TaxCode: string;
	Description: string;
	TaxPercentage: number;
}

export interface SourceDocuments {
	SalesInvoices: {
		NumberOfEntries: number;
		TotalDebit: number;
		TotalCredit: number;
		Invoice: Invoice[];
	};
	MovementOfGoods: {
		NumberOfMovementLines: number;
		TotalQuantityIssued: number;
	};
	WorkingDocuments: Payment;
	Payments: Payment;
}

export interface Payment {
	NumberOfEntries: number;
	TotalDebit: number;
	TotalCredit: number;
}

export interface Invoice {
	InvoiceNo: string;
	ATCUD: string;
	DocumentStatus: {
		InvoiceStatus: string;
		InvoiceStatusDate: string;
		SourceID: number;
		SourceBilling: string;
	};
	Hash: string;
	HashControl: number;
	Period: number;
	InvoiceDate: string;
	InvoiceType: string;
	SpecialRegimes: {
		SelfBillingIndicator: number;
		CashVATSchemeIndicator: number;
		ThirdPartiesBillingIndicator: number;
	};
	SourceID: number;
	SystemEntryDate: string;
	CustomerID: number;
	Line: Line[];
	DocumentTotals: {
		TaxPayable: number;
		NetTotal: number;
		GrossTotal: number;
	};
}

export interface Line {
	LineNumber: number;
	ProductCode: number;
	ProductDescription: string;
	Quantity: number;
	UnitOfMeasure: string;
	UnitPrice: number;
	TaxPointDate: string;
	Description: string;
	CreditAmount: number;
	Tax: {
		TaxType: string;
		TaxCountryRegion: string;
		TaxCode: string;
		TaxPercentage: number;
	};
}
