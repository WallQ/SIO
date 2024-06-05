import {
	doublePrecision,
	integer,
	pgTableCreator,
	text,
	varchar,
} from 'drizzle-orm/pg-core';

export const createTable = pgTableCreator((name) => `${name}`);

export const companyDimension = createTable('company_dimension', {
	sk: text('sk').notNull().primaryKey(),
	name: varchar('name', { length: 64 }),
	city: varchar('city', { length: 64 }),
	country: varchar('country', { length: 64 }),
});

export const productDimension = createTable('product_dimension', {
	sk: text('sk').notNull().primaryKey(),
	name: varchar('name', { length: 64 }),
	category: varchar('category', { length: 64 }),
});

export const customerDimension = createTable('customer_dimension', {
	sk: text('sk').notNull().primaryKey(),
	name: varchar('name', { length: 64 }),
	city: varchar('city', { length: 64 }),
	country: varchar('country', { length: 64 }),
});

export const geoDimension = createTable('geo_dimension', {
	sk: text('sk').notNull().primaryKey(),
	city: varchar('city', { length: 64 }),
	country: varchar('country', { length: 64 }),
});

export const timeDimension = createTable('time_dimension', {
	sk: text('sk').notNull().primaryKey(),
	year: integer('year'),
	quarter: integer('quarter'),
	month: integer('month'),
});

export const salesFact = createTable('sales_fact', {
	sk: text('sk').notNull().primaryKey(),
	value: doublePrecision('value'),
});

export const salesQuantityFact = createTable('sales_quantity_fact', {
	sk: text('sk').notNull().primaryKey(),
	value: doublePrecision('value'),
});
