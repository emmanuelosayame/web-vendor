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
      const uid = ctx.session.user.id;

      const { ntype } = input;

      return await ctx.prisma.notification.findMany({
        where: {
          AND: [
            { recipient: { some: { id: uid } } },
            ntype !== "all" ? { type: ntype } : {},
          ],
        },
      });
    }),
  manyA: adminProcedure
    .input(
      z.object({
        ntype: Ntype,
        // parent: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.notification.findMany({ where: {} });
    }),
  count: protectedProcedure
    .input(
      z.object({
        ntype: Ntype,
        // parent: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.notification.findMany({ where: {} });
    }),
  one: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.notification.findUnique({ where: { id } });
    }),
  update: protectedProcedure
    .input(z.object({ id: z.string(), data: MutatePayload.shape.status }))
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      return await ctx.prisma.category.update({ where: { id }, data });
    }),
  open: protectedProcedure
    .input(z.string().optional())
    .mutation(async ({ ctx, input }) => {
      const uid = ctx.session.user.id;
      return await ctx.prisma.notification.update({
        where: { id: input },
        data: {
          recipient: {
            updateMany: {
              where: { id: uid },
              data: { opened: new Date(), status: "opened" },
            },
          },
        },
      });
    }),
  unreadCount: protectedProcedure
    .input(z.undefined())
    .query(async ({ ctx, input }) => {
      const uid = ctx.session.user.id;

      return await ctx.prisma.notification.count({
        where: {
          recipient: {
            some: {
              AND: [{ id: uid }, { status: "closed" }],
            },
          },
        },
      });
    }),
});
