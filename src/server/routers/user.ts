import { z } from "zod";

import { router, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = router({
  one: protectedProcedure.input(z.object({})).query(async ({ ctx, input }) => {
    const id = ctx.session.user.id;

    // console.log(id);

    return "";
  }),
});
