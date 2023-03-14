import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure, protectedProcedure, router } from "../trpc";

const Ntype = z.enum(["order", "support", "complaint", "all"]);
const NStatus = z.enum(["sealed", "opened"]);

const MutatePayload = z.object({
  status: NStatus,
  type: Ntype,
  body: z.string(),
  title: z.string(),
});

export const notificationRouter = router({
  many: protectedProcedure
    .input(
      z.object({
        ntype: Ntype,
        // parent: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.notification.findMany({ where: {} });
    }),
  one: adminProcedure
    .input(
      z.object({
        id: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.notification.findUnique({ where: { id } });
    }),
  update: adminProcedure
    .input(z.object({ id: z.string(), data: MutatePayload.shape.status }))
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      return await ctx.prisma.category.update({ where: { id }, data });
    }),
});
