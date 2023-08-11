import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";
import { cookies } from "next/headers";

import { getServerAuthSession } from "./auth";
import { prisma } from "./db";

type CreateContextOptions = {
  session: Session | null;
  sid: string | undefined;
  req: Request;
};

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
    sid: opts.sid,
    req: opts.req,
  };
};

export const createTRPCContext = async (opts: {
  req: Request;
  resHeaders: Headers;
}) => {
  const { req } = opts;

  // Get the session from the server using the getServerSession wrapper function
  const session = await getServerAuthSession();

  const sid = cookies().get("sid")?.value;

  return createInnerTRPCContext({
    session,
    sid,
    req,
  });
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and
 * transformer.
 */
import { type inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server";

export type Context = inferAsyncReturnType<typeof createTRPCContext>;

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape }) {
    return shape;
  },
});

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

const enforceUserIsAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.session || ctx.session.user.role !== "admin") {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

export const adminProcedure = t.procedure.use(enforceUserIsAdmin);
