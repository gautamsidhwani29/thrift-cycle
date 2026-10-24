import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CheckoutForm } from "./checkout-form";

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const [user, listing] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id }, select: { id: true, role: true, verificationStatus: true } }),
    prisma.listing.findUnique({ where: { id }, include: { category: true, seller: { select: { name: true, city: true } } } }),
  ]);
  if (!listing) notFound();
  if (listing.status !== "APPROVED" || listing.sellerId === user?.id) redirect(`/listing/${id}`);
  if (!user || (user.role !== "ADMIN" && user.verificationStatus !== "VERIFIED")) redirect("/dashboard");
  const donation = listing.disposition === "DONATION";
  const amount = donation ? 0 : (listing.price ?? 0);

  return <main className="min-h-screen bg-[#f7f8f2] text-[#20291f]"><SiteHeader />
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10">
      <Link href={`/listing/${id}`} className="text-sm font-medium text-[#526b53] hover:underline">← Back to item</Link>
      <p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-[#719071]">Checkout · demo</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#203c2a]">Review your order</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-start">
        <section className="rounded-[1.5rem] border border-[#e4e9df] bg-white p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-[#81907d]">You’re getting</p>
          <h2 className="mt-2 text-xl font-semibold">{listing.title}</h2>
          <p className="mt-1 text-sm text-[#788276]">{listing.category.name} · {listing.condition.replaceAll("_", " ").toLowerCase()} · {listing.city ?? listing.seller.city ?? "Bengaluru"}</p>
          <p className="mt-4 text-sm leading-6 text-[#667363]">Sold by {listing.seller.name}. After checkout, coordinate pickup or delivery directly with the seller.</p>
          <p className="mt-5 text-2xl font-semibold text-[#27563a]">{donation ? "Free" : `₹${amount.toLocaleString("en-IN")}`}</p>
        </section>
        <CheckoutForm listingId={id} amount={amount} donation={donation} />
      </div>
    </div>
  </main>;
}
