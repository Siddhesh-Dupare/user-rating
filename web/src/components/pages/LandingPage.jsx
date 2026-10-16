import {
  ArrowRight,
  BarChart3,
  MapPin,
  MessageSquare,
  Search,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

const highlights = [
  {
    icon: Search,
    title: "Find with confidence",
    description: "Compare nearby stores through experiences shared by real customers.",
  },
  {
    icon: MessageSquare,
    title: "Share what you know",
    description: "Leave a rating that helps the next person make a better choice.",
  },
  {
    icon: BarChart3,
    title: "See the full picture",
    description: "Understand a store at a glance with clear, useful rating summaries.",
  },
];

const storeExamples = [
  { name: "Green Valley Supermarket", location: "Pune, Maharashtra", rating: "4.8" },
  { name: "Chai Wala", location: "Nagpur, Maharashtra", rating: "4.6" },
  { name: "Cornerstone Market", location: "Mumbai, Maharashtra", rating: "4.4" },
];

export default function LandingPage() {
  return (
    <main className="min-h-svh overflow-hidden bg-[#f4f5f7] text-[#172033]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link to="/" className="flex items-center gap-3 text-lg font-bold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#1824ff] text-white shadow-lg shadow-[#1824ff]/20">
            <Star className="h-4 w-4 fill-current" />
          </span>
          StoreRate
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-[#4f596b] transition hover:bg-white hover:text-[#1824ff]"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="rounded-xl bg-[#1824ff] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#1824ff]/20 transition hover:bg-[#101dcc]"
          >
            Get started
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-28 lg:pt-20">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#1824ff]/15 bg-[#1824ff]/[0.06] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#1824ff]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1824ff]" />
            Better local decisions
          </div>
          <h1 className="max-w-2xl text-5xl font-bold leading-[1.02] tracking-[-0.045em] text-[#172033] sm:text-6xl lg:text-7xl">
            Know the place
            <span className="block text-[#1824ff]">before you go.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#6f788a]">
            StoreRate brings customer experiences together, so finding a store
            you can trust feels simple.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to="/signup"
              className="group inline-flex items-center gap-2 rounded-xl bg-[#1824ff] px-5 py-3.5 text-sm font-semibold text-white shadow-xl shadow-[#1824ff]/20 transition hover:bg-[#101dcc]"
            >
              Explore StoreRate
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-[#dfe4ed] bg-white px-5 py-3.5 text-sm font-semibold text-[#4f596b] shadow-sm transition hover:border-[#1824ff]/30 hover:text-[#1824ff]"
            >
              I already have an account
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-3 text-sm text-[#7b8494]">
            <ShieldCheck className="h-5 w-5 text-[#1824ff]" />
            Honest ratings from the people who have been there
          </div>
        </div>

        <div className="relative">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#1824ff]/10 blur-3xl" />
          <div className="relative rounded-[2rem] border border-[#dfe4ed] bg-white p-4 shadow-[0_24px_70px_rgba(31,43,68,0.12)] sm:p-6">
            <div className="flex items-center justify-between border-b border-[#edf0f5] pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9aa2b1]">
                  Nearby picks
                </p>
                <h2 className="mt-1 text-xl font-bold text-[#172033]">Stores people trust</h2>
              </div>
              <div className="rounded-xl bg-[#1824ff]/10 p-3 text-[#1824ff]">
                <MapPin className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-5 rounded-xl border border-[#e8ebf1] bg-[#fbfcfe] px-4 py-3">
              <div className="flex items-center gap-3 text-sm text-[#9aa2b1]">
                <Search className="h-4 w-4" />
                Search a store or area
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {storeExamples.map((store, index) => (
                <div
                  key={store.name}
                  className="flex items-center justify-between rounded-xl border border-[#edf0f5] bg-white p-4 transition hover:border-[#1824ff]/25 hover:shadow-sm"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-bold ${index === 0 ? "bg-[#1824ff] text-white" : "bg-[#eef0ff] text-[#1824ff]"}`}>
                      {store.name.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#172033]">{store.name}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-[#8b94a5]">
                        <MapPin className="h-3 w-3" />
                        {store.location}
                      </p>
                    </div>
                  </div>
                  <div className="ml-3 flex items-center gap-1 text-sm font-bold text-[#172033]">
                    <Star className="h-4 w-4 fill-[#1824ff] text-[#1824ff]" />
                    {store.rating}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between rounded-xl bg-[#1824ff] px-4 py-3 text-white">
              <span className="text-sm font-medium">Your next favorite place is out there.</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#e1e5ec] bg-white">
        <div className="mx-auto grid max-w-7xl gap-px bg-[#e1e5ec] sm:grid-cols-3 lg:px-10">
          {highlights.map(({ icon: Icon, title, description }) => (
            <article key={title} className="bg-white px-6 py-10 lg:px-8">
              <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-[#1824ff]/10 text-[#1824ff]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-[#172033]">{title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-6 text-[#7b8494]">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-[#9aa2b1] sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <span>StoreRate</span>
        <span>Make every visit count.</span>
      </footer>
    </main>
  );
}
