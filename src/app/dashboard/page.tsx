import Link from "next/link";
import { requireUser } from "@/lib/authz";
import { logoutUser } from "@/app/actions/auth";
import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const label = (value: string) => value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
const statusStyle = (status: string) => status === "COMPLETED" || status === "DELIVERED" || status === "VERIFIED"
  ? "bg-[#e8f2e6] text-[#3f7042]"
  : status === "UNVERIFIED" || status === "PENDING_REVIEW" || status === "COLLECTION_SCHEDULED"
    ? "bg-[#f7f0dc] text-[#88703b]"
    : "bg-[#edf0eb] text-[#62705f]";

export default async function DashboardPage() {
  const user = await requireUser();
  if (user.role === "ADMIN") redirect("/admin");
  const [orders, listingCount] = await Promise.all([
    prisma.order.findMany({
      where: { OR: [{ buyerId: user.id }, { sellerId: user.id }] },
      include: { listing: { include: { category: true } }, buyer: { select: { name: true } }, seller: { select: { name: true } }, events: { orderBy: { createdAt: "desc" }, take: 1 } },
      orderBy: { updatedAt: "desc" }, take: 4,
    }),
    prisma.listing.count({ where: { sellerId: user.id } }),
  ]);
  const activeOrders = orders.filter((order) => !["COMPLETED", "DELIVERED", "CANCELLED"].includes(order.status)).length;

  return <main className="min-h-screen bg-[#f7f8f2] text-[#20291f]">
    <SiteHeader />
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
      <div className="flex items-center justify-between gap-4"><Link href="/browse" className="text-sm font-medium text-emerald-900 hover:underline">← Back to marketplace</Link><form action={logoutUser}><button className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium hover:bg-stone-50">Log out</button></form></div>
      <div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#719071]">Your THRIFTCYCLE</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Good to see you, {user.name.split(" ")[0]}.</h1><p className="mt-2 text-sm text-[#748071]">Your listings, orders, and account status in one place.</p></div><span className={`inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold ${statusStyle(user.verificationStatus)}`}><span className="size-1.5 rounded-full bg-current" />{label(user.verificationStatus)}</span></div>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <Link href="/my-listings" className="rounded-2xl border border-[#e4e9df] bg-white p-5 transition hover:border-[#b9cdb8]"><p className="text-sm font-medium text-[#788275]">My listings</p><div className="mt-3 flex items-end justify-between"><span className="text-3xl font-semibold tracking-tight text-[#294631]">{listingCount}</span><span className="pb-1 text-xs text-[#97a092]">Manage items →</span></div></Link>
        {[["My orders", orders.length, "buying or selling"], ["In progress", activeOrders, "orders moving"]].map(([title, value, detail]) => <section key={title} className="rounded-2xl border border-[#e4e9df] bg-white p-5"><p className="text-sm font-medium text-[#788275]">{title}</p><div className="mt-3 flex items-end justify-between"><span className="text-3xl font-semibold tracking-tight text-[#294631]">{value}</span><span className="pb-1 text-xs text-[#97a092]">{detail}</span></div></section>)}
      </div>

      <section className="mt-5 flex flex-col gap-5 rounded-[1.6rem] border border-[#dfe8dc] bg-[#edf3e9] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div><div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-full bg-white text-[#47754a]">{user.verificationStatus === "VERIFIED" ? "✓" : "•"}</span><h2 className="font-semibold text-[#304b34]">{user.verificationStatus === "VERIFIED" ? "Your account is verified" : `Verification: ${label(user.verificationStatus)}`}</h2></div><p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b7968]">{user.verificationStatus === "VERIFIED" ? "You can list items and place orders in the THRIFTCYCLE marketplace." : "Verification is required before listing items or placing orders. Your account status will update here as you complete each step."}</p></div>
        {user.verificationStatus !== "VERIFIED" && <Link href="/browse" className="shrink-0 rounded-full border border-[#c9d9c6] bg-white px-4 py-2.5 text-sm font-semibold text-[#456a49] hover:bg-[#f7faf5]">Explore the marketplace</Link>}
      </section>

      <div className="mt-8 grid gap-6">
        <section className="rounded-[1.6rem] border border-[#e4e9df] bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#81907d]">Buying and selling</p><h2 className="mt-1 text-xl font-semibold">Recent orders</h2></div><span className="rounded-full bg-[#f2f5ef] px-3 py-1.5 text-xs font-semibold text-[#70806c]">{orders.length} shown</span></div>
          {orders.length ? <ul className="mt-4 divide-y divide-[#edf0e9]">{orders.map((order) => <li key={order.id} className="py-4"><Link href={`/orders/${order.id}`} className="block rounded-xl transition hover:bg-[#fafbf8]"><div className="flex items-start justify-between gap-4"><div className="min-w-0"><p className="truncate font-medium text-[#334234]">{order.listing.title}</p><p className="mt-1 text-xs text-[#879183]">{order.buyerId === user.id ? `Buying from ${order.seller.name}` : `Selling to ${order.buyer.name}`} · {order.paymentType === "DONATION" ? "Donation" : `₹${order.amount.toLocaleString("en-IN")}`}</p></div><span className={`shrink-0 rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${statusStyle(order.status)}`}>{label(order.status)}</span></div><p className="mt-3 border-l-2 border-[#cdddc9] pl-3 text-xs text-[#7d8879]">{order.events[0]?.note ?? "Order created"}</p><p className="mt-2 text-xs font-semibold text-emerald-900">View order →</p></Link></li>)}</ul> : <div className="mt-5 rounded-2xl bg-[#f7f8f4] px-5 py-8 text-center"><p className="font-medium text-[#4b584a]">No orders yet.</p><p className="mt-1 text-sm text-[#899286]">When you buy or sell, updates will appear here.</p><Link href="/browse" className="mt-4 inline-block text-sm font-semibold text-emerald-900 underline">Find something to love</Link></div>}
        </section>
      </div>
    </div>
  </main>;
}
