import { Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function CardRight({
  children,
  heading,
  footer,
  footerText,
  footerLink,
}) {
  return (
    <section className="flex w-full items-center justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-20">
      <div className="w-full max-w-md">
        <div className="mb-10">
          <div className="mb-8 flex items-center gap-3 text-sm font-semibold lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#5b5cf0] text-lg">
              <Star />
            </span>
            StoreRate
          </div>
          <p className="mb-3 text-sm font-medium text-[#7c7ff5]">
            Welcome back
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Continue your journey with trusted store reviews.
          </p>
        </div>

        {children}

        <div className="my-8 flex items-center gap-4 text-xs text-zinc-600">
          <span className="h-px flex-1 bg-white/10" />
          or
          <span className="h-px flex-1 bg-white/10" />
        </div>
        <p className="mt-8 text-center text-sm text-zinc-400">
          {footer}{" "}
          <Link
            to={footerLink}
            className="font-medium text-[#8587fa] hover:text-white"
          >
            {footerText}
          </Link>
        </p>
      </div>
    </section>
  );
}
