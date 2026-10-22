import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function NotFoundPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[65vh] max-w-3xl flex-col items-start justify-center px-6 py-16">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-800">404 · Nothing here</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">We couldn’t find that page.</h1>
        <p className="mt-3 text-stone-600">Use the navigation above, or head back to the marketplace.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/" className="rounded-full bg-emerald-900 px-5 py-3 text-sm font-semibold text-white">Go home</Link>
          <Link href="/browse" className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold">Browse finds</Link>
        </div>
      </main>
    </>
  );
}
