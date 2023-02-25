import { z } from "zod";
import { VendorData } from "../schema";

import { router, protectedProcedure } from "../trpc";

export const vendorRouter = router({
  accounts: protectedProcedure.input(z.object({})).query(async ({ ctx }) => {
    const uid = ctx.session.user.id;
    const vendor = await ctx.prisma.vendor.findFirst({
      where: { uid },
    });

    const stores = await ctx.prisma.store.findMany({
      where: { vendors: { some: { id: { equals: vendor?.id || "" } } } },
      select: { name: true, id: true },
    });

    return stores;
  }),
  one: protectedProcedure
    .input(z.object({ vid: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const id = input.vid;
      const uid = ctx.session.user.id;
      return await ctx.prisma.vendor.findFirst({
        where: id ? { id } : { uid },
      });
    }),
  many: protectedProcedure
    .input(z.object({ limit: z.number() }))
    .query(async ({ ctx, input }) => {
      const { limit } = input;
      return await ctx.prisma.vendor.findMany({ take: limit });
    }),
  update: protectedProcedure
    .input(z.object({ vid: z.string().optional(), data: VendorData.partial() }))
    .mutation(async ({ ctx, input }) => {
      const { vid, data } = input;
      return await ctx.prisma.vendor.update({ where: { id: vid }, data });
    }),
  new: protectedProcedure
    .input(
      z.object({
        data: VendorData.partial({
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
