import type { GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "./db";

/**
 * Module augmentation for `next-auth` types.
 * Allows us to add custom properties to the `session` object and keep type
 * safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      role: "vendor" | "admin";
    } & DefaultSession["user"];
  }

  interface User {
    // ...other properties
    role: "vendor" | "admin";
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user?.role === "admin") {
        token.role = "admin";
      }
      return token;
    },
    signIn: async ({ user }) => {
      const email = user.email || "";
      const vendor = await prisma.vendor.findFirst({ where: { email } });
      if (vendor && vendor.email === email) {
        if (vendor.role == "admin") user.role = "admin";
        if (!vendor.uid)
          await prisma.vendor.update({
            where: { email },
            data: { uid: user.id },
          });
        return true;
      } else return false;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        if (token.role === "admin") session.user.role = token.role;
      }
      return session;
    },
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    error: "/auth/error",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the
 * `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
