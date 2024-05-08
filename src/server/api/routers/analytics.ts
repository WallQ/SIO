import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { customerDimension, salesFact } from '@/server/db/schema';
import { eq, sql } from 'drizzle-orm';

export const analyticsRouter = createTRPCRouter({
	customersByRevenue: protectedProcedure.query(({ ctx }) => {
		return ctx.db
			.select({
				name: customerDimension.name,
				revenue: sql<number>`sum(${salesFact.gross_total})`,
			})
			.from(salesFact)
			.innerJoin(
				customerDimension,
				eq(salesFact.customer_id, customerDimension.id),
			)
			.groupBy(customerDimension.name)
			.orderBy(sql`sum(${salesFact.gross_total}) DESC`)
			.limit(6);
	}),
});
