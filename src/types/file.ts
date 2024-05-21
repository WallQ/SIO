interface Address {
	Street: string;
	City: string;
	PostalCode: string;
	Country: string;
}

interface Company {
	Id: number;
	Name: string;
	Address: Address;
	FiscalYear: number;
	StartDate: string;
	EndDate: string;
}

interface Customer {
	Id: number;
	Name: string;
	Address: Address;
	Telephone: string;
	Email: string;
}

interface Product {
	Id: number;
	Category: string;
	Name: string;
}

interface Tax {
	TaxType: string;
	TaxCountryRegion: string;
	TaxPercentage: number;
}

interface Line {
	ProductID: number;
	ProductName: string;
	Quantity: number;
	UnitPrice: number;
	Amount: number;
	Tax: Tax;
}

interface Invoice {
	Id: string;
	Date: string;
	TaxPayable: number;
	NetTotal: number;
	GrossTotal: number;
	CustomerID: number;
	Line: Line[];
}

export interface ParsedXML {
	TOCOnline: {
		Company: Company;
		Customers: {
			Customer: Customer[];
		};
		Products: {
			Product: Product[];
		};
		Invoices: {
			Invoice: Invoice[];
		};
	};
}
