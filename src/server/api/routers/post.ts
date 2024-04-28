import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from '@/server/api/trpc';
import { posts } from '@/server/db/schema';
import { parseString } from 'xml2js';
import { z } from 'zod';

import { convertStringToXML } from '@/lib/utils';

interface TOCOnline {
	Company: {
		CompanyID: string;
		CompanyName: string;
		CompanyAddress: {
			AddressDetail: string;
			City: string;
			PostalCode: string;
			Country: string;
		};
		FiscalYear: number;
		StartDate: string;
		EndDate: string;
	};
	Customers?: {
		Customer: {
			CustomerID: string;
			CompanyName: string;
			BillingAddress: {
				AddressDetail: string;
				City: string;
				PostalCode: string;
				Country: string;
			};
			Telephone: string;
			Email: string;
		}[];
	};
	Products?: {
		Product: {
			ProductID: string;
			ProductCategory: string;
			ProductName: string;
		}[];
	};
	Invoices?: {
		Invoice: {
			Hash: string;
			CustomerID: string;
			InvoiceDate: string;
			TaxPayable: number;
			NetTotal: number;
			GrossTotal: number;
			Line: {
				ProductID: string;
				ProductName: string;
				Quantity: number;
				UnitPrice: number;
				Amount: number;
			}[];
		}[];
	};
}

export const postRouter = createTRPCRouter({
	file: publicProcedure
		.input(z.object({ file: z.string() }))
		.mutation(({ input }) => {
			const xml = convertStringToXML(input.file);

			parseString(xml, (err, result: TOCOnline) => {
				if (err) {
					console.error('Error parsing XML:', err);
					return;
				}

				console.log(JSON.stringify(result, null, 2));
			});
		}),

	hello: publicProcedure
		.input(z.object({ text: z.string() }))
		.query(({ input }) => {
			return {
				greeting: `Hello ${input.text}`,
			};
		}),

	create: protectedProcedure
		.input(z.object({ name: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			// simulate a slow db call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			await ctx.db.insert(posts).values({
				name: input.name,
				createdById: ctx.session.user.id,
			});
		}),

	getLatest: publicProcedure.query(({ ctx }) => {
		return ctx.db.query.posts.findFirst({
			orderBy: (posts, { desc }) => [desc(posts.createdAt)],
		});
	}),

	getSecretMessage: protectedProcedure.query(() => {
		return 'you can now see this secret message!';
	}),
});
