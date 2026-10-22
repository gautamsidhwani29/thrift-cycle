import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

const partners = [
  {
    name: "The Good Stitch",
    kind: "Repair studio",
    icon: "✳",
    area: "Indiranagar, Bengaluru",
    description: "Thoughtful fixes for everyday clothes, from a loose hem to a much-loved jacket.",
    services: ["Clothing repair", "Alterations", "Visible mending"],
    hours: "Tue–Sun · 10:00 am–7:00 pm",
    color: "bg-[#e6efdc] text-[#315b3d]",
  },
  {
    name: "Second Spin Tech",
    kind: "Repair studio",
    icon: "⌁",
    area: "Koramangala, Bengaluru",
    description: "A friendly neighborhood bench for small appliances and everyday electronics.",
    services: ["Small appliances", "Audio", "Device diagnostics"],
    hours: "Mon–Sat · 11:00 am–6:30 pm",
    color: "bg-[#e4eeeb] text-[#38665c]",
  },
  {
    name: "Cycle Circle Workshop",
    kind: "Repair studio",
    icon: "↗",
    area: "Jayanagar, Bengaluru",
    description: "Get your next ride rolling with tune-ups, puncture repairs, and refurbished parts.",
    services: ["Bicycle tune-ups", "Wheel repair", "Refurbished parts"],
    hours: "Tue–Sun · 9:30 am–6:00 pm",
    color: "bg-[#f1ead9] text-[#84682c]",
  },
  {
    name: "Earthwise E-Cycle",
    kind: "Recycling centre",
    icon: "↻",
    area: "Whitefield, Bengaluru",
    description: "A demo drop-off point for end-of-life electronics and household cables.",
    services: ["E-waste drop-off", "Cables", "Small electronics"],
    hours: "Mon–Sat · 10:00 am–5:00 pm",
    color: "bg-[#e8ebd9] text-[#58613a]",
  },
  {
    name: "Green Loop Materials",
    kind: "Recycling centre",
    icon: "◌",
    area: "Malleshwaram, Bengaluru",
    description: "Sort and route common household recyclables toward their next useful life.",
    services: ["Paper & cardboard", "Glass", "Clean plastics"],
    hours: "Mon–Sat · 9:00 am–5:30 pm",
    color: "bg-[#e3eee0] text-[#477047]",
  },
];

const categories = ["Clothing", "Electronics", "Bicycles", "Home goods", "E-waste", "Everyday recycling"];

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f2] text-[#20291f]">
      <SiteHeader />

      <section className="relative isolate overflow-hidden border-y border-[#e6e9df] bg-[#eef2e6]">
        <div aria-hidden="true" className="absolute -right-16 -top-32 -z-10 size-[27rem] rounded-full border border-[#cbd8c3] sm:right-12 sm:top-[-18rem] sm:size-[42rem]" />
        <div aria-hidden="true" className="absolute right-16 top-16 -z-10 size-48 rounded-full bg-[#dce8d4]/70 blur-2xl sm:right-52 sm:top-20 sm:size-72" />
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1fr_340px] lg:items-end lg:px-10 lg:py-24">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d3decc] bg-white/70 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#3f6845]">
              <span className="size-1.5 rounded-full bg-[#5f995b]" /> The THRIFTCYCLE network
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-[#203c2a] sm:text-6xl lg:text-7xl">Good things deserve <span className="font-serif italic font-normal text-[#57815a]">another round.</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#657064] sm:text-lg sm:leading-8">Meet local repair and recycling specialists who can help useful things stay useful for longer. Find the right next step for an item that needs a little care.</p>
          </div>
          <aside className="rounded-[1.75rem] border border-white/80 bg-white/75 p-6 shadow-[0_20px_60px_-38px_rgba(35,74,47,0.3)] backdrop-blur-sm sm:p-7">
            <div className="flex items-center justify-between"><span className="text-sm font-semibold text-[#435346]">In this demo directory</span><span className="rounded-full bg-[#e6efdf] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#406747]">Sample data</span></div>
            <div className="mt-5 flex items-end gap-3"><span className="text-5xl font-semibold tracking-tight text-[#24543a]">05</span><span className="pb-1 text-sm text-[#6a7569]">local partner profiles</span></div>
            <div className="my-5 h-px bg-[#e7ebe2]" />
            <div className="flex flex-wrap gap-2">{categories.slice(0, 4).map((category) => <span key={category} className="rounded-full bg-[#f1f3ed] px-3 py-1.5 text-xs font-medium text-[#5f6c5e]">{category}</span>)}</div>
            <p className="mt-5 text-xs leading-5 text-[#899187]">Partner names, locations, and hours are illustrative demo content.</p>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#719071]">A little help goes a long way</p><h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Find your next step</h2></div>
          <p className="max-w-lg text-sm leading-6 text-[#788177]">Whether it needs mending, a tune-up, or responsible recycling, start with a nearby specialist.</p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {partners.map((partner, index) => (
            <article key={partner.name} className="group flex min-h-[310px] flex-col rounded-[1.6rem] border border-[#e5e9df] bg-white p-6 shadow-[0_10px_30px_-28px_rgba(31,55,36,0.45)] transition duration-200 hover:-translate-y-1 hover:border-[#c9d8c6] hover:shadow-[0_24px_46px_-32px_rgba(31,55,36,0.35)] sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <span className={`grid size-12 place-items-center rounded-2xl text-2xl ${partner.color}`} aria-hidden="true">{partner.icon}</span>
                <span className="rounded-full border border-[#e6e9e1] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#707a6d]">{partner.kind}</span>
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.11em] text-[#879184]">{String(index + 1).padStart(2, "0")} <span className="px-1.5 text-[#c6cdc1]">/</span> {partner.area}</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-[#2b382d]">{partner.name}</h3>
              <p className="mt-2 text-sm leading-6 text-[#70796e]">{partner.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">{partner.services.map((service) => <span key={service} className="rounded-full bg-[#f3f5ef] px-3 py-1.5 text-xs font-medium text-[#657163]">{service}</span>)}</div>
              <div className="mt-auto flex items-center gap-2 border-t border-[#edf0e9] pt-5 mt-6 text-xs text-[#7e877b]"><span aria-hidden="true">◷</span>{partner.hours}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-14 sm:px-8 sm:pb-20 lg:px-10">
        <div className="flex flex-col gap-6 rounded-[1.8rem] bg-[#244f37] px-7 py-8 text-white sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-9">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b9d1b7]">Have a useful item?</p><h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Give it another chance before it goes.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-[#d0ddcf]">Explore pre-loved finds or create a listing for something ready for a new home.</p></div>
          <Link href="/browse" className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-[#f2f4e9] px-5 py-3 text-sm font-semibold text-[#284f36] transition hover:bg-white">Explore the marketplace <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <footer className="border-t border-[#e5e9df] bg-[#f2f4ed]"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-xs text-[#7f887a] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10"><Link href="/" className="font-black tracking-[0.12em] text-[#3c5940]">THRIFTCYCLE</Link><span>Demo partner directory · Details are illustrative</span><Link href="/" className="hover:text-[#355a3d]">Back to home ↑</Link></div></footer>
    </main>
  );
}
