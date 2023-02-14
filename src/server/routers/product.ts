import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const ProductSortEnum = z.enum([
  "title-asc",
  "title-desc",
  "price-asc",
  "price-desc",
  "stock-asc",
  "stock-desc",
  "sold-asc",
  "sold-desc",
  "search",
]);

export type ProductSort = z.infer<typeof ProductSortEnum>;

export const productRouter = router({
  count: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx, input }) => {
      const sid = ctx.sid;
      return await ctx.prisma.product.count({ where: { sid } });
    }),
  one: protectedProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.product.findUnique({ where: { id } });
    }),
  many: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(30).nullish(),
        cursor: z.any(),
        sort: ProductSortEnum.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, sort } = input;
      const limit = input.limit ?? 10;
      const sid = ctx.sid;
      const orderBy = {
        [sort?.split("-")[0] || ""]: sort?.split("-")[1] || "",
      };

      const dir = cursor?.direction;

      console.log(dir);

      const result = await ctx.prisma.product.findMany({
        where: { sid },
        take: dir === "asc" ? -(limit + 1) : limit + 1,
        cursor: cursor ? { id: cursor?.id } : undefined,
        orderBy: sort && sort !== "search" ? orderBy : { title: "asc" },
      });

      const hasNextMore = !(result.length < limit);
      const nextCursor =
        (hasNextMore && result[result.length - 1]?.id) || undefined;
      const prevCursor = result[0]?.id || undefined;
      return { products: result, cursor: { prevCursor, nextCursor } };
    }),
  update: protectedProcedure
    .input(z.object({ id: z.string().optional(), data: z.object({}) }))
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      return await ctx.prisma.product.update({ where: { id }, data });
    }),
});
