import { z } from "zod";

import { router, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = router({
  one: protectedProcedure
    .input(z.object({ storeId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { storeId } = input;
      return await ctx.prisma.store.findUnique({ where: { id: storeId } });
    }),
});
