import { string, z } from "zod";
import { ProductSchema, ProductSortEnum, ProductUpdateSchema } from "../schema";

import { router, protectedProcedure } from "../trpc";

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
      return await ctx.prisma.product.findUnique({
        where: { id },
        select: {
          title: true,
          brand: true,
          category: true,
          description: true,
          thumbnail: true,
          images: true,
          price: true,
          stock: true,
          status: true,
          tags: true,
          package: true,
          specs: true,
        },
      });
    }),
  many: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(30).nullish(),
        sort: ProductSortEnum.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { sort } = input;
      const limit = input.limit ?? 10;
      const sid = ctx.sid;
      const orderBy = {
        [sort?.split("-")[0] || ""]: sort?.split("-")[1] || "",
      };

      const result = await ctx.prisma.product.findMany({
        where: { sid },
        take: limit,
        orderBy: sort && sort !== "search" ? orderBy : { title: "asc" },
      });
      return result;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        data: ProductUpdateSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      const { imageFiles, ...rest } = data;

      const update = { ...rest };
      return await ctx.prisma.product.update({ where: { id }, data: {} });
    }),
});
