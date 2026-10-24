import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { LoginForm } from "./login-form";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const { callbackUrl } = await searchParams;
  const returnTo = callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//") ? callbackUrl : "/dashboard";
  return <><SiteHeader /><main className="mx-auto flex min-h-[calc(100vh-74px)] max-w-md flex-col justify-center px-6 py-12"><Link href="/" className="mb-8 text-sm font-medium text-emerald-900 hover:underline">← Back to home</Link><h1 className="text-3xl font-semibold">Welcome back</h1><p className="mt-2 text-stone-600">Log in to continue your cycle.</p><LoginForm callbackUrl={returnTo} /></main></>;
}
