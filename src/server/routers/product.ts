import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { ProductSortEnum } from "../zod";
import { router, protectedProcedure, adminProcedure } from "../trpc";

export const productRouter = router({
  count: protectedProcedure.input(z.object({})).query(async ({ ctx }) => {
    const sid = ctx.sid;
    return await ctx.prisma.product.count({ where: { sid } });
  }),
  countA: adminProcedure.input(z.object({})).query(async ({ ctx }) => {
    return await ctx.prisma.product.count();
  }),
  one: protectedProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const sid = ctx.sid;
      const data = await ctx.prisma.product.findUnique({
        where: { id },
      });
      if (data?.sid === sid) {
        return data;
      }
      throw new TRPCError({ code: "FORBIDDEN" });
    }),
  many: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(30).nullish(),
        sort: ProductSortEnum.optional(),
        pagn: z.number().max(11),
      })
    )
    .query(async ({ ctx, input }) => {
      const { sort, pagn } = input;
      const limit = input.limit ?? 10;
      const sid = ctx.sid;
      const orderBy = {
        [sort?.split("-")[0] || ""]: sort?.split("-")[1] || "",
      };

      const result = await ctx.prisma.product.findMany({
        where: { sid },
        skip: (pagn - 1) * limit,
        take: limit,
        orderBy: sort && sort !== "search" ? orderBy : { title: "asc" },
      });
      return result;
    }),
  manyA: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(30).nullish(),
        sort: ProductSortEnum.optional(),
        pagn: z.number().max(11),
      })
    )
    .query(async ({ ctx, input }) => {
      const { sort, pagn } = input;
      const limit = input.limit ?? 10;
      const orderBy = {
        [sort?.split("-")[0] || ""]: sort?.split("-")[1] || "",
      };

      const result = await ctx.prisma.product.findMany({
        skip: (pagn - 1) * limit,
        take: limit,
        orderBy: sort && sort !== "search" ? orderBy : { title: "asc" },
      });
      return result;
    }),
  delete: protectedProcedure
    .input(z.object({ pid: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { pid } = input;
      return await ctx.prisma.product.delete({ where: { id: pid } });
    }),
});
