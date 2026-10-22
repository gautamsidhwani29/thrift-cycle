import type { DefaultSession } from "next-auth";
type UserRole = "USER" | "ADMIN";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: UserRole;
      verificationStatus: string;
    };
  }

  interface User {
    role: UserRole;
    verificationStatus: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    verificationStatus: string;
  }
}
