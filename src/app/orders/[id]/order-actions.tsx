"use client";

import { useActionState } from "react";
import { advanceOrder, type OrderUpdateResult } from "@/app/actions/orders";

export function OrderActions({ orderId, label }: { orderId: string; label: string }) {
  const [state, action, pending] = useActionState(advanceOrder, {} satisfies OrderUpdateResult);
  return <form action={action} className="mt-5">
    <input type="hidden" name="orderId" value={orderId} />
    <button disabled={pending} className="w-full rounded-full bg-[#24543a] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Updating…" : label}</button>
    {state.error && <p role="alert" className="mt-3 text-sm text-red-700">{state.error}</p>}
    {state.success && <p role="status" className="mt-3 text-sm text-emerald-800">{state.success}</p>}
  </form>;
}
