import { z } from "zod";

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
  one: protectedProcedure.input(z.object({})).query(async ({ ctx, input }) => {
    const uid = ctx.session.user.id;
    return await ctx.prisma.vendor.findFirst({
      where: { uid },
    });
  }),
});
