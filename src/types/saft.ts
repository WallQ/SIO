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
	CompanyID: string;
	TaxRegistrationNumber: string;
	TaxAccountingBasis: string;
	CompanyName: string;
	BusinessName: string;
	CompanyAddress: Address;
	FiscalYear: string;
	StartDate: string;
	EndDate: string;
	CurrencyCode: string;
	DateCreated: string;
	TaxEntity: string;
	ProductCompanyTaxID: string;
	SoftwareCertificateNumber: string;
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
	CustomerID: string;
	AccountID: string;
	CustomerTaxID: string;
	CompanyName: string;
	BillingAddress: Address;
	ShipToAddress: Address;
	Telephone: string;
	Email: string;
	SelfBillingIndicator: string;
}

export interface Product {
	ProductType: string;
	ProductCode: string;
	ProductGroup: string;
	ProductDescription: string;
	ProductNumberCode: string;
}

export interface TaxTable {
	TaxTableEntry: Tax[];
}

export interface Tax {
	TaxType: string;
	TaxCountryRegion: string;
	TaxCode: string;
	Description: string;
	TaxPercentage: string;
}

export interface SourceDocuments {
	SalesInvoices: {
		NumberOfEntries: string;
		TotalDebit: string;
		TotalCredit: string;
		Invoice: Invoice[];
	};
	MovementOfGoods: {
		NumberOfMovementLines: string;
		TotalQuantityIssued: string;
	};
	WorkingDocuments: Payment;
	Payments: Payment;
}

export interface Payment {
	NumberOfEntries: string;
	TotalDebit: string;
	TotalCredit: string;
}

export interface Invoice {
	InvoiceNo: string;
	ATCUD: string;
	DocumentStatus: {
		InvoiceStatus: string;
		InvoiceStatusDate: string;
		SourceID: string;
		SourceBilling: string;
	};
	Hash: string;
	HashControl: string;
	Period: string;
	InvoiceDate: string;
	InvoiceType: string;
	SpecialRegimes: {
		SelfBillingIndicator: string;
		CashVATSchemeIndicator: string;
		ThirdPartiesBillingIndicator: string;
	};
	SourceID: string;
	SystemEntryDate: string;
	CustomerID: string;
	Line: Line[];
	DocumentTotals: {
		TaxPayable: string;
		NetTotal: string;
		GrossTotal: string;
	};
}

export interface Line {
	LineNumber: string;
	ProductCode: string;
	ProductDescription: string;
	Quantity: string;
	UnitOfMeasure: string;
	UnitPrice: string;
	TaxPointDate: string;
	Description: string;
	CreditAmount: string;
	Tax: {
		TaxType: string;
		TaxCountryRegion: string;
		TaxCode: string;
		TaxPercentage: string;
	};
}
