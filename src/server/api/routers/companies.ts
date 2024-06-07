import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { companies } from '@/server/db/relational-schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const companiesRouter = createTRPCRouter({
    getCompanies: protectedProcedure.query(({ ctx }) => {
        return ctx.db.relational.selectDistinct().from(companies);
    }),

    getCompany: protectedProcedure
        .input(z.object({ text: z.string() }))
        .query(({ input, ctx }) => {
            return ctx.db.star
                .select()
                .from(companies)
                .where(eq(companies.name, input.text));
        }),
});
