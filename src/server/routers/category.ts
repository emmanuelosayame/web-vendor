import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure, protectedProcedure, router } from "../trpc";
import { categoryS } from "../zod";

export const categoryRouter = router({
  many: protectedProcedure
    .input(
      z.object({
        tid: z.number().max(3).optional(),
        parent: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { tid, parent } = input;
      if (parent) {
        return await ctx.prisma.category.findMany({ where: { parent } });
      } else if (tid) {
        return await ctx.prisma.category.findMany({ where: { tid } });
      } else throw new TRPCError({ code: "BAD_REQUEST" });
    }),
  one: adminProcedure
    .input(
      z.object({
        id: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.category.findUnique({ where: { id } });
    }),
  update: adminProcedure
    .input(z.object({ id: z.string(), data: categoryS.partial() }))
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      return await ctx.prisma.category.update({ where: { id }, data });
    }),
  create: adminProcedure
    .input(z.object({ data: categoryS }))
    .mutation(async ({ ctx, input }) => {
      const { data } = input;
      return await ctx.prisma.category.create({ data });
    }),
  delete: adminProcedure
    .input(z.object({ id: z.string().optional(), tid: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id, tid } = input;
      if (tid === 1 || tid === 2) {
        await ctx.prisma.category.delete({ where: { id } });
        await ctx.prisma.category.deleteMany({ where: { parent: id } });
      } else if (tid === 3) {
        await ctx.prisma.category.delete({ where: { id } });
      }
    }),
});
