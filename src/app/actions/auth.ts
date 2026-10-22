"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { credentialsSchema, registerSchema } from "@/lib/validation/auth";

export type RegisterResult = { error?: string; success?: boolean };

export async function registerUser(_previous: RegisterResult, formData: FormData): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Enter a name, valid email, and password of at least 8 characters." };

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email }, select: { id: true } });
  if (existing) return { error: "An account with this email already exists." };

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await prisma.user.create({
    data: { name: parsed.data.name, email: parsed.data.email, passwordHash },
    select: { id: true },
  });
  return { success: true };
}

export async function loginUser(_previous: RegisterResult, formData: FormData): Promise<RegisterResult> {
  const parsed = credentialsSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { error: "Enter a valid email and password." };
  try {
    await signIn("credentials", { ...parsed.data, redirectTo: "/dashboard" });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) return { error: "Email or password is incorrect." };
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  await signOut({ redirectTo: "/" });
}
