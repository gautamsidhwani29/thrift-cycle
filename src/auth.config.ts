import type { NextAuthConfig } from "next-auth";

const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
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
} satisfies NextAuthConfig;

export default authConfig;
