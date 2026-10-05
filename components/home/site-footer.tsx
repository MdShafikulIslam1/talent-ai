import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="px-5 pb-8 md:px-8">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[40px] bg-ink px-6 py-16 text-center md:py-20">
        {/* Confetti in the brand colours */}
        <span className="absolute left-[8%] top-10 h-5 w-5 rotate-12 rounded-md bg-flame" />
        <span className="absolute left-[18%] bottom-12 h-4 w-4 rounded-full bg-brand-300" />
        <span className="absolute right-[10%] top-14 h-4 w-4 rounded-full bg-flame-100" />
        <span className="absolute right-[20%] bottom-10 h-5 w-5 -rotate-12 rounded-md bg-brand" />

        <h2 className="relative mx-auto max-w-2xl text-4xl font-extrabold tracking-[-0.03em] text-white md:text-5xl">
          Your next small task is a good place to start
        </h2>
        <Link
          href="/dashboard"
          className="relative mt-9 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-ink transition-transform hover:-translate-y-0.5"
        >
          Try it free <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center justify-between gap-5 px-2 text-sm text-ink-400 md:flex-row">
        <Logo />
        <nav className="flex flex-wrap justify-center gap-6">
          <a href="#tools" className="hover:text-ink">Tools</a>
          <a href="#pricing" className="hover:text-ink">Pricing</a>
          <a href="#faq" className="hover:text-ink">FAQ</a>
          <Link href="/sign-in" className="hover:text-ink">Log in</Link>
        </nav>
        <p>© {new Date().getFullYear()} Talent AI</p>
      </div>
    </footer>
  );
}
