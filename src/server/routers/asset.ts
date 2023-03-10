import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { AssetPayload } from "../schema";
import { adminProcedure, protectedProcedure, router } from "../trpc";

export const assetRouter = router({
  one: adminProcedure
    .input(
      z.object({
        basepath: z.string().optional(),
        path: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { basepath, path } = input;

      return await ctx.prisma.asset.findFirst({
        where: { AND: [{ basepath }, { path }] },
      });
    }),
  // many: adminProcedure
  //   .input(
  //     z.object({
  //       tid: z.number().max(3).optional(),
  //       parent: z.string().optional(),
  //     })
  //   )
  //   .query(async ({ ctx, input }) => {
  //     const { tid, parent } = input;
  //     if (parent) {
  //       return await ctx.prisma.category.findMany({ where: { parent } });
  //     } else if (tid) {
  //       return await ctx.prisma.category.findMany({ where: { tid } });
  //     } else throw new TRPCError({ code: "BAD_REQUEST" });
  //   }),
  update: adminProcedure
    .input(z.object({ id: z.string(), data: AssetPayload.partial() }))
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      return await ctx.prisma.asset.update({ where: { id }, data });
    }),
  create: adminProcedure
    .input(z.object({ data: AssetPayload }))
    .mutation(async ({ ctx, input }) => {
      const { data } = input;
      return await ctx.prisma.asset.create({ data });
    }),
  // delete: adminProcedure
  //   .input(z.object({ id: z.string().optional(), tid: z.number() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const { id, tid } = input;
  //     if (tid === 1 || tid === 2) {
  //       await ctx.prisma.category.delete({ where: { id } });
  //       await ctx.prisma.category.deleteMany({ where: { parent: id } });
  //     } else if (tid === 3) {
  //       await ctx.prisma.category.delete({ where: { id } });
  //     }
  //   }),
});
