import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

const OrderStatusSchema = z.enum([
  "pending",
  "successful",
  "failed",
  "cancelled",
  "closedPay",
]);

const FilterSchema = z
  .enum(["successful", "failed", "cancelled", "closedPay"])
  .optional();

export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export type Filter = z.infer<typeof FilterSchema>;

export const orderRouter = router({
  one: protectedProcedure
    .input(z.object({ orderId: z.string().optional() }))
    .query(async ({ input, ctx }) => {
      const { orderId } = input;
      return await ctx.prisma.order.findFirst({ where: { orderId } });
    }),
  many: protectedProcedure
    .input(z.object({ limit: z.number(), filter: FilterSchema }))
    .query(async ({ input, ctx }) => {
      const sid = ctx.sid;
      const { limit, filter } = input;
      return await ctx.prisma.order.findMany({
        where: { sid, status: filter || "successful" },
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
        status: OrderStatusSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.order.updateMany({
        where: { orderId: input.orderId },
        data: { status: input.status },
      });
    }),
});
