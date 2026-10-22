import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return <><SiteHeader /><main className="mx-auto flex min-h-[calc(100vh-74px)] max-w-md flex-col justify-center px-6 py-12"><Link href="/" className="mb-8 text-sm font-medium text-emerald-900 hover:underline">← Back to home</Link><h1 className="text-3xl font-semibold">Join THRIFTCYCLE</h1><p className="mt-2 text-stone-600">Create an account to buy, sell, and keep good things moving.</p><RegisterForm /></main></>;
}
