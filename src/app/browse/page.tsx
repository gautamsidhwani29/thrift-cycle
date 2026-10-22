import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { ListingGrid } from "./listing-grid";

export default function BrowsePage() {
  return <main className="min-h-screen bg-[#f7f8f2] text-[#20291f]">
    <SiteHeader />
    <section className="mx-auto max-w-7xl px-5 pb-7 pt-8 sm:px-8 sm:pb-10 sm:pt-12 lg:px-10">
      <Link href="/" className="text-xs font-medium text-[#788276] transition hover:text-emerald-900">← Home</Link>
      <div className="mt-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#719071]">Good things, ready for you</p><h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#203c2a] sm:text-5xl">Find your next favourite.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#738070] sm:text-base">Shop pre-loved finds or pick up something useful for free. Every seller is part of our verified community.</p></div>
        <Link href="/partners" className="inline-flex items-center gap-2 self-start rounded-full border border-[#dce3d8] bg-white px-4 py-2.5 text-sm font-semibold text-[#47644a] transition hover:border-[#b9cdb8] hover:bg-[#f1f5ed] md:self-auto">Need a repair or recycle option? <span aria-hidden="true">↗</span></Link>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10"><ListingGrid /></section>
  </main>;
}
