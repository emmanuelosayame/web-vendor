import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { orderStatusS, orderStatusSC } from "../zod";

export const orderRouter = router({
  one: protectedProcedure
    .input(z.object({ orderId: z.string().optional() }))
    .query(async ({ input, ctx }) => {
      const { orderId } = input;
      return await ctx.prisma.order.findFirst({ where: { orderId } });
    }),
  many: protectedProcedure
    .input(
      z.object({
        limit: z.number(),
        filter: orderStatusSC.optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const sid = ctx.sid;
      const { limit, filter } = input;
      return await ctx.prisma.order.findMany({
        where: {
          sid,
          status: filter === "all" ? undefined : filter || "pay_successful",
        },
        take: limit,
      });
    }),
  count: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx, input }) => {
      const sid = ctx.sid;
      return await ctx.prisma.order.count({ where: { sid } });
    }),
  update: protectedProcedure
    .input(
      z.object({
        orderId: z.string().optional(),
        status: orderStatusS,
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.order.updateMany({
        where: { orderId: input.orderId },
        data: { status: input.status },
      });
    }),
});
