import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/prisma";
import { OrderActions } from "./order-actions";

const label = (value: string) => value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());

export default async function OrderPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams?: Promise<{ placed?: string }> }) {
  const { id } = await params;
  const query = searchParams ? await searchParams : {};
  const session = await auth();
  if (!session?.user?.id) notFound();
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      listing: { include: { category: true } },
      buyer: { select: { id: true, name: true, email: true } },
      seller: { select: { id: true, name: true, email: true } },
      events: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!order || (order.buyerId !== session.user.id && order.sellerId !== session.user.id)) notFound();
  const isBuyer = order.buyerId === session.user.id;
  const estimatedStart = new Date(order.createdAt);
  estimatedStart.setDate(estimatedStart.getDate() + 2);
  const estimatedEnd = new Date(order.createdAt);
  estimatedEnd.setDate(estimatedEnd.getDate() + 3);

  return <main className="min-h-screen bg-[#f7f8f2] text-[#20291f]"><SiteHeader />
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:px-10">
      <Link href="/dashboard" className="text-sm font-medium text-emerald-900 hover:underline">← Dashboard</Link>
      <p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-[#719071]">Order details</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#203c2a]">{order.listing.title}</h1>
      <p className="mt-2 text-sm text-[#748071]">Order {order.id.slice(-8).toUpperCase()} · Placed {order.createdAt.toLocaleDateString("en-IN")}</p>
      {(query.placed === "1" || order.status === "PAYMENT_CONFIRMED" || order.status === "PLACED") && <section role="status" className="mt-5 rounded-2xl border border-[#cdddc9] bg-[#edf3e9] p-5"><p className="font-semibold text-[#304b34]">{order.paymentType === "DONATION" ? "Your donation claim is confirmed" : query.placed === "1" ? "Your order has been placed" : "Your order is confirmed"}</p><p className="mt-1 text-sm leading-6 text-[#6b7968]">{order.paymentType === "QR_DEMO" ? "Simulated QR payment confirmed; no real charge was made." : order.paymentType === "COD" ? `₹${order.amount.toLocaleString("en-IN")} is still due in cash at handoff.` : order.paymentType === "DONATION" ? "The seller has been notified." : "Payment status recorded."} Your item is reserved.</p><p className="mt-3 text-sm font-semibold text-[#304b34]">{order.fulfillmentMethod === "DELIVERY" ? "Estimated arrival" : "Estimated pickup readiness"}: {estimatedStart.toLocaleDateString("en-IN", { day: "numeric", month: "long" })} – {estimatedEnd.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} <span className="font-normal">(2–3 days)</span></p></section>}
      <div className="mt-6 grid gap-5 md:grid-cols-[1fr_0.8fr]">
        <section className="rounded-2xl border border-[#e4e9df] bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-semibold">Order progress</h2><span className="rounded-full bg-[#edf3e9] px-3 py-1.5 text-xs font-semibold text-[#466749]">{label(order.status)}</span></div>
          <ol className="mt-5 space-y-4">{order.events.map((event) => <li key={event.id} className="flex gap-3"><span className="mt-1.5 size-2 shrink-0 rounded-full bg-emerald-700" /><div><p className="text-sm font-semibold">{label(event.to)}</p><p className="mt-1 text-sm leading-5 text-[#788276]">{event.note}</p><time className="mt-1 block text-xs text-[#99a093]">{event.createdAt.toLocaleString("en-IN")}</time></div></li>)}</ol>
          {order.sellerId === session.user.id && ["PLACED", "PAYMENT_CONFIRMED"].includes(order.status) && <OrderActions orderId={order.id} label="Accept and prepare order" />}
          {order.sellerId === session.user.id && order.status === "PREPARING" && <OrderActions orderId={order.id} label={order.fulfillmentMethod === "DELIVERY" ? "Mark as shipped" : "Mark ready for pickup"} />}
          {order.buyerId === session.user.id && order.status === "READY_FOR_PICKUP" && <OrderActions orderId={order.id} label="Confirm pickup received" />}
          {order.buyerId === session.user.id && order.status === "SHIPPED" && <OrderActions orderId={order.id} label="Confirm delivery received" />}
        </section>
        <section className="rounded-2xl border border-[#e4e9df] bg-white p-5 sm:p-6">
          <h2 className="text-lg font-semibold">{isBuyer ? "Purchase summary" : "Buyer and handoff"}</h2>
          <p className="mt-4 text-sm font-medium">{order.listing.title}</p><p className="mt-1 text-xs text-[#788276]">{order.listing.category.name} · {label(order.listing.condition)}</p>
          <div className="mt-4 flex justify-between border-y border-[#edf0e9] py-3 text-sm"><span>Total</span><strong>{order.paymentType === "DONATION" ? "Free" : `₹${order.amount.toLocaleString("en-IN")}`}</strong></div>
          <p className="mt-4 text-sm"><span className="text-[#788276]">{isBuyer ? "Seller" : "Buyer"}: </span>{isBuyer ? order.seller.name : order.buyer.name}</p>
          <p className="mt-1 text-sm text-[#526b53]">{isBuyer ? order.seller.email : order.buyer.email}</p>
          <p className="mt-4 text-xs leading-5 text-[#788276]">Contact the other person to arrange {order.fulfillmentMethod === "DELIVERY" ? "delivery" : "pickup"}.</p>
          {order.fulfillmentMethod === "DELIVERY" && order.shippingAddress && <address className="mt-3 rounded-xl bg-[#f7f8f4] p-3 text-sm not-italic leading-5">{order.shippingAddress}<br />{order.shippingCity} {order.shippingPostalCode}</address>}
          {order.buyerPhone && <p className="mt-3 text-sm">Contact phone: {order.buyerPhone}</p>}
          {order.paymentType === "QR_DEMO" && <p className="mt-4 rounded-xl bg-[#f7f0dc] p-3 text-xs leading-5 text-[#79673c]">Simulated QR payment recorded for this order. No real charge was made.</p>}
          {order.paymentType === "COD" && <p className="mt-4 rounded-xl bg-[#f7f0dc] p-3 text-xs leading-5 text-[#79673c]">Cash on delivery: ₹{order.amount.toLocaleString("en-IN")} remains due to the seller.</p>}
        </section>
      </div>
    </div>
  </main>;
}
