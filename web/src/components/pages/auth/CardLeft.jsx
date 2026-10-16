import { Star } from "lucide-react";

export default function CardLeft() {
  return (
    <aside className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-[#6842f5] via-[#5659ed] to-[#4779e9] p-12 lg:flex lg:flex-col lg:justify-between">
      <div className="absolute -left-20 top-32 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-3xl" />
      <div className="absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 text-sm font-semibold">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/15 text-lg backdrop-blur-sm">
            <Star />
          </span>
          StoreRate
        </div>
        <div className="mt-28 max-w-md">
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.24em] text-white/70">
            A better way to choose
          </p>
          <h1 className="text-5xl font-bold leading-[1.08] tracking-tight xl:text-6xl">
            Discover stores worth talking about.
          </h1>
          <p className="mt-6 max-w-sm text-base leading-7 text-white/75">
            Read honest ratings, share your experience, and help your community
            shop with confidence.
          </p>
        </div>
      </div>
    </aside>
  );
}
