import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { demoListings } from "@/lib/demo-listings";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = demoListings.find((item) => item.id === id);
  if (!listing) notFound();
  const session = await auth();
  const user = session?.user;
  const storedListing = await prisma.listing.findUnique({ where: { id }, select: { status: true, sellerId: true } });
  const available = storedListing?.status === "APPROVED";

  return <main className="min-h-screen bg-[#f7f8f2] text-[#20291f]">
    <SiteHeader />
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <Link href="/browse" className="text-sm font-medium text-[#526b53] hover:underline">← Back to Browse</Link>
      <div className="mt-7 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className={`relative grid aspect-[4/3] place-items-center overflow-hidden rounded-[2rem] bg-gradient-to-br ${listing.artwork}`}>
          <div aria-hidden="true" className="absolute -right-12 -top-12 size-64 rounded-full border border-white/40" />
          <div aria-hidden="true" className="absolute -bottom-16 -left-8 size-56 rounded-full bg-white/20 blur-xl" />
          <span className="relative drop-shadow-sm text-[8rem] sm:text-[10rem]" aria-hidden="true">{listing.emoji}</span>
          <span className="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-[#405b43] shadow-sm">{listing.condition} condition</span>
        </div>
        <section className="rounded-[2rem] border border-[#e3e9df] bg-white p-6 sm:p-8">
          <div className="flex flex-wrap gap-2"><span className="rounded-full bg-[#edf3e9] px-3 py-1.5 text-xs font-semibold text-[#466749]">Verified seller</span><span className="rounded-full bg-[#f2f4ef] px-3 py-1.5 text-xs font-semibold text-[#647060]">{listing.category}</span></div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-[#26392b] sm:text-4xl">{listing.title}</h1>
          <p className="mt-3 text-sm leading-6 text-[#778174]">{listing.note}. Located in {listing.city}, Bengaluru.</p>
          <div className="mt-7 border-y border-[#edf0e9] py-5"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#899286]">{listing.disposition === "DONATION" ? "Donation" : "Asking price"}</p><p className="mt-1 text-3xl font-semibold text-[#27563a]">{listing.disposition === "DONATION" ? "Free" : `₹${listing.price?.toLocaleString("en-IN")}`}</p></div>
          <p className="mt-5 text-sm leading-6 text-[#626e60]">A pre-loved find looking for its next home. THRIFTCYCLE sellers are part of a verified community.</p>
          {user ? <>
            {!available ? <div className="mt-7 rounded-2xl bg-[#f5f7f1] p-4 text-sm leading-6 text-[#626e60]">This listing is no longer available.</div>
              : user.id === storedListing?.sellerId ? <div className="mt-7 rounded-2xl bg-[#f5f7f1] p-4 text-sm leading-6 text-[#626e60]">This is your listing, so you can’t buy it.</div>
              : user.verificationStatus !== "VERIFIED" && user.role !== "ADMIN" ? <div className="mt-7 rounded-2xl bg-[#f5f7f1] p-4 text-sm leading-6 text-[#626e60]">Your account needs verification before you can place an order. Check your dashboard for your verification status.</div>
              : <Link href={`/checkout/${id}`} className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-[#24543a] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#183e2b]">{listing.disposition === "DONATION" ? "Claim this donation" : "Buy now"}<span className="ml-2" aria-hidden="true">→</span></Link>}
            <Link href="/dashboard" className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-[#c9d9c6] bg-white px-5 py-3.5 text-sm font-semibold text-[#24543a] transition hover:bg-[#f5f8f2]">Go to your dashboard <span className="ml-2" aria-hidden="true">→</span></Link>
          </> : <>
            <Link href={`/login?callbackUrl=${encodeURIComponent(`/checkout/${id}`)}`} className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-[#24543a] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#183e2b]">Sign in to continue <span className="ml-2" aria-hidden="true">→</span></Link>
            <p className="mt-3 text-center text-xs text-[#8a9387]">New to THRIFTCYCLE? <Link className="font-semibold text-[#45684a] underline" href="/register">Create an account</Link></p>
          </>}
        </section>
      </div>
    </div>
  </main>;
}
