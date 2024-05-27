import { relations, sql } from 'drizzle-orm';
import {
	doublePrecision,
	index,
	integer,
	pgTableCreator,
	primaryKey,
	serial,
	text,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core';
import { type AdapterAccount } from 'next-auth/adapters';

export const createTable = pgTableCreator((name) => `sio_${name}`);

export const company = createTable('company', {
    id: serial('id').notNull().primaryKey(),
    name: varchar('name', { length: 64 }).notNull(),
    address_id: integer('address_id').notNull().references(() => address.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }),
});

export const address = createTable('address', {
    id: serial('id').notNull().primaryKey(),
    street: varchar('street', { length: 64 }).notNull(),
    city: varchar('city', { length: 64 }).notNull(),
    postal_code: varchar('postal_code', { length: 64 }).notNull(),
    country: varchar('country', { length: 64 }).notNull(),
});

export const customer = createTable('customer', {
    id: serial('id').notNull().primaryKey(),
    name: varchar('name', { length: 64 }).notNull(),
    email: varchar('email', { length: 64 }).notNull(),
    telephone: varchar('telephone', { length: 64 }).notNull(),
    address_id: integer('address_id').notNull().references(() => address.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }),
});

export const supplier = createTable('supplier', {
    id: serial('id').notNull().primaryKey(),
    name: varchar('name', { length: 64 }).notNull(),
    email: varchar('email', { length: 64 }).notNull(),
    telephone: varchar('telephone', { length: 64 }).notNull(),
    address_id: integer('address_id').notNull().references(() => address.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }),
});

export const product = createTable('product', {
    id: serial('id').notNull().primaryKey(),
    name: varchar('name', { length: 64 }).notNull(),
    category: varchar('category', { length: 64 }).notNull(),
    company_id: integer('company_id').notNull().references(() => company.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }),
});

export const invoice = createTable('invoice', {
    id: serial('id').notNull().primaryKey(),
    hash: varchar('hash', { length: 64 }).notNull(),
	invoiceType: varchar('invoiceType', { length: 64 }).notNull(),
    date: timestamp('date').notNull(),
    taxPayable: doublePrecision('taxPayable').notNull(),
    netTotal: doublePrecision('netTotal').notNull(),
    grossTotal: doublePrecision('grossTotal').notNull(),
    customer_id: integer('customer_id').references(() => customer.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }),
    company_id: integer('company_id').notNull().references(() => company.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }),
    supplier_id: integer('supplier_id').references(() => supplier.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }),
});

export const invoiceLine = createTable('invoiceLine', {
    id: serial('id').notNull().primaryKey(),
    quantity: integer('quantity').notNull(),
    unitPrice: doublePrecision('netTotal').notNull(),
    amount: doublePrecision('amount').notNull(),
    product_id: integer('product_id').notNull().references(() => product.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }),
    invoice_id: integer('invoice_id').notNull().references(() => invoice.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }),
});

export const supplierRelations = relations(supplier, ({ many, one }) => ({
    invoice: many(invoice),
    address: one(address, {
        fields: [supplier.address_id],
        references: [address.id],
    }),
}));

export const invoiceRelations = relations(invoice, ({ one, many }) => ({
    invoiceLine: many(invoiceLine),
    supplier: one(supplier, {
        fields: [invoice.supplier_id],
        references: [supplier.id],
    }),
    company: one(company, {
        fields: [invoice.company_id],
        references: [company.id],
    }),
    customer: one(customer, {
        fields: [invoice.customer_id],
        references: [customer.id],
    }),
}));

export const addressRelations = relations(address, ({ one }) => ({
    supplier: one(supplier, {
        fields: [address.id],
        references: [supplier.address_id],
    }),
    company: one(company, {
        fields: [address.id],
        references: [company.address_id],
    }),
    customer: one(customer, {
        fields: [address.id],
        references: [customer.address_id],
    }),
}));

export const customerRelations = relations(customer, ({ one, many }) => ({
    invoice: many(invoice),
    address: one(address, {
        fields: [customer.address_id],
        references: [address.id],
    }),
}));

export const companyRelations = relations(company, ({ one, many }) => ({
    invoice: many(invoice),
    product: many(product),
    address: one(address, {
        fields: [company.address_id],
        references: [address.id],
    }),
}));

export const productRelations = relations(product, ({ one, many }) => ({
    invoiceLine: many(invoiceLine),
    company: one(company, {
        fields: [product.company_id],
        references: [company.id],
    }),
}));

export const invoiceLineRelations = relations(invoiceLine, ({ one, many }) => ({
    invoice: one(invoice, {
        fields: [invoiceLine.invoice_id],
        references: [invoice.id],
    }),
    product: one(product, {
        fields: [invoiceLine.product_id],
        references: [product.id],
    }),
}));

export const companyDimension = createTable('company_dimension', {
	id: serial('id').notNull().primaryKey(),
	name: varchar('name', { length: 64 }).notNull(),
	street: varchar('street', { length: 64 }).notNull(),
	city: varchar('city', { length: 64 }).notNull(),
	postal_code: varchar('postal_code', { length: 64 }).notNull(),
	country: varchar('country', { length: 64 }).notNull(),
});

export const companyDimensionRelations = relations(
	companyDimension,
	({ many }) => ({
		salesFacts: many(salesFact),
	}),
);

export const productDimension = createTable('product_dimension', {
	id: serial('id').notNull().primaryKey(),
	name: varchar('name', { length: 64 }).notNull(),
	category: varchar('category', { length: 64 }).notNull(),
});

export const productDimensionRelations = relations(
	productDimension,
	({ many }) => ({
		salesFacts: many(salesFact),
	}),
);

export const customerDimension = createTable('customer_dimension', {
	id: serial('id').notNull().primaryKey(),
	name: varchar('name', { length: 64 }).notNull(),
	email: varchar('email', { length: 64 }).notNull(),
	telephone: varchar('telephone', { length: 64 }).notNull(),
	street: varchar('street', { length: 64 }).notNull(),
	city: varchar('city', { length: 64 }).notNull(),
	postal_code: varchar('postal_code', { length: 64 }).notNull(),
	country: varchar('country', { length: 64 }).notNull(),
});

export const customerDimensionRelations = relations(
	customerDimension,
	({ many }) => ({
		salesFacts: many(salesFact),
	}),
);

export const geoDimension = createTable('geo_dimension', {
	id: serial('id').notNull().primaryKey(),
	city: varchar('city', { length: 64 }).notNull(),
	country: varchar('country', { length: 64 }).notNull(),
});

export const geoDimensionRelations = relations(geoDimension, ({ many }) => ({
	salesFacts: many(salesFact),
}));

export const timeDimension = createTable('time_dimension', {
	id: serial('id').notNull().primaryKey(),
	date: timestamp('date').notNull(),
	year: integer('year').notNull(),
	month: integer('month').notNull(),
	day: integer('day').notNull(),
	day_of_week: integer('day_of_week').notNull(),
	week: integer('week').notNull(),
	quarter: integer('quarter').notNull(),
});

export const timeDimensionRelations = relations(timeDimension, ({ many }) => ({
	salesFacts: many(salesFact),
}));

export const salesFact = createTable(
	'sales_fact',
	{
		id: serial('id').notNull().primaryKey(),
		tax_payable: doublePrecision('tax_payable').notNull(),
		net_total: doublePrecision('net_total').notNull(),
		gross_total: doublePrecision('gross_total').notNull(),
		company_id: integer('company_id')
			.notNull()
			.references(() => companyDimension.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			})
			.notNull(),
		product_id: integer('product_id')
			.references(() => productDimension.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			})
			.notNull(),
		customer_id: integer('customer_id')
			.references(() => customerDimension.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			})
			.notNull(),
		geo_id: integer('geo_id')
			.references(() => geoDimension.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			})
			.notNull(),
		time_id: integer('time_id')
			.references(() => timeDimension.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			})
			.notNull(),
	},
	(salesFact) => ({
		company_idIdx: index('company_id_idx').on(salesFact.company_id),
		product_idIdx: index('product_id_idx').on(salesFact.product_id),
		customer_idIdx: index('customer_id_idx').on(salesFact.customer_id),
		geo_idIdx: index('geo_id_idx').on(salesFact.geo_id),
		time_idIdx: index('time_id_idx').on(salesFact.time_id),
	}),
);

export const salesFactRelations = relations(salesFact, ({ one }) => ({
	company: one(companyDimension, {
		fields: [salesFact.company_id],
		references: [companyDimension.id],
	}),
	product: one(productDimension, {
		fields: [salesFact.product_id],
		references: [productDimension.id],
	}),
	customer: one(customerDimension, {
		fields: [salesFact.customer_id],
		references: [customerDimension.id],
	}),
	geo: one(geoDimension, {
		fields: [salesFact.geo_id],
		references: [geoDimension.id],
	}),
	time: one(timeDimension, {
		fields: [salesFact.time_id],
		references: [timeDimension.id],
	}),
}));

export const users = createTable('user', {
	id: varchar('id', { length: 255 }).notNull().primaryKey(),
	name: varchar('name', { length: 255 }),
	password: varchar('password', { length: 255 }),
	email: varchar('email', { length: 255 }).notNull(),
	emailVerified: timestamp('emailVerified', {
		mode: 'date',
	}).default(sql`CURRENT_TIMESTAMP`),
	image: varchar('image', { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
	accounts: many(accounts),
}));

export const accounts = createTable(
	'account',
	{
		userId: varchar('userId', { length: 255 })
			.notNull()
			.references(() => users.id),
		type: varchar('type', { length: 255 })
			.$type<AdapterAccount['type']>()
			.notNull(),
		provider: varchar('provider', { length: 255 }).notNull(),
		providerAccountId: varchar('providerAccountId', {
			length: 255,
		}).notNull(),
		refresh_token: text('refresh_token'),
		refresh_token_expires_in: integer('refresh_token_expires_in'),
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		token_type: varchar('token_type', { length: 255 }),
		scope: varchar('scope', { length: 255 }),
		id_token: text('id_token'),
		session_state: varchar('session_state', { length: 255 }),
	},
	(account) => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId],
		}),
		userIdIdx: index('account_userId_idx').on(account.userId),
	}),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
	'session',
	{
		sessionToken: varchar('sessionToken', { length: 255 })
			.notNull()
			.primaryKey(),
		userId: varchar('userId', { length: 255 })
			.notNull()
			.references(() => users.id),
		expires: timestamp('expires', { mode: 'date' }).notNull(),
	},
	(session) => ({
		userIdIdx: index('session_userId_idx').on(session.userId),
	}),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
	'verificationToken',
	{
		identifier: varchar('identifier', { length: 255 }).notNull(),
		token: varchar('token', { length: 255 }).notNull(),
		expires: timestamp('expires', { mode: 'date' }).notNull(),
	},
	(vt) => ({
		compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
	}),
);
