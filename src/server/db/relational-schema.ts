import { relations } from 'drizzle-orm';
import {
	doublePrecision,
	integer,
	pgTableCreator,
	serial,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core';

export const createTable = pgTableCreator((name) => `${name}`);

export const addresses = createTable('addresses', {
	id: serial('id').notNull().primaryKey(),
	street: varchar('street', { length: 64 }).notNull(),
	city: varchar('city', { length: 64 }).notNull(),
	postal_code: varchar('postal_code', { length: 64 }).notNull(),
	country: varchar('country', { length: 64 }).notNull(),
});

export const addressesRelations = relations(addresses, ({ one }) => ({
	supplier: one(suppliers, {
		fields: [addresses.id],
		references: [suppliers.address_id],
	}),
	company: one(companies, {
		fields: [addresses.id],
		references: [companies.address_id],
	}),
	customer: one(customers, {
		fields: [addresses.id],
		references: [customers.address_id],
	}),
}));

export const companies = createTable('companies', {
	id: serial('id').notNull().primaryKey(),
	name: varchar('name', { length: 64 }).notNull(),
	address_id: integer('address_id')
		.notNull()
		.references(() => addresses.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
	fiscal_year: integer('fiscal_year').notNull(),
	start_date: timestamp('start_date').notNull(),
	end_date: timestamp('end_date').notNull(),
});

export const companiesRelations = relations(companies, ({ one, many }) => ({
	invoice: many(invoices),
	product: many(products),
	address: one(addresses, {
		fields: [companies.address_id],
		references: [addresses.id],
	}),
}));

export const suppliers = createTable('suppliers', {
	id: serial('id').notNull().primaryKey(),
	name: varchar('name', { length: 64 }).notNull(),
	email: varchar('email', { length: 64 }).notNull(),
	telephone: varchar('telephone', { length: 64 }).notNull(),
	address_id: integer('address_id')
		.notNull()
		.references(() => addresses.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
});

export const suppliersRelations = relations(suppliers, ({ many, one }) => ({
	invoice: many(invoices),
	address: one(addresses, {
		fields: [suppliers.address_id],
		references: [addresses.id],
	}),
}));

export const customers = createTable('customers', {
	id: serial('id').notNull().primaryKey(),
	name: varchar('name', { length: 64 }).notNull(),
	tax_id: varchar('tax_id', { length: 64 }).notNull(),
	address_id: integer('address_id')
		.notNull()
		.references(() => addresses.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
	telephone: varchar('telephone', { length: 64 }).notNull(),
	email: varchar('email', { length: 64 }).notNull(),
});

export const customersRelations = relations(customers, ({ one, many }) => ({
	invoice: many(invoices),
	address: one(addresses, {
		fields: [customers.address_id],
		references: [addresses.id],
	}),
}));

export const products = createTable('products', {
	id: serial('id').notNull().primaryKey(),
	category: varchar('category', { length: 64 }).notNull(),
	name: varchar('name', { length: 64 }).notNull(),
	company_id: integer('company_id')
		.notNull()
		.references(() => companies.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
});

export const productsRelations = relations(products, ({ one, many }) => ({
	invoiceLine: many(lines),
	company: one(companies, {
		fields: [products.company_id],
		references: [companies.id],
	}),
}));

export const invoices = createTable('invoices', {
	id: serial('id').notNull().primaryKey(),
	status: varchar('status', { length: 64 }).notNull(),
	hash: varchar('hash', { length: 256 }).notNull(),
	date: timestamp('date').notNull(),
	type: varchar('type', { length: 64 }).notNull(),
	tax_payable: doublePrecision('tax_payable').notNull(),
	net_total: doublePrecision('net_total').notNull(),
	gross_total: doublePrecision('gross_total').notNull(),
	company_id: integer('company_id')
		.notNull()
		.references(() => companies.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
	customer_id: integer('customer_id').references(() => customers.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade',
	}),
	supplier_id: integer('supplier_id').references(() => suppliers.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade',
	}),
});

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
	invoiceLine: many(lines),
	supplier: one(suppliers, {
		fields: [invoices.supplier_id],
		references: [suppliers.id],
	}),
	company: one(companies, {
		fields: [invoices.company_id],
		references: [companies.id],
	}),
	customer: one(customers, {
		fields: [invoices.customer_id],
		references: [customers.id],
	}),
}));

export const lines = createTable('lines', {
	id: serial('id').notNull().primaryKey(),
	quantity: integer('quantity').notNull(),
	unit_price: doublePrecision('unit_price').notNull(),
	amount: doublePrecision('amount').notNull(),
	tax_percentage: integer('tax_percentage').notNull(),
	product_id: integer('product_id')
		.notNull()
		.references(() => products.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
	invoice_id: integer('invoice_id')
		.notNull()
		.references(() => invoices.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
});

export const linesRelations = relations(lines, ({ one }) => ({
	invoice: one(invoices, {
		fields: [lines.invoice_id],
		references: [invoices.id],
	}),
	product: one(products, {
		fields: [lines.product_id],
		references: [products.id],
	}),
}));
