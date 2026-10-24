"use client";

import Link from "next/link";
import { useActionState } from "react";
import { placeOrder, type PurchaseResult } from "@/app/actions/orders";

export function CheckoutForm({ listingId, amount, donation }: { listingId: string; amount: number; donation: boolean }) {
  const [state, action, pending] = useActionState(placeOrder, {} satisfies PurchaseResult);
  if (state.orderId) return <div role="status" className="mt-6 rounded-[1.5rem] border border-[#cdddc9] bg-[#edf3e9] p-6 sm:p-7">
    <span className="grid size-12 place-items-center rounded-full bg-white text-2xl font-bold text-emerald-800" aria-hidden="true">✓</span>
    <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[#719071]">Order confirmed</p>
    <h2 className="mt-1 text-2xl font-semibold text-[#304b34]">You’re all set.</h2>
    <p className="mt-2 text-sm leading-6 text-[#6b7968]">{donation ? "Your donation claim is confirmed." : "Your demo payment is confirmed. No real payment was collected."} The item is reserved for you.</p>
    {state.deliveryStart && state.deliveryEnd && <div className="mt-5 rounded-xl bg-white p-4"><p className="text-xs font-semibold uppercase tracking-wider text-[#81907d]">Estimated delivery</p><p className="mt-1 font-semibold text-[#304b34]">{new Date(state.deliveryStart).toLocaleDateString("en-IN", { day: "numeric", month: "long" })} – {new Date(state.deliveryEnd).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p><p className="mt-1 text-xs text-[#788276]">Expected 2–3 days after confirmation.</p></div>}
    <p className="mt-4 text-xs text-[#788276]">Order #{state.orderId.slice(-8).toUpperCase()}</p>
    <Link href={`/orders/${state.orderId}`} className="mt-5 inline-flex rounded-full bg-emerald-900 px-5 py-3 text-sm font-semibold text-white">Track your order</Link>
  </div>;

  return <form action={action} className="mt-6 space-y-5">
    <input type="hidden" name="listingId" value={listingId} />
    <section className="rounded-2xl border border-[#e4e9df] p-5">
      <h2 className="font-semibold">Contact and fulfillment</h2>
      <label className="mt-4 block text-sm font-medium" htmlFor="phone">Phone number</label>
      <input id="phone" name="phone" required autoComplete="tel" placeholder="+91 98765 43210" className="mt-1 h-11 w-full rounded-xl border border-[#dce3d8] px-3 text-sm" />
      <p className="mt-4 text-sm font-medium">How would you like to receive it?</p>
      <label className="mt-2 flex gap-3 rounded-xl bg-[#f7f8f4] p-3 text-sm"><input type="radio" name="fulfillmentMethod" value="DELIVERY" defaultChecked /> Delivery (demo; coordinate with seller)</label>
      <label className="mt-2 flex gap-3 rounded-xl bg-[#f7f8f4] p-3 text-sm"><input type="radio" name="fulfillmentMethod" value="PICKUP" /> Arrange pickup with the seller</label>
      <p className="mt-4 text-xs leading-5 text-[#788276]">For delivery, fill in the address fields below. For pickup, the seller will contact you at the number above.</p>
      <label className="mt-3 block text-sm font-medium" htmlFor="address">Delivery address</label>
      <input id="address" name="address" autoComplete="street-address" placeholder="Street address and area" className="mt-1 h-11 w-full rounded-xl border border-[#dce3d8] px-3 text-sm" />
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div><label className="block text-sm font-medium" htmlFor="city">City</label><input id="city" name="city" autoComplete="address-level2" className="mt-1 h-11 w-full rounded-xl border border-[#dce3d8] px-3 text-sm" /></div>
        <div><label className="block text-sm font-medium" htmlFor="postalCode">Postal code</label><input id="postalCode" name="postalCode" autoComplete="postal-code" className="mt-1 h-11 w-full rounded-xl border border-[#dce3d8] px-3 text-sm" /></div>
      </div>
    </section>
    <section className="rounded-2xl border border-[#e4e9df] p-5">
      <div className="flex justify-between gap-4"><span className="text-sm text-[#667363]">{donation ? "Item" : "Item total"}</span><strong>{donation ? "Free" : `₹${amount.toLocaleString("en-IN")}`}</strong></div>
      <div className="mt-3 flex justify-between border-t border-[#edf0e9] pt-3"><span className="font-semibold">{donation ? "Total" : "Total due"}</span><strong className="text-lg text-[#27563a]">{donation ? "₹0" : `₹${amount.toLocaleString("en-IN")}`}</strong></div>
      {!donation && <p className="mt-3 rounded-xl bg-[#f7f0dc] p-3 text-xs leading-5 text-[#79673c]">Demo payment only. This simulates the payment confirmation step; no gateway is connected and no money will be charged.</p>}
    </section>
    {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
    <button disabled={pending} className="w-full rounded-full bg-[#24543a] px-5 py-3.5 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Confirming…" : donation ? "Confirm donation claim" : `Pay ₹${amount.toLocaleString("en-IN")} (demo)`}</button>
  </form>;
}
