import Link from "next/link";
import { auth } from "@/auth";

export async function SiteHeader() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="border-b border-stone-200 bg-[#fafbf7]/95">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-5 gap-y-3 px-5 py-4 sm:px-8 lg:px-10">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="THRIFTCYCLE home">
          <span className="grid size-9 place-items-center rounded-xl bg-emerald-900 text-xl leading-none text-white" aria-hidden="true">↻</span>
          <span className="text-sm font-black tracking-[0.12em] text-stone-900 sm:text-base">THRIFTCYCLE</span>
        </Link>

        <nav aria-label="Main navigation" className="order-3 flex w-full items-center justify-between gap-4 text-sm font-medium text-stone-600 sm:order-none sm:w-auto sm:justify-end sm:gap-6">
          <Link className="transition hover:text-emerald-900" href="/">Home</Link>
          <Link className="transition hover:text-emerald-900" href="/browse">Browse</Link>
          <Link className="transition hover:text-emerald-900" href="/partners">Partners</Link>
          {user ? (
            <Link className="transition hover:text-emerald-900" href={user.role === "ADMIN" ? "/admin" : "/dashboard"}>My account</Link>
          ) : (
            <Link className="transition hover:text-emerald-900" href="/login">Log in</Link>
          )}
        </nav>

        <Link href={user ? (user.role === "ADMIN" ? "/admin" : "/dashboard") : "/register"} className="rounded-full bg-emerald-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800 sm:px-5 sm:py-2.5 sm:text-sm">
          {user ? "Dashboard" : "Join THRIFTCYCLE"}
        </Link>
      </div>
    </header>
  );
}
