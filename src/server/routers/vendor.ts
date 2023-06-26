import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { vendorS } from "../zod";

import { router, protectedProcedure, adminProcedure } from "../trpc";
import { isAdmin } from "../utils";
import { customAlphabet, nanoid } from "nanoid";

export const vendorRouter = router({
  accounts: protectedProcedure
    .input(z.object({ all: z.boolean().optional() }))
    .query(async ({ ctx, input }) => {
      const uid = ctx.session.user.id;
      const vendor = await ctx.prisma.vendor.findFirst({
        where: { uid },
      });

      if (!vendor) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const stores = await ctx.prisma.store.findMany({
        where: {
          vendors: { some: { id: { equals: vendor?.id } } },
        },
        select: { name: true, id: true, status: true, vendors: true },
      });

      return stores;
    }),
  one: protectedProcedure
    .input(z.object({ vid: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const id = input.vid;
      const uid = ctx.session.user.id;
      return await ctx.prisma.vendor.findFirst({
        where: id ? { id } : { uid },
      });
    }),
  many: protectedProcedure
    .input(z.object({ limit: z.number() }))
    .query(async ({ ctx, input }) => {
      const { limit } = input;
      return await ctx.prisma.vendor.findMany({ take: limit });
    }),
  manyA: adminProcedure
    .input(z.object({ limit: z.number() }))
    .query(async ({ ctx, input }) => {
      const { limit } = input;
      return await ctx.prisma.vendor.findMany({ take: limit });
    }),
  update: protectedProcedure
    .input(z.object({ vid: z.string().optional(), data: vendorS.partial() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = isAdmin(ctx);
      const { vid, data } = input;

      if (data.email) {
        await prisma.store.updateMany({
          where: { vendors: { some: { id: vid } } },
          data: {
            vendors: {
              updateMany: {
                where: { id: vid },
                data: { email: data.email },
              },
            },
          },
        });
      }
      return await prisma.vendor.update({ where: { id: vid }, data });
    }),
  new: protectedProcedure
    .input(
      z.object({
        data: vendorS.partial({
          location: true,
          status: true,
          role: true,
          address: true,
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data } = input;
      const uid = nanoid(24);
      const vendorId = customAlphabet("1234567890delorand", 12)();
      return await ctx.prisma.vendor.create({
        data: { ...data, uid, vendorId },
      });
    }),
});
