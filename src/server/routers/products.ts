import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const productRouter = router({
  count: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.product.count({});
    }),
  one: protectedProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.product.findUnique({ where: { id } });
    }),
  many: protectedProcedure
    .input(
      z.object({ limit: z.number().min(1).max(30).nullish(), cursor: z.any() })
    )
    .query(async ({ ctx, input }) => {
      const { cursor } = input;
      const limit = input.limit ?? 10;
      const result = await ctx.prisma.product.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
      });
      const hasMore = !(result.length < limit);
      const nextCursor = hasMore && result[result.length - 1]?.id;
      return { products: result, cursor: nextCursor };
    }),
  update: protectedProcedure
    .input(z.object({ id: z.string().optional(), data: z.object({}) }))
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      return await ctx.prisma.product.update({ where: { id }, data });
    }),
});
