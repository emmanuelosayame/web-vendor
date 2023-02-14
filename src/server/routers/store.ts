import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const storeRouter = router({
  one: protectedProcedure.input(z.object({})).query(async ({ ctx, input }) => {
    const id = ctx.sid;
    const uid = ctx.session.user.id;
    if (!id) return null;
    const merchant = await ctx.prisma.vendor.findFirst({
      where: { uid },
    });
    return await ctx.prisma.store.findFirst({
      where: {
        AND: [{ vendors: { some: { id: { equals: merchant?.id } } } }, { id }],
      },
    });
  }),
});
