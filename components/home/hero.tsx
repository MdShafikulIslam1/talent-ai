import { ArrowRight, Check, Languages, Sparkle } from "lucide-react";
import Link from "next/link";
import { MAX_FREE_COUNT } from "@/constant";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 pb-10 pt-14 text-center md:px-8 md:pt-24">
        <a
          href="#tools"
          className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white py-1.5 pl-1.5 pr-4 text-sm font-medium text-ink-500 shadow-[0_1px_2px_rgba(17,17,17,0.06)] hover:border-brand-300"
        >
          <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand">Free</span>
          Start with {MAX_FREE_COUNT} generations on us
          <ArrowRight className="h-3.5 w-3.5" />
        </a>

        <h1 className="mx-auto mt-7 max-w-4xl text-[44px] font-extrabold leading-[1.04] tracking-[-0.035em] text-ink md:text-[76px]">
          Get more done with{" "}
          <span className="relative whitespace-nowrap">
            <span className="relative z-10">nine friendly</span>
            <svg
              aria-hidden
              viewBox="0 0 300 20"
              preserveAspectRatio="none"
              className="absolute -bottom-1 left-0 z-0 h-[0.32em] w-full text-flame md:-bottom-2"
            >
              <path d="M2 14 C 70 4, 160 4, 298 12" stroke="currentColor" strokeWidth="9" strokeLinecap="round" fill="none" />
            </svg>
          </span>{" "}
          AI tools
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-500 md:text-xl">
          Chat, summarise, translate, fix your grammar, write code or turn a voice note into text. Everything lives
          in one tidy workspace, so you stop jumping between apps.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-4 text-base font-semibold text-white shadow-[0_8px_24px_-8px_rgba(124,92,250,0.7)] transition-transform hover:-translate-y-0.5"
          >
            Try it free <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#tools"
            className="rounded-full border border-ink-200 bg-white px-7 py-4 text-base font-semibold text-ink hover:border-brand-300"
          >
            Explore the tools
          </a>
        </div>
        <p className="mt-4 text-sm text-ink-400">No card needed · cancel Pro any time</p>
      </div>

      <Showcase />
    </section>
  );
}

/** A friendly, static scene of the real app: a chat in the middle, two results pinned around it. */
function Showcase() {
  return (
    <div className="relative mx-auto mt-6 max-w-6xl px-5 pb-20 md:px-8 md:pb-28">
      {/* Soft colour field behind the window */}
      <div className="absolute inset-x-5 bottom-12 top-16 rounded-[40px] bg-brand-50 md:inset-x-8" />

      <div className="relative mx-auto max-w-3xl pt-8 lg:grid lg:max-w-none lg:grid-cols-[240px_minmax(0,680px)_260px] lg:items-center lg:justify-center">
        {/* Pinned result: grammar (left column, overlapping the window edge) */}
        <GrammarCard />

        {/* Main chat window */}
        <div className="overflow-hidden rounded-3xl border border-ink-200 bg-white shadow-[0_30px_60px_-30px_rgba(17,17,17,0.35)]">
          <div className="flex items-center justify-between border-b border-ink-200 px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-50 text-brand">
                <Sparkle className="h-4 w-4" />
              </span>
              <span className="text-sm font-semibold text-ink">Conversation</span>
            </div>
            <span className="rounded-full bg-ink-100 px-3 py-1 text-xs font-medium text-ink-400">GPT-OSS</span>
          </div>

          <div className="space-y-4 px-5 py-6 text-left md:px-8">
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-brand px-4 py-3 text-[15px] text-white md:max-w-[70%]">
              Can you help me write a short, polite email asking my manager for Friday off?
            </div>
            <div className="max-w-[92%] rounded-2xl rounded-bl-md bg-ink-100 px-4 py-3 text-[15px] leading-relaxed text-ink-700 md:max-w-[80%]">
              <p className="font-semibold text-ink">Subject: Leave request for Friday</p>
              <p className="mt-2">
                Hi Sarah, I&apos;d like to request Friday off for a personal appointment. My tasks are on track and
                I&apos;ll make sure the report is shared by Thursday evening. Thank you!
              </p>
            </div>
          </div>

          <div className="mx-5 mb-5 flex items-center gap-3 rounded-2xl border border-ink-200 px-4 py-3 md:mx-8">
            <span className="flex-1 text-left text-[15px] text-ink-300">Make it a little more casual…</span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-white">
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>

        {/* Pinned result: translation (right column) */}
        <TranslateCard />
      </div>
    </div>
  );
}

function GrammarCard() {
  return (
    <div className="relative z-10 hidden -rotate-[5deg] self-start rounded-2xl border border-ink-200 bg-white p-4 text-left shadow-[0_18px_40px_-20px_rgba(17,17,17,0.35)] lg:-mr-8 lg:mt-24 lg:block">
      <div className="flex items-center gap-2 text-xs font-semibold text-brand">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-brand-50">
          <Check className="h-3.5 w-3.5" />
        </span>
        Grammar fixed
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink-700">
        She <span className="text-ink-400 line-through decoration-2">dont</span>{" "}
        <span className="rounded bg-brand-50 px-1 font-medium text-brand">doesn&apos;t</span> like{" "}
        <span className="text-ink-400 line-through decoration-2">there</span>{" "}
        <span className="rounded bg-brand-50 px-1 font-medium text-brand">their</span> new office.
      </p>
    </div>
  );
}

function TranslateCard() {
  return (
    <div className="relative z-10 hidden rotate-[4deg] self-end rounded-2xl border border-ink-200 bg-white p-4 text-left shadow-[0_18px_40px_-20px_rgba(17,17,17,0.35)] lg:-ml-8 lg:mb-16 lg:block">
      <div className="flex items-center gap-2 text-xs font-semibold text-flame-700">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-flame-50">
          <Languages className="h-3.5 w-3.5" />
        </span>
        English → Spanish
      </div>
      <p className="mt-3 text-sm text-ink-400">See you at the meeting tomorrow.</p>
      <p className="mt-1 text-sm font-medium text-ink">Nos vemos en la reunión mañana.</p>
    </div>
  );
}
