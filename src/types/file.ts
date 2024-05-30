export interface Address {
	Street: string;
	City: string;
	PostalCode: string;
	Country: string;
}

export interface Company {
	Id: number;
	Name: string;
	Address: Address;
	FiscalYear: number;
	StartDate: string;
	EndDate: string;
}

export interface Customer {
	Id: number;
	Name: string;
	TaxId: string;
	Address: Address;
	Telephone: string;
	Email: string;
}

export interface Product {
	Id: number;
	Category: string;
	Name: string;
}

export interface Tax {
	TaxType: string;
	TaxCountryRegion: string;
	TaxPercentage: number;
}

export interface Line {
	Id: number;
	ProductId: number;
	ProductName: string;
	Quantity: number;
	UnitPrice: number;
	Amount: number;
	Tax: Tax;
}

export interface Invoice {
	Id: string;
	Status: string;
	Hash: string;
	Date: string;
	Type: string;
	CustomerId: number;
	Line: Line[];
	TaxPayable: number;
	NetTotal: number;
	GrossTotal: number;
}

export interface ParsedXML {
	TOCOnline: {
		Company: Company;
		Customers: Customer[];
		Products: Product[];
		Invoices: Invoice[];
	};
}
