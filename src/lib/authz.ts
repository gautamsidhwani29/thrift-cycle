import "server-only";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true, verificationStatus: true },
  });
  if (!currentUser) redirect("/login");
  return currentUser;
}

export async function requireRole(role: string) {
  const user = await requireUser();
  if (user.role !== role) redirect("/dashboard");
  return user;
}

export async function requireVerifiedUser() {
  const user = await requireUser();
  if (user.role !== "ADMIN" && user.verificationStatus !== "VERIFIED") {
    redirect("/dashboard/verification");
  }
  return user;
}
