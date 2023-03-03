import { z } from "zod";
import { StoreSchema } from "../schema";

import { router, protectedProcedure } from "../trpc";
import { isAdmin } from "./utils";

export const storeRouter = router({
  one: protectedProcedure.input(z.object({})).query(async ({ ctx, input }) => {
    const { prisma, session, sid } = ctx;

    const id = sid;
    const uid = session && session.user.id;
    if (!id) return null;
    const merchant = await ctx.prisma.vendor.findFirst({
      where: { uid },
    });
    return await ctx.prisma.store.findFirst({
      where: {
        AND: [{ vendors: { some: { id: { equals: merchant?.id } } } }, { id }],
      },
    });
  }),
  oneA: protectedProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = isAdmin(ctx, true);
      return await prisma.store.findFirst({
        where: { id: input.id },
      });
    }),
  many: protectedProcedure
    .input(z.object({ limit: z.number() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = isAdmin(ctx);
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
      const { prisma } = isAdmin(ctx);
      const { id, data } = input;
      return await prisma.store.update({ where: { id }, data: data });
    }),
  new: protectedProcedure
    .input(
      z.object({
        data: StoreSchema.partial({
          vendors: true,
          email: true,
          photoUrl: true,
          status: true,
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = isAdmin(ctx);
      const { data } = input;
      return await prisma.store.create({ data });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = isAdmin(ctx, true);
      return await prisma.store.delete({
        where: { id: input.id },
      });
    }),
});
