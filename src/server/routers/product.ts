import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { ProductSortEnum, ProductSchema } from "../schema";
import { router, protectedProcedure } from "../trpc";

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
  create: protectedProcedure
    .input(
      z.object({
        data: ProductSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, sid } = ctx;
      const { data } = input;
      const { moreDescr, ...rest } = data;

      const payload = {
        ...rest,
        sid,
      };
      return await prisma.product.create({ data: payload });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        data: ProductSchema.partial(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      const { moreDescr, ...rest } = data;

      const update = {
        ...rest,
      };
      return ctx.prisma.product.update({ where: { id }, data: update });
    }),
});
