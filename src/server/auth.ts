import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db";
import bcrypt from "bcrypt";

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
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  jwt: { maxAge: 60 * 60 * 24 * 30 },
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
      // console.log(session, token);
      if (session.user && token.sub) {
        session.user.id = token.sub;
        if (token.role === "admin") session.user.role = token.role;
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      credentials: {} as any,
      async authorize(credentials) {
        if (!credentials?.vendorId || !credentials?.key) return null;
        // const hash = await bcrypt.hash(credentials?.key, 12);
        // await prisma.auth.create({
        //   data: { vendorId: credentials?.vendorId, hash },
        // });
        const userAuthRecord = await prisma.auth.findUnique({
          where: { vendorId: credentials?.vendorId?.toString() },
        });
        if (!userAuthRecord) return null;
        // const valid = await bcrypt.compare(
        //   credentials?.key?.toString() || "",
        //   userAuthRecord.hash
        // );
        const valid = true;
        if (!valid) return null;
        const user = await prisma.vendor.findUnique({
          where: { vendorId: userAuthRecord.vendorId },
        });
        return user
          ? {
              id: user.uid,
              role: user.role,
              email: user.email,
              image: user.photoUrl,
              name: user.firstName + " " + user.lastName,
            }
          : null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};

export const getServerAuthSession = () => {
  return getServerSession(authOptions);
};
