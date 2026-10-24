import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { requireUser } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

const label = (value: string) => value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());

export default async function MyListingsPage() {
  const user = await requireUser();
  if (user.role === "ADMIN") redirect("/admin");
  const listings = await prisma.listing.findMany({
    where: { sellerId: user.id }, include: { category: true }, orderBy: { updatedAt: "desc" },
  });
  return <main className="min-h-screen bg-[#f7f8f2] text-[#20291f]"><SiteHeader />
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <Link href="/dashboard" className="text-sm font-medium text-emerald-900 hover:underline">← Dashboard</Link>
      <div className="mt-7 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#719071]">Seller workspace</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#203c2a] sm:text-4xl">My listings</h1><p className="mt-2 text-sm text-[#748071]">Track review and availability for the items you’ve shared.</p></div><span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#526b53]">{listings.length} total</span></div>
      {listings.length ? <div className="mt-7 grid gap-4 sm:grid-cols-2">{listings.map((listing) => <article key={listing.id} className="rounded-2xl border border-[#e4e9df] bg-white p-5">
        <div className="flex items-start justify-between gap-4"><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wider text-[#81907d]">{listing.category.name} · {label(listing.condition)}</p><h2 className="mt-2 truncate text-lg font-semibold">{listing.title}</h2></div><span className="shrink-0 rounded-full bg-[#f2f5ef] px-3 py-1.5 text-xs font-semibold text-[#526b53]">{label(listing.status)}</span></div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#788276]">{listing.description}</p>
        <div className="mt-4 flex items-center justify-between border-t border-[#edf0e9] pt-4"><span className="font-semibold text-[#27563a]">{listing.disposition === "DONATION" ? "Free" : `₹${listing.price?.toLocaleString("en-IN")}`}</span>{listing.status === "APPROVED" && <Link href={`/listing/${listing.id}`} className="text-sm font-semibold text-emerald-900 underline">View listing</Link>}</div>
      </article>)}</div> : <section className="mt-7 rounded-3xl border border-dashed border-[#ccd6c9] bg-white px-6 py-16 text-center"><h2 className="text-lg font-semibold text-[#344537]">You haven’t shared anything yet</h2><p className="mt-2 text-sm text-[#788276]">Your listings will appear here after you create them.</p><p className="mt-4 text-xs text-[#99a093]">Listing creation is not enabled in this demo yet.</p></section>}
    </div>
  </main>;
}
