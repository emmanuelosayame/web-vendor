// import sum from "lodash/sum";
// import { nanoid } from "nanoid";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const orderRouter = router({
  one: protectedProcedure
    .input(z.object({ orderId: z.string().optional() }))
    .query(async ({ input, ctx }) => {
      const { orderId } = input;
      return await ctx.prisma.order.findFirst({ where: { orderId } });
    }),
  many: protectedProcedure
    .input(z.object({ customerId: z.string().optional(), limit: z.number() }))
    .query(async ({ input, ctx }) => {
      const { customerId, limit } = input;
      return await ctx.prisma.order.findMany({
        where: { customerId },
        take: limit,
      });
    }),
  count: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx, input }) => {
      const sid = ctx.sid;
      return await ctx.prisma.order.count();
    }),
  update: protectedProcedure
    .input(
      z.object({
        orderId: z.string().optional(),
        status: z.enum([
          "pending",
          "successful",
          "failed",
          "cancelled",
          "closedPay",
        ]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.order.updateMany({
        where: { orderId: input.orderId },
        data: { status: input.status },
      });
    }),
});
