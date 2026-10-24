"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { demoListings } from "@/lib/demo-listings";

const categories = [...new Set(demoListings.map((listing) => listing.category))].sort();

export function ListingGrid({ availableIds }: { availableIds: string[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [disposition, setDisposition] = useState("ALL");
  const [maxPrice, setMaxPrice] = useState(5000);

  const results = useMemo(() => demoListings.filter((listing) => availableIds.includes(listing.id)).filter((listing) => {
    const matchesQuery = `${listing.title} ${listing.category} ${listing.city} ${listing.note}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesCategory = category === "All categories" || listing.category === category;
    const matchesDisposition = disposition === "ALL" || listing.disposition === disposition;
    const matchesPrice = listing.disposition === "DONATION" || (listing.price ?? 0) <= maxPrice;
    return matchesQuery && matchesCategory && matchesDisposition && matchesPrice;
  }), [availableIds, query, category, disposition, maxPrice]);

  return <>
    <section className="rounded-[1.75rem] border border-[#e5e9df] bg-white p-4 shadow-sm sm:p-5">
      <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#798275]" htmlFor="listing-search">Search the marketplace</label>
      <div className="mt-2 grid gap-3 md:grid-cols-[minmax(220px,1fr)_repeat(3,minmax(145px,190px))]">
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#7c8877]" aria-hidden="true">⌕</span>
          <input id="listing-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try ‘lamp’ or ‘books’" className="h-12 w-full rounded-xl border border-[#e3e8df] bg-[#fafbf8] pl-11 pr-4 text-sm outline-none transition placeholder:text-[#9ba397] focus:border-[#85a885] focus:bg-white focus:ring-2 focus:ring-[#dce9dc]" />
        </div>
        <label className="sr-only" htmlFor="category-filter">Category</label>
        <select id="category-filter" value={category} onChange={(event) => setCategory(event.target.value)} className="h-12 rounded-xl border border-[#e3e8df] bg-[#fafbf8] px-3 text-sm text-[#4e5b4d] outline-none focus:border-[#85a885] focus:ring-2 focus:ring-[#dce9dc]"><option>All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select>
        <label className="sr-only" htmlFor="disposition-filter">Listing type</label>
        <select id="disposition-filter" value={disposition} onChange={(event) => setDisposition(event.target.value)} className="h-12 rounded-xl border border-[#e3e8df] bg-[#fafbf8] px-3 text-sm text-[#4e5b4d] outline-none focus:border-[#85a885] focus:ring-2 focus:ring-[#dce9dc]"><option value="ALL">Resale & donation</option><option value="RESALE">For sale</option><option value="DONATION">Free to a good home</option></select>
        <label className="sr-only" htmlFor="price-filter">Maximum price</label>
        <select id="price-filter" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} className="h-12 rounded-xl border border-[#e3e8df] bg-[#fafbf8] px-3 text-sm text-[#4e5b4d] outline-none focus:border-[#85a885] focus:ring-2 focus:ring-[#dce9dc]"><option value={5000}>Any price</option><option value={500}>Up to ₹500</option><option value={1000}>Up to ₹1,000</option><option value={2000}>Up to ₹2,000</option></select>
      </div>
    </section>

    <div className="mt-7 flex items-center justify-between gap-4">
      <p className="text-sm text-[#778174]"><span className="font-semibold text-[#344537]">{results.length} finds</span> ready for another round</p>
      <span className="hidden text-xs text-[#99a093] sm:inline">New finds added regularly</span>
    </div>

    {results.length ? <div className="mt-4 grid gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {results.map((listing) => <article key={listing.id} className="group min-w-0">
        <Link href={`/listing/${listing.id}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-4 rounded-[1.3rem]">
          <div className={`relative grid aspect-[4/3] place-items-center overflow-hidden rounded-[1.3rem] bg-gradient-to-br ${listing.artwork}`}>
            <div aria-hidden="true" className="absolute -right-10 -top-10 size-40 rounded-full border border-white/40" />
            <div aria-hidden="true" className="absolute -bottom-16 -left-8 size-48 rounded-full bg-white/20 blur-xl" />
            <span aria-hidden="true" className="relative drop-shadow-sm transition duration-300 group-hover:scale-110 text-[5.5rem] sm:text-[6rem]">{listing.emoji}</span>
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-[#4a5d4b] shadow-sm backdrop-blur">{listing.disposition === "DONATION" ? "Free · Donation" : "Verified seller"}</span>
            <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#465546] shadow-sm backdrop-blur">{listing.disposition === "DONATION" ? "Free" : `₹${listing.price?.toLocaleString("en-IN")}`}</span>
          </div>
          <div className="px-1 pt-3">
            <div className="flex items-center justify-between gap-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[#859080]"><span>{listing.category}</span><span>{listing.condition}</span></div>
            <h2 className="mt-1.5 truncate text-base font-semibold text-[#2b382d] transition group-hover:text-[#326342]">{listing.title}</h2>
            <div className="mt-1 flex items-center justify-between gap-3 text-xs text-[#849080]"><span>{listing.note}</span><span className="shrink-0">{listing.city}</span></div>
          </div>
        </Link>
      </article>)}
    </div> : <div className="mt-5 rounded-3xl border border-dashed border-[#ccd6c9] bg-white px-6 py-16 text-center"><span className="text-3xl" aria-hidden="true">⌕</span><h2 className="mt-3 text-lg font-semibold text-[#344537]">No finds match those filters</h2><p className="mt-1 text-sm text-[#788276]">Try another search or widen your price range.</p><button type="button" onClick={() => { setQuery(""); setCategory("All categories"); setDisposition("ALL"); setMaxPrice(5000); }} className="mt-5 rounded-full border border-[#d9e0d5] px-4 py-2 text-sm font-semibold text-[#416347] transition hover:bg-[#f2f5ef]">Clear filters</button></div>}
  </>;
}
