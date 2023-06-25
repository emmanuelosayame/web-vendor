import { z } from "zod";
import { vendorS } from "../zod";

import { router, protectedProcedure } from "../trpc";
import { isAdmin } from "../utils";

export const customerRouter = router({
  one: protectedProcedure
    .input(z.object({ cid: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { cid } = input;
      const uid = ctx.session.user.id;
      return await ctx.prisma.vendor.findFirst({
        where: { id: cid },
      });
    }),
  many: protectedProcedure
    .input(z.object({ limit: z.number() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = isAdmin(ctx, true);
      const { limit } = input;
      return await prisma.customer.findMany({ take: limit });
    }),
  count: protectedProcedure
    .input(z.object({ cid: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = isAdmin(ctx, true);
      return await prisma.customer.count();
    }),
  update: protectedProcedure
    .input(z.object({ vid: z.string().optional(), data: vendorS.partial() }))
    .mutation(async ({ ctx, input }) => {
      const { vid, data } = input;
      return await ctx.prisma.vendor.update({ where: { id: vid }, data });
    }),
  new: protectedProcedure
    .input(
      z.object({
        data: vendorS.partial({
          location: true,
          status: true,
          role: true,
          address: true,
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data } = input;
      return await ctx.prisma.vendor.create({ data });
    }),
});
