import { timeDimension } from "@/server/db/star-schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { invoices } from "@/server/db/relational-schema";

export const yearsRouter = createTRPCRouter({
    getYears: protectedProcedure.query(({ ctx }) => {
        return ctx.db.relational
            .selectDistinct({ year: sql<number>`EXTRACT(YEAR FROM ${invoices.date})`.as(`year`) })
            .from(invoices)
    }),
});
