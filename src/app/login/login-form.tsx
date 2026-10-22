"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginUser, type RegisterResult } from "@/app/actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginUser, {} satisfies RegisterResult);
  return <form action={action} className="mt-8 space-y-4">
    <label className="block text-sm font-medium">Email<input className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-4 py-3" name="email" type="email" autoComplete="email" required /></label>
    <label className="block text-sm font-medium">Password<input className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-4 py-3" name="password" type="password" autoComplete="current-password" required /></label>
    {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
    <button className="w-full rounded-full bg-emerald-900 px-5 py-3 font-semibold text-white disabled:opacity-60" disabled={pending}>{pending ? "Signing in…" : "Log in"}</button>
    <p className="text-center text-sm text-stone-600">New here? <Link className="font-semibold text-emerald-900 underline" href="/register">Create an account</Link></p>
  </form>;
}
