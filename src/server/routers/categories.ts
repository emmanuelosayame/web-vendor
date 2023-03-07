import { z } from "zod";
import { adminProcedure, protectedProcedure, router } from "../trpc";

const MutatePayload = z.object({
  parent: z.string().nullable(),
  name: z.string(),
  slug: z.string(),
  tid: z.number(),
});

export const categoriesRouter = router({
  many: protectedProcedure
    .input(z.number().max(3))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.category.findMany({ where: { tid: input } });
    }),
  update: adminProcedure
    .input(z.object({ id: z.string(), data: MutatePayload.partial() }))
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      return await ctx.prisma.category.update({ where: { id }, data });
    }),
  create: adminProcedure
    .input(z.object({ data: MutatePayload }))
    .mutation(async ({ ctx, input }) => {
      const { data } = input;
      return await ctx.prisma.category.create({ data });
    }),
  delete: adminProcedure
    .input(z.object({ id: z.string().optional(), tid: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id, tid } = input;
      if (tid === 1) {
        await ctx.prisma.category.delete({ where: { id } });
        await ctx.prisma.category.deleteMany({ where: { parent: id } });
      } else if (tid === 2) {
        await ctx.prisma.category.delete({ where: { id } });
      }
    }),
});
