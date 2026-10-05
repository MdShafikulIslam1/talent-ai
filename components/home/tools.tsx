import {
  ArrowUpRight,
  CheckCheck,
  Code2,
  FileText,
  Globe,
  MessageCircle,
  Mic,
  Music2,
  Repeat,
  Smile,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

/** The three card looks, one per palette colour. Arranged so no two neighbours match. */
const themes = {
  brand: { bg: "bg-brand-50", chip: "bg-brand-100", accent: "text-brand" },
  flame: { bg: "bg-flame-50", chip: "bg-flame-100", accent: "text-flame-700" },
  ink: { bg: "bg-ink-100", chip: "bg-white", accent: "text-ink" },
};

type Tool = {
  name: string;
  href: string;
  text: string;
  icon: LucideIcon;
  theme: keyof typeof themes;
  preview: ReactNode;
};

const tools: Tool[] = [
  {
    name: "Chat",
    href: "/conversation",
    text: "Ask anything, plan your week or draft a message.",
    icon: MessageCircle,
    theme: "brand",
    preview: (
      <div className="space-y-2">
        <div className="ml-auto w-fit max-w-[80%] rounded-xl rounded-br-sm bg-brand px-3 py-2 text-[13px] text-white">
          Ideas for a team lunch?
        </div>
        <div className="w-fit max-w-[90%] rounded-xl rounded-bl-sm bg-white px-3 py-2 text-[13px] text-ink-700">
          A picnic in the park, a cooking class, or a taco bar.
        </div>
      </div>
    ),
  },
  {
    name: "Summarise",
    href: "/summarize-text",
    text: "Turn long reads into a few clear points.",
    icon: FileText,
    theme: "flame",
    preview: (
      <div className="rounded-xl bg-white p-3">
        {["Sales up 12% this quarter", "Mobile app paused", "Two new hires in May"].map((t) => (
          <div key={t} className="flex items-center gap-2 py-1 text-[13px] text-ink-700">
            <span className="h-1.5 w-1.5 rounded-full bg-flame" />
            {t}
          </div>
        ))}
      </div>
    ),
  },
  {
    name: "Translate",
    href: "/translation",
    text: "Translate between languages and keep the tone.",
    icon: Globe,
    theme: "ink",
    preview: (
      <div className="space-y-1.5 rounded-xl bg-white p-3 text-[13px]">
        <p className="text-ink-400">Good morning, everyone!</p>
        <p className="font-medium text-ink">Bonjour à tous !</p>
        <div className="flex gap-1.5 pt-1">
          {["EN", "FR", "ES", "BN"].map((l) => (
            <span
              key={l}
              className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${l === "FR" ? "bg-ink text-white" : "bg-ink-100 text-ink-500"}`}
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    name: "Grammar",
    href: "/grammar-correction",
    text: "Fix spelling and grammar, keep your own voice.",
    icon: CheckCheck,
    theme: "ink",
    preview: (
      <p className="rounded-xl bg-white p-3 text-[13px] leading-relaxed text-ink-700">
        I <span className="text-ink-400 line-through">has</span>{" "}
        <span className="rounded bg-brand-50 px-1 font-medium text-brand">have</span> sent the{" "}
        <span className="text-ink-400 line-through">recieve</span>{" "}
        <span className="rounded bg-brand-50 px-1 font-medium text-brand">receipt</span>.
      </p>
    ),
  },
  {
    name: "Paraphrase",
    href: "/smart-paraphraser",
    text: "Say it shorter, simpler or more formal.",
    icon: Repeat,
    theme: "brand",
    preview: (
      <div className="space-y-1.5">
        {[
          ["Formal", "We would appreciate your feedback."],
          ["Casual", "Let us know what you think!"],
        ].map(([tone, line]) => (
          <div key={tone} className="rounded-xl bg-white px-3 py-2 text-[13px]">
            <span className="mr-2 text-[11px] font-semibold text-brand">{tone}</span>
            <span className="text-ink-700">{line}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    name: "Code",
    href: "/code",
    text: "Describe it in plain words, get working code.",
    icon: Code2,
    theme: "flame",
    preview: (
      <pre className="overflow-hidden rounded-xl bg-ink p-3 font-mono text-[12px] leading-relaxed text-ink-200">
        <span className="text-brand-300">const</span> total = items{"\n"}
        {"  "}.<span className="text-brand-300">reduce</span>((s, i) =&gt; s + i.price, <span className="text-flame">0</span>);
      </pre>
    ),
  },
  {
    name: "Speech to text",
    href: "/audio-translation",
    text: "Upload a recording, get a clean transcript.",
    icon: Mic,
    theme: "flame",
    preview: (
      <div className="rounded-xl bg-white p-3">
        <div className="flex h-8 items-center gap-[3px]">
          {[30, 55, 80, 45, 95, 60, 35, 70, 90, 50, 25, 65, 85, 40, 60, 30].map((h, i) => (
            <span key={i} className="w-1 rounded-full bg-flame" style={{ height: `${h}%` }} />
          ))}
          <span className="ml-auto text-[11px] font-medium text-ink-400">0:42</span>
        </div>
        <p className="mt-2 text-[13px] text-ink-700">“Remind the team the demo moved to Thursday…”</p>
      </div>
    ),
  },
  {
    name: "Sentiment",
    href: "/sentiment",
    text: "See if a review or message reads positive or negative.",
    icon: Smile,
    theme: "ink",
    preview: (
      <div className="rounded-xl bg-white p-3 text-[13px]">
        <p className="text-ink-700">“Delivery was fast and the support team was lovely.”</p>
        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand">
          Positive
        </span>
      </div>
    ),
  },
  {
    name: "Music",
    href: "/music",
    text: "Describe a mood and generate a short clip.",
    icon: Music2,
    theme: "brand",
    preview: (
      <div className="flex items-center gap-3 rounded-xl bg-white p-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-white">▶</span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-ink">Calm lo-fi, rainy evening</p>
          <div className="mt-1.5 h-1 w-full rounded-full bg-brand-100">
            <div className="h-1 w-2/5 rounded-full bg-brand" />
          </div>
        </div>
      </div>
    ),
  },
];

export function Tools() {
  return (
    <section id="tools" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-brand">The toolkit</p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.03em] text-ink md:text-5xl">
            One place for the little jobs
          </h2>
          <p className="mt-4 text-lg text-ink-500">Each tool does one thing well. Open it, paste your text, done.</p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => {
            const theme = themes[t.theme];
            return (
              <Link
                key={t.name}
                href={t.href}
                className={`group flex flex-col rounded-3xl ${theme.bg} p-5 transition-transform duration-200 hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between">
                  <span className={`grid h-10 w-10 place-items-center rounded-xl ${theme.chip} ${theme.accent}`}>
                    <t.icon className="h-5 w-5" />
                  </span>
                  <ArrowUpRight className={`h-5 w-5 ${theme.accent} opacity-0 transition-opacity group-hover:opacity-100`} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink">{t.name}</h3>
                <p className="mt-1 text-[15px] leading-snug text-ink-500">{t.text}</p>
                <div className="mt-5 flex-1 content-end">{t.preview}</div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
