import Link from "next/link";
import { requireRole } from "@/lib/authz";
import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/prisma";

const pretty = (value: string) => value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());

export default async function AdminPage() {
  const admin = await requireRole("ADMIN");
  const [verifiedUsers, needsVerification, liveListings, pendingListings, orders] = await Promise.all([
    prisma.user.count({ where: { role: "USER", verificationStatus: "VERIFIED" } }),
    prisma.user.count({ where: { role: "USER", verificationStatus: { not: "VERIFIED" } } }),
    prisma.listing.count({ where: { status: "APPROVED" } }),
    prisma.listing.findMany({ where: { status: "PENDING_REVIEW" }, include: { seller: { select: { name: true } }, category: true }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.order.findMany({ include: { listing: true, buyer: { select: { name: true } }, seller: { select: { name: true } } }, orderBy: { updatedAt: "desc" }, take: 5 }),
  ]);

  return <main className="min-h-screen bg-[#f7f8f2] text-[#20291f]">
    <SiteHeader />
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
      <Link href="/dashboard" className="text-sm font-medium text-emerald-900 hover:underline">← Back to account</Link>
      <div className="mt-8"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#719071]">Platform overview</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Welcome, {admin.name}.</h1><p className="mt-2 text-sm text-[#748071]">A live snapshot of the THRIFTCYCLE demo marketplace.</p></div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[["Verified members", verifiedUsers, "approved accounts"], ["Verification queue", needsVerification, "members to review"], ["Live listings", liveListings, "approved items"], ["Listing queue", pendingListings.length, "items to review"]].map(([title, value, detail]) => <section key={title} className="rounded-2xl border border-[#e4e9df] bg-white p-5"><p className="text-sm font-medium text-[#788275]">{title}</p><div className="mt-3 flex items-end justify-between gap-2"><span className="text-3xl font-semibold tracking-tight text-[#294631]">{value}</span><span className="pb-1 text-right text-xs text-[#97a092]">{detail}</span></div></section>)}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[1.6rem] border border-[#e4e9df] bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#81907d]">Moderation</p><h2 className="mt-1 text-xl font-semibold">Listings awaiting review</h2></div><span className="rounded-full bg-[#f7f0dc] px-3 py-1.5 text-xs font-semibold text-[#88703b]">{pendingListings.length} pending</span></div>
          {pendingListings.length ? <ul className="mt-4 divide-y divide-[#edf0e9]">{pendingListings.map((listing) => <li key={listing.id} className="flex items-center justify-between gap-4 py-4"><div className="min-w-0"><p className="truncate font-medium text-[#334234]">{listing.title}</p><p className="mt-1 text-xs text-[#879183]">{listing.category.name} · {listing.seller.name} · {listing.disposition === "DONATION" ? "Donation" : `₹${listing.price?.toLocaleString("en-IN")}`}</p></div><span className="shrink-0 rounded-full bg-[#f7f0dc] px-2.5 py-1.5 text-[11px] font-semibold text-[#88703b]">Pending review</span></li>)}</ul> : <p className="mt-6 rounded-xl bg-[#f7f8f4] p-5 text-sm text-[#788276]">The listing queue is clear.</p>}
        </section>

        <section className="rounded-[1.6rem] border border-[#e4e9df] bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#81907d]">Marketplace activity</p><h2 className="mt-1 text-xl font-semibold">Recent orders</h2></div><span className="rounded-full bg-[#f2f5ef] px-3 py-1.5 text-xs font-semibold text-[#70806c]">{orders.length} shown</span></div>
          {orders.length ? <ul className="mt-4 divide-y divide-[#edf0e9]">{orders.map((order) => <li key={order.id} className="py-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-medium text-[#334234]">{order.listing.title}</p><p className="mt-1 text-xs text-[#879183]">{order.buyer.name} · {order.paymentType === "DONATION" ? "Donation" : `₹${order.amount.toLocaleString("en-IN")}`}</p></div><span className="shrink-0 rounded-full bg-[#edf0eb] px-2.5 py-1.5 text-[11px] font-semibold text-[#62705f]">{pretty(order.status)}</span></div></li>)}</ul> : <p className="mt-6 rounded-xl bg-[#f7f8f4] p-5 text-sm text-[#788276]">No orders have been placed yet.</p>}
        </section>
      </div>
      <div className="mt-6 rounded-[1.4rem] border border-[#dfe8dc] bg-[#edf3e9] p-5 sm:p-6"><h2 className="font-semibold text-[#304b34]">Admin workspace</h2><p className="mt-1 text-sm leading-6 text-[#6b7968]">Verification decisions, listing approvals, and manual logistics controls will appear here as those workflows are enabled.</p><Link href="/browse" className="mt-4 inline-flex rounded-full border border-[#c9d9c6] bg-white px-4 py-2.5 text-sm font-semibold text-[#456a49] hover:bg-[#f7faf5]">View marketplace</Link></div>
    </div>
  </main>;
}
