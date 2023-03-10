import { TRPCError } from "@trpc/server";
import { type Context } from "./trpc";

export const isAdmin = (ctx: Context, enforce?: boolean) => {
  const session = ctx.session;
  const role = session?.user.role;
  const admin = role === "admin";
  if (enforce && !admin) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return { ...ctx, admin };
};
