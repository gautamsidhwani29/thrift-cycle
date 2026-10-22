"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerUser, type RegisterResult } from "@/app/actions/auth";

const initialState: RegisterResult = {};

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerUser, initialState);
  return <form action={action} className="mt-8 space-y-4">
    <label className="block text-sm font-medium">Your name<input className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-4 py-3" name="name" autoComplete="name" required minLength={2} maxLength={80} /></label>
    <label className="block text-sm font-medium">Email<input className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-4 py-3" name="email" type="email" autoComplete="email" required /></label>
    <label className="block text-sm font-medium">Password<input className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-4 py-3" name="password" type="password" autoComplete="new-password" required minLength={8} /></label>
    {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
    {state.success && <p role="status" className="text-sm text-emerald-800">Account created. <Link className="underline" href="/login">Log in</Link> to continue.</p>}
    <button className="w-full rounded-full bg-emerald-900 px-5 py-3 font-semibold text-white disabled:opacity-60" disabled={pending}>{pending ? "Creating account…" : "Create account"}</button>
  </form>;
}
