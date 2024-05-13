export type Company = {
	id: number;
	name: string;
	street: string;
	city: string;
	zip: string;
	country: string;
};

export const companies = [
	{
		id: 1,
		name: 'ElectroTech',
		street: 'Rua do Curral',
		city: 'Felgueiras',
		zip: '4610-156',
		country: 'Portugal',
	},
	{
		id: 2,
		name: 'KrakenTech',
		street: 'Rua do Curral',
		city: 'Felgueiras',
		zip: '4610-156',
		country: 'Portugal',
	},
] as Company[];

export type companiesType = typeof companies;

export type Product = {
	id: number;
	name: string;
	category: string;
};

export const products = [
	{
		id: 1,
		name: 'iPhone 15 Pro Max',
		category: 'Smartphone',
	},
	{
		id: 2,
		name: 'iPhone 15 Pro',
		category: 'Smartphone',
	},
	{
		id: 3,
		name: 'iPhone 15 Plus',
		category: 'Smartphone',
	},
	{
		id: 4,
		name: 'iPhone 15',
		category: 'Smartphone',
	},
	{
		id: 5,
		name: 'MacBook Pro M3 Max',
		category: 'Laptop',
	},
	{
		id: 6,
		name: 'MacBook M3 Pro',
		category: 'Laptop',
	},
	{
		id: 7,
		name: 'MacBook Pro M3',
		category: 'Laptop',
	},
] as Product[];

export type productsType = typeof products;

export type Customer = {
	id: number;
	name: string;
	email: string;
	phone: string;
	street: string;
	city: string;
	zip: string;
	country: string;
};

export const customers = [
	{
		id: 1,
		name: 'Carlos Leite',
		email: '8200377@estg.ipp.pt',
		phone: '961852391',
		street: 'Rua do Curral',
		city: 'Felgueiras',
		zip: '4610-156',
		country: 'Portugal',
	},
	{
		id: 2,
		name: 'João Vieira',
		email: '8200620@estg.ipp.pt',
		phone: '916997710',
		street: 'Rua do Curral',
		city: 'Amarante',
		zip: '4610-156',
		country: 'Portugal',
	},
	{
		id: 3,
		name: 'Pedro Tiago',
		email: '8200387@estg.ipp.pt',
		phone: '914960483',
		street: 'Rua do Curral',
		city: 'Felgueiras',
		zip: '4610-156',
		country: 'Portugal',
	},
	{
		id: 4,
		name: 'Rafael Ferraz',
		email: '8200757@estg.ipp.pt',
		phone: '917794456',
		street: 'Rua do Curral',
		city: 'Amarante',
		zip: '4610-156',
		country: 'Portugal',
	},
	{
		id: 5,
		name: 'Rui Brandão',
		email: '8200139@estg.ipp.pt',
		phone: '937992476',
		street: 'Rua do Curral',
		city: 'Amarante',
		zip: '4610-156',
		country: 'Portugal',
	},
	{
		id: 6,
		name: 'Sérgio Félix',
		email: '8200615@estg.ipp.pt',
		phone: '916275619',
		street: 'Rua do Curral',
		city: 'Felgueiras',
		zip: '4610-156',
		country: 'Portugal',
	},
] as Customer[];

export type customersType = typeof customers;

export type Geo = {
	id: number;
	city: string;
	country: string;
};

export const geos = [
	{
		id: 1,
		city: 'Felgueiras',
		country: 'Portugal',
	},
	{
		id: 2,
		city: 'Amarante',
		country: 'Portugal',
	},
] as Geo[];

export type geosType = typeof geos;

export type Time = {
	id: number;
	date: Date;
	year: number;
	month: number;
	day: number;
	week: number;
	quarter: number;
};

export const times = [
	{
		id: 1,
		date: new Date('2021-01-01'),
		year: 2023,
		month: 1,
		day: 1,
		week: 1,
		quarter: 1,
	},
	{
		id: 2,
		date: new Date('2021-03-01'),
		year: 2023,
		month: 3,
		day: 1,
		week: 1,
		quarter: 1,
	},
	{
		id: 3,
		date: new Date('2021-04-01'),
		year: 2023,
		month: 4,
		day: 1,
		week: 1,
		quarter: 2,
	},
	{
		id: 4,
		date: new Date('2021-06-01'),
		year: 2023,
		month: 6,
		day: 1,
		week: 1,
		quarter: 2,
	},
	{
		id: 5,
		date: new Date('2021-07-01'),
		year: 2023,
		month: 7,
		day: 1,
		week: 1,
		quarter: 3,
	},
	{
		id: 6,
		date: new Date('2021-09-01'),
		year: 2023,
		month: 9,
		day: 1,
		week: 1,
		quarter: 3,
	},
	{
		id: 7,
		date: new Date('2021-10-01'),
		year: 2023,
		month: 10,
		day: 1,
		week: 1,
		quarter: 4,
	},
	{
		id: 8,
		date: new Date('2021-12-01'),
		year: 2023,
		month: 12,
		day: 1,
		week: 1,
		quarter: 4,
	},
] as Time[];

export type timesType = typeof times;

export type Sales = {
	id: number;
	tax_payable: number;
	net_total: number;
	gross_total: number;
	company_id: number;
	product_id: number;
	customer_id: number;
	geo_id: number;
	time_id: number;
};

export const sales = [
	{
		id: 1,
		tax_payable: 296.0,
		net_total: 1203.0,
		gross_total: 1499.0,
		company_id: 1,
		product_id: 1,
		customer_id: 1,
		geo_id: 1,
		time_id: 1,
	},
	{
		id: 2,
		tax_payable: 249.0,
		net_total: 1000.0,
		gross_total: 1249.0,
		company_id: 1,
		product_id: 2,
		customer_id: 2,
		geo_id: 1,
		time_id: 2,
	},
	{
		id: 3,
		tax_payable: 228.0,
		net_total: 911.0,
		gross_total: 1139.0,
		company_id: 1,
		product_id: 3,
		customer_id: 3,
		geo_id: 1,
		time_id: 3,
	},
	{
		id: 4,
		tax_payable: 200.0,
		net_total: 789.0,
		gross_total: 989.0,
		company_id: 1,
		product_id: 4,
		customer_id: 4,
		geo_id: 1,
		time_id: 4,
	},
	{
		id: 5,
		tax_payable: 771.0,
		net_total: 3328.0,
		gross_total: 4099.0,
		company_id: 2,
		product_id: 5,
		customer_id: 5,
		geo_id: 2,
		time_id: 5,
	},
	{
		id: 6,
		tax_payable: 584.0,
		net_total: 2515.0,
		gross_total: 3099.0,
		company_id: 2,
		product_id: 6,
		customer_id: 6,
		geo_id: 2,
		time_id: 6,
	},
	{
		id: 7,
		tax_payable: 474.0,
		net_total: 2035.0,
		gross_total: 2509.0,
		company_id: 2,
		product_id: 7,
		customer_id: 1,
		geo_id: 2,
		time_id: 7,
	},
] as Sales[];

export type salesType = typeof sales;
