import { z } from "zod";
import { StoreSchema } from "../schema";

import { router, protectedProcedure } from "../trpc";
import { isAdmin } from "./utils";

export const storeRouter = router({
  one: protectedProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { prisma, admin, session, sid } = isAdmin(ctx);
      if (admin) {
        return await prisma.store.findFirst({
          where: { id: input.id },
        });
      }
      const id = sid;
      const uid = session && session.user.id;
      if (!id) return null;
      const merchant = await ctx.prisma.vendor.findFirst({
        where: { uid },
      });
      return await ctx.prisma.store.findFirst({
        where: {
          AND: [
            { vendors: { some: { id: { equals: merchant?.id } } } },
            { id },
          ],
        },
      });
    }),
  many: protectedProcedure
    .input(z.object({ limit: z.number() }))
    .query(async ({ ctx, input }) => {
      const prisma = isAdmin(ctx, true).prisma;
      const { limit } = input;
      return await prisma.store.findMany({ take: limit });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        data: StoreSchema.partial(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = isAdmin(ctx, true);
      const { id, data } = input;
      return await prisma.store.update({ where: { id }, data: data });
    }),
  new: protectedProcedure
    .input(
      z.object({
        data: StoreSchema.partial({ photoUrl: true }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = isAdmin(ctx, true);
      const { data } = input;
      return await prisma.store.create({ data: data });
    }),
});
