"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { createDemoPayment, placeOrder, type PurchaseResult } from "@/app/actions/orders";

type PaymentChoice = "QR" | "COD";

export function CheckoutForm({ listingId, amount, donation, paymentOrigin }: { listingId: string; amount: number; donation: boolean; paymentOrigin: string }) {
  const [state, action, pending] = useActionState(placeOrder, {} satisfies PurchaseResult);
  const [step, setStep] = useState<"details" | "payment">("details");
  const [fulfillment, setFulfillment] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
  const [paymentMethod, setPaymentMethod] = useState<PaymentChoice>("QR");
  const [paymentToken, setPaymentToken] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "creating" | "pending" | "paid">("idle");
  const [paymentError, setPaymentError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!paymentToken || paymentStatus === "paid") return;
    let active = true;
    const poll = async () => {
      try {
        const response = await fetch(`/api/demo-payments/${paymentToken}`, { cache: "no-store" });
        const result = await response.json() as { status?: string; error?: string };
        if (!active) return;
        if (result.status === "PAID") setPaymentStatus("paid");
        else if (result.error) setPaymentError(result.error);
      } catch {
        if (active) setPaymentError("Could not check payment status. Please try again.");
      }
    };
    void poll();
    const interval = window.setInterval(poll, 1500);
    return () => { active = false; window.clearInterval(interval); };
  }, [paymentToken, paymentStatus]);

  if (state.orderId) return <div role="status" className="mt-6 rounded-[1.5rem] border border-[#cdddc9] bg-[#edf3e9] p-6 sm:p-7">
    <span className="grid size-12 place-items-center rounded-full bg-white text-2xl font-bold text-emerald-800" aria-hidden="true">✓</span>
    <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[#719071]">Order confirmed</p>
    <h2 className="mt-1 text-2xl font-semibold text-[#304b34]">You’re all set.</h2>
    <p className="mt-2 text-sm leading-6 text-[#6b7968]">{donation ? "Your donation claim is confirmed." : state.paymentMethod === "COD" ? `₹${amount.toLocaleString("en-IN")} is due in cash at handoff. No payment has been collected yet.` : "Your simulated QR payment is confirmed. No real payment was collected."} The item is reserved for you.</p>
    {state.deliveryStart && state.deliveryEnd && <div className="mt-5 rounded-xl bg-white p-4"><p className="text-xs font-semibold uppercase tracking-wider text-[#81907d]">Estimated delivery</p><p className="mt-1 font-semibold text-[#304b34]">{new Date(state.deliveryStart).toLocaleDateString("en-IN", { day: "numeric", month: "long" })} – {new Date(state.deliveryEnd).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p><p className="mt-1 text-xs text-[#788276]">Expected 2–3 days after confirmation.</p></div>}
    <p className="mt-4 text-xs text-[#788276]">Order #{state.orderId.slice(-8).toUpperCase()}</p>
    <Link href={`/orders/${state.orderId}`} className="mt-5 inline-flex rounded-full bg-emerald-900 px-5 py-3 text-sm font-semibold text-white">Track your order</Link>
  </div>;

  const continueToPayment = async () => {
    if (!formRef.current?.reportValidity()) return;
    setPaymentError("");
    if (!donation) {
      setPaymentStatus("creating");
      const result = await createDemoPayment(listingId);
      if (!result.token) {
        setPaymentError(result.error ?? "Could not start the payment.");
        setPaymentStatus("idle");
        return;
      }
      setPaymentToken(result.token);
      setPaymentStatus("pending");
    }
    setStep("payment");
  };

  const paymentUrl = paymentToken ? `${paymentOrigin}/demo-pay/${paymentToken}` : "";
  const qrImageUrl = paymentUrl ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&format=svg&data=${encodeURIComponent(paymentUrl)}` : "";

  return <form ref={formRef} action={action} className="mt-6 space-y-5">
    <input type="hidden" name="listingId" value={listingId} />
    <input type="hidden" name="paymentMethod" value={donation ? "COD" : paymentMethod} />
    <input type="hidden" name="demoPaymentToken" value={paymentToken} />
    <section hidden={step !== "details"} className="rounded-2xl border border-[#e4e9df] p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-[#81907d]">Step 1 of 2</p>
      <h2 className="mt-1 font-semibold">Contact and fulfillment</h2>
      <label className="mt-4 block text-sm font-medium" htmlFor="phone">Phone number</label>
      <input id="phone" name="phone" required autoComplete="tel" placeholder="+91 98765 43210" className="mt-1 h-11 w-full rounded-xl border border-[#dce3d8] px-3 text-sm" />
      <p className="mt-4 text-sm font-medium">How would you like to receive it?</p>
      <label className="mt-2 flex gap-3 rounded-xl bg-[#f7f8f4] p-3 text-sm"><input type="radio" name="fulfillmentMethod" value="DELIVERY" checked={fulfillment === "DELIVERY"} onChange={() => setFulfillment("DELIVERY")} /> Delivery</label>
      <label className="mt-2 flex gap-3 rounded-xl bg-[#f7f8f4] p-3 text-sm"><input type="radio" name="fulfillmentMethod" value="PICKUP" checked={fulfillment === "PICKUP"} onChange={() => setFulfillment("PICKUP")} /> Arrange pickup with the seller</label>
      {fulfillment === "DELIVERY" && <>
        <label className="mt-4 block text-sm font-medium" htmlFor="address">Delivery address</label>
        <input id="address" name="address" required autoComplete="street-address" placeholder="Street address and area" className="mt-1 h-11 w-full rounded-xl border border-[#dce3d8] px-3 text-sm" />
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div><label className="block text-sm font-medium" htmlFor="city">City</label><input id="city" name="city" required autoComplete="address-level2" className="mt-1 h-11 w-full rounded-xl border border-[#dce3d8] px-3 text-sm" /></div>
          <div><label className="block text-sm font-medium" htmlFor="postalCode">Postal code</label><input id="postalCode" name="postalCode" required autoComplete="postal-code" className="mt-1 h-11 w-full rounded-xl border border-[#dce3d8] px-3 text-sm" /></div>
        </div>
      </>}
      <p className="mt-4 text-xs leading-5 text-[#788276]">{fulfillment === "DELIVERY" ? "Enter your delivery address before choosing a payment method." : "The seller will coordinate pickup with you."}</p>
    </section>

    {step === "details" ? <button type="button" onClick={continueToPayment} disabled={paymentStatus === "creating"} className="w-full rounded-full bg-[#24543a] px-5 py-3.5 text-sm font-semibold text-white disabled:opacity-60">{paymentStatus === "creating" ? "Preparing checkout…" : donation ? "Continue to confirm claim" : "Continue to payment"}</button> : <>
      <section className="rounded-2xl border border-[#e4e9df] p-5">
        <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-[#81907d]">Step 2 of 2</p><h2 className="mt-1 font-semibold">Choose how to pay</h2></div><button type="button" onClick={() => setStep("details")} className="text-sm font-semibold text-[#315c38] underline">Edit details</button></div>
        {donation ? <p className="mt-4 rounded-xl bg-[#f3f7ef] p-3 text-sm text-[#526b53]">This is a free donation. No payment is needed.</p> : <>
          <label className={`mt-4 flex cursor-pointer gap-3 rounded-xl border p-3 text-sm ${paymentMethod === "QR" ? "border-[#8eae88] bg-[#f3f7ef]" : "border-[#e4e9df]"}`}><input type="radio" name="paymentChoice" value="QR" checked={paymentMethod === "QR"} onChange={() => setPaymentMethod("QR")} /><span><strong className="block">Scan QR with your phone</strong><span className="text-xs text-[#788276]">Opens a secure demo payment page on your phone</span></span></label>
          <label className={`mt-2 flex cursor-pointer gap-3 rounded-xl border p-3 text-sm ${paymentMethod === "COD" ? "border-[#8eae88] bg-[#f3f7ef]" : "border-[#e4e9df]"}`}><input type="radio" name="paymentChoice" value="COD" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} /><span><strong className="block">Cash on delivery</strong><span className="text-xs text-[#788276]">Pay ₹{amount.toLocaleString("en-IN")} in cash at handoff</span></span></label>
          {paymentMethod === "QR" ? <div className="mt-4 flex flex-col items-center rounded-xl bg-[#f7f8f4] p-4 text-center">
            <p className="text-sm font-semibold">Scan to pay ₹{amount.toLocaleString("en-IN")}</p>
            {qrImageUrl && <Image src={qrImageUrl} alt="Scan this QR code with your phone to confirm demo payment" width={220} height={220} unoptimized className="mt-3 rounded-lg bg-white p-2" />}
            <p className="mt-3 break-all text-xs text-[#788276]">{paymentUrl}</p>
            <p role="status" className="mt-3 text-sm font-semibold text-[#315c38]">{paymentStatus === "paid" ? "✓ Phone payment confirmed" : "Waiting for you to confirm on your phone…"}</p>
            <p className="mt-2 text-xs leading-5 text-[#788276]">Demo only. No real money is transferred. QR works when your phone can reach this site.</p>
          </div> : <p className="mt-4 rounded-xl bg-[#f7f0dc] p-3 text-xs leading-5 text-[#79673c]">₹{amount.toLocaleString("en-IN")} remains due in cash at delivery or pickup handoff.</p>}
        </>}
      </section>
      <section className="rounded-2xl border border-[#e4e9df] p-5">
        <div className="flex justify-between gap-4"><span className="text-sm text-[#667363]">{donation ? "Item" : "Item total"}</span><strong>{donation ? "Free" : `₹${amount.toLocaleString("en-IN")}`}</strong></div>
        <div className="mt-3 flex justify-between border-t border-[#edf0e9] pt-3"><span className="font-semibold">Total</span><strong className="text-lg text-[#27563a]">{donation ? "₹0" : `₹${amount.toLocaleString("en-IN")}`}</strong></div>
      </section>
      {(state.error || paymentError) && <p role="alert" className="text-sm text-red-700">{state.error ?? paymentError}</p>}
      <button disabled={pending || (!donation && paymentMethod === "QR" && paymentStatus !== "paid")} className="w-full rounded-full bg-[#24543a] px-5 py-3.5 text-sm font-semibold text-white disabled:opacity-50">{pending ? "Placing order…" : donation ? "Confirm donation claim" : paymentMethod === "COD" ? `Place order · ₹${amount.toLocaleString("en-IN")} due at handoff` : `Confirm paid order · ₹${amount.toLocaleString("en-IN")}`}</button>
    </>}
  </form>;
}
