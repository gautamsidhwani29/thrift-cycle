import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { confirmDemoPayment } from "@/app/actions/orders";

export default async function DemoPayPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const payment = await prisma.demoPayment.findFirst({ where: { token, status: { in: ["PENDING", "PAID"] }, createdAt: { gte: new Date(Date.now() - 15 * 60 * 1000) } } });
  if (!payment) notFound();

  return <main className="grid min-h-screen place-items-center bg-[#f7f8f2] px-5 text-[#20291f]">
    <section className="w-full max-w-md rounded-3xl border border-[#e4e9df] bg-white p-7 text-center shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#719071]">THRIFTCYCLE · Demo payment</p>
      <h1 className="mt-3 text-2xl font-semibold text-[#203c2a]">{payment.status === "PAID" ? "Payment confirmed" : "Confirm payment"}</h1>
      <p className="mt-2 text-sm leading-6 text-[#667363]">{payment.status === "PAID" ? "Return to your checkout screen to finish placing the order." : "This QR was scanned from checkout. Confirm the simulated payment below to complete checkout on the other device."}</p>
      <p className="mt-6 text-4xl font-semibold text-[#27563a]">₹{payment.amount.toLocaleString("en-IN")}</p>
      {payment.status === "PENDING" && <form action={confirmDemoPayment}>
        <input type="hidden" name="token" value={token} />
        <button className="mt-6 w-full rounded-full bg-[#24543a] px-5 py-3.5 text-sm font-semibold text-white">Confirm demo payment</button>
      </form>}
      <p className="mt-4 text-xs leading-5 text-[#788276]">No real money is transferred. Return to checkout after confirming; it will update automatically.</p>
    </section>
  </main>;
}
