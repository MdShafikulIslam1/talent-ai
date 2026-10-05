import { Check, Copy, MessageCircle, Mic, Globe, FileText } from "lucide-react";
import type { ReactNode } from "react";

const steps: { title: string; text: string; art: ReactNode }[] = [
  {
    title: "Create your free account",
    text: "Sign up in a few seconds. No card, no setup.",
    art: (
      <div className="w-full max-w-[220px] rounded-2xl bg-white p-4 shadow-[0_10px_30px_-15px_rgba(17,17,17,0.35)]">
        <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-flame-100 text-sm font-bold text-flame-700">
          AK
        </div>
        <div className="mx-auto mt-3 h-2 w-24 rounded-full bg-ink-200" />
        <div className="mt-4 h-8 rounded-lg border border-ink-200" />
        <div className="mt-2 grid h-8 place-items-center rounded-lg bg-brand text-xs font-semibold text-white">
          Sign up
        </div>
      </div>
    ),
  },
  {
    title: "Pick the tool you need",
    text: "Everything sits in one sidebar. No prompts to learn.",
    art: (
      <div className="flex w-full max-w-[230px] flex-wrap justify-center gap-2">
        {[
          { label: "Chat", icon: MessageCircle, cls: "bg-brand-50 text-brand" },
          { label: "Translate", icon: Globe, cls: "bg-brand text-white ring-2 ring-brand-100" },
          { label: "Summarise", icon: FileText, cls: "bg-flame-50 text-flame-700" },
          { label: "Speech", icon: Mic, cls: "bg-ink-100 text-ink-700" },
        ].map((c) => (
          <span key={c.label} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-semibold ${c.cls}`}>
            <c.icon className="h-3.5 w-3.5" />
            {c.label}
          </span>
        ))}
      </div>
    ),
  },
  {
    title: "Paste, then copy the result",
    text: "Drop in your text or audio and grab the answer.",
    art: (
      <div className="relative w-full max-w-[220px] rounded-2xl bg-white p-4 shadow-[0_10px_30px_-15px_rgba(17,17,17,0.35)]">
        <div className="space-y-2">
          <div className="h-2 w-full rounded-full bg-ink-200" />
          <div className="h-2 w-5/6 rounded-full bg-ink-200" />
          <div className="h-2 w-2/3 rounded-full bg-ink-200" />
        </div>
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-white">
          <Copy className="h-3.5 w-3.5" /> Copy
        </div>
        <span className="absolute -right-3 -top-3 grid h-9 w-9 place-items-center rounded-full bg-flame text-ink shadow-md">
          <Check className="h-5 w-5" />
        </span>
      </div>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 px-5 md:px-8">
      <div className="mx-auto max-w-6xl rounded-[40px] bg-ink-50 px-6 py-20 md:px-14 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-brand">How it works</p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.03em] text-ink md:text-5xl">
            Three steps, that&apos;s it
          </h2>
        </div>

        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="flex flex-col items-center text-center">
              <div className="grid h-48 w-full place-items-center rounded-3xl bg-white/60 ring-1 ring-ink-200">{s.art}</div>
              <span className="mt-6 grid h-8 w-8 place-items-center rounded-full bg-ink text-sm font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-3 text-lg font-bold text-ink">{s.title}</h3>
              <p className="mt-1 max-w-[260px] text-[15px] text-ink-500">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
