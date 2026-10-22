import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { credentialsSchema } from "@/lib/validation/auth";
import authConfig from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: { email: {}, password: { type: "password" } },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;
        const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
        if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) return null;
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role === "ADMIN" ? "ADMIN" : "USER",
          verificationStatus: user.verificationStatus,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.verificationStatus = user.verificationStatus;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.role = token.role === "ADMIN" ? "ADMIN" : "USER";
        session.user.verificationStatus = typeof token.verificationStatus === "string"
          ? token.verificationStatus
          : "UNVERIFIED";
      }
      return session;
    },
  },
});
