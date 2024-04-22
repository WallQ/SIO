export type Invoice = {
	hash: string;
	customerId: string;
	invoiceDate: string;
	taxPayable: number;
	netTotal: number;
	grossTotal: number;
	line: {
		productId: string;
		productName: string;
		quantity: number;
		unitPrice: number;
		amount: number;
	}[];
};
