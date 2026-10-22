import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default async function HomePage() {
  return <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-6">
    <SiteHeader />
    <section className="grid flex-1 items-center gap-12 py-16 md:grid-cols-2"><div><p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-emerald-800">A better life for good things</p><h1 className="text-5xl font-semibold leading-tight tracking-tight md:text-7xl">Pass it on. Keep it in play.</h1><p className="mt-6 max-w-lg text-lg leading-8 text-stone-600">A verified community for buying and selling pre-loved finds, with platform-managed orders from pickup to delivery.</p><div className="mt-9 flex gap-3"><Link className="rounded-full bg-emerald-900 px-6 py-3 font-semibold text-white" href="/browse">Explore listings</Link><Link className="rounded-full border border-stone-300 px-6 py-3 font-semibold" href="/register">Get started</Link></div></div><div className="rounded-[2rem] bg-[#dce9d7] p-10 md:p-14"><p className="text-sm font-bold uppercase tracking-widest text-emerald-900">The THRIFTCYCLE promise</p><div className="mt-8 space-y-5">{[["01", "Verified people", "Every member is reviewed before they can buy or sell."], ["02", "Thoughtful reuse", "Give useful things a new home and keep them out of landfill."], ["03", "Orders you can follow", "The platform manages each step from collection to delivery."]].map(([n, title, copy]) => <div key={n} className="flex gap-4"><span className="text-sm font-bold text-emerald-800">{n}</span><div><h2 className="font-semibold">{title}</h2><p className="mt-1 text-sm text-stone-600">{copy}</p></div></div>)}</div></div></section>
    <footer className="border-t border-stone-200 py-5 text-sm text-stone-500">THRIFTCYCLE · Give good things another life</footer>
  </main>;
}
