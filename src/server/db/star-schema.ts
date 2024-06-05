import { numeric, pgTableCreator, text } from 'drizzle-orm/pg-core';

export const createTable = pgTableCreator((name) => `${name}`);

export const companyDimension = createTable('company_dimension', {
	sk: text('sk').notNull().primaryKey(),
	name: text('name'),
	city: text('city'),
	country: text('country'),
});

export const productDimension = createTable('product_dimension', {
	sk: text('sk').notNull().primaryKey(),
	name: text('name'),
	category: text('category'),
});

export const customerDimension = createTable('customer_dimension', {
	sk: text('sk').notNull().primaryKey(),
	name: text('name'),
	city: text('city'),
	country: text('country'),
});

export const geoDimension = createTable('geo_dimension', {
	sk: text('sk').notNull().primaryKey(),
	city: text('city'),
	country: text('country'),
});

export const timeDimension = createTable('time_dimension', {
	sk: text('sk').notNull().primaryKey(),
	year: text('year'),
	quarter: text('quarter'),
	month: text('month'),
});

export const salesFact = createTable('sales_fact', {
	sk: text('sk').notNull().primaryKey(),
	value: numeric('value'),
});

export const salesQuantityFact = createTable('sales_quantity_fact', {
	sk: text('sk').notNull().primaryKey(),
	value: numeric('value'),
});
