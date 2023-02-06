import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const productRouter = router({
  getSecretMessage: protectedProcedure.query(async ({ input, ctx }) => {
    const data = await ctx.prisma.verificationToken.findMany();
    return "you can now see this secret message!";
  }),
});
