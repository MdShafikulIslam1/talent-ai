import { Plus } from "lucide-react";
import { MAX_FREE_COUNT } from "@/constant";

const faqs = [
  {
    q: "Which AI models power the tools?",
    a: "The text tools run on Meta's Llama 3.1 through Groq, so answers come back fast. Speech to text uses Whisper.",
  },
  {
    q: "What's included for free?",
    a: `You get ${MAX_FREE_COUNT} generations across all nine tools, so you can try each one before deciding.`,
  },
  {
    q: "How does Pro billing work?",
    a: "Pro is $20 a month, paid securely through Stripe. You can manage or cancel your plan from your settings page at any time.",
  },
  {
    q: "Is my text private?",
    a: "Your text is only sent to the AI model to create your result. As with any AI tool, avoid pasting passwords or other secrets.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20">
      <div className="mx-auto max-w-3xl px-5 pb-20 md:px-8 md:pb-28">
        <div className="text-center">
          <p className="text-sm font-semibold text-brand">FAQ</p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.03em] text-ink md:text-5xl">Good questions</h2>
        </div>
        <div className="mt-12 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-ink-200 bg-white px-6 py-5 open:bg-ink-50">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold text-ink">
                {f.q}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-50 text-brand transition-transform group-open:rotate-45">
                  <Plus className="h-4 w-4" />
                </span>
              </summary>
              <p className="mt-3 pr-10 leading-relaxed text-ink-500">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
