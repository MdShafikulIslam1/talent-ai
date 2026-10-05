"use client";

import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MAX_FREE_COUNT } from "@/constant";

const free = [`${MAX_FREE_COUNT} generations to try things out`, "All nine tools", "No card needed"];
const pro = ["Unlimited generations", "All nine tools", "Manage or cancel any time"];

export function Pricing() {
  const { isSignedIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const upgrade = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    } catch (error) {
      console.log("Stripe client error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="pricing" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-brand">Pricing</p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.03em] text-ink md:text-5xl">
            Simple, honest pricing
          </h2>
          <p className="mt-4 text-lg text-ink-500">Start free. Go Pro when it becomes part of your day.</p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-ink-200 bg-white p-8">
            <h3 className="text-lg font-bold text-ink">Free</h3>
            <p className="mt-1 text-[15px] text-ink-500">For trying everything out</p>
            <p className="mt-6 text-5xl font-extrabold tracking-tight text-ink">$0</p>
            <ul className="mt-8 space-y-3">
              {free.map((f) => (
                <li key={f} className="flex items-center gap-3 text-[15px] text-ink-700">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-ink-100 text-ink-500">
                    <Check className="h-3 w-3" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard"
              className="mt-10 block rounded-full border border-ink-200 py-3.5 text-center font-semibold text-ink hover:border-brand-300"
            >
              Start for free
            </Link>
          </div>

          <div className="relative rounded-3xl bg-brand p-8 text-white shadow-[0_24px_50px_-24px_rgba(124,92,250,0.8)]">
            <span className="absolute right-6 top-6 rounded-full bg-flame px-3 py-1 text-xs font-bold text-ink">
              For daily use
            </span>
            <h3 className="text-lg font-bold">Pro</h3>
            <p className="mt-1 text-[15px] text-white/75">No limits, every tool</p>
            <p className="mt-6 text-5xl font-extrabold tracking-tight">
              $20<span className="ml-1 text-lg font-medium text-white/70">/month</span>
            </p>
            <ul className="mt-8 space-y-3">
              {pro.map((f) => (
                <li key={f} className="flex items-center gap-3 text-[15px]">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-white/20">
                    <Check className="h-3 w-3" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            {isSignedIn ? (
              <button
                onClick={upgrade}
                disabled={loading}
                className="mt-10 block w-full rounded-full bg-white py-3.5 text-center font-semibold text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-70"
              >
                {loading ? "Opening checkout…" : "Upgrade to Pro"}
              </button>
            ) : (
              <Link
                href="/sign-in"
                className="mt-10 block rounded-full bg-white py-3.5 text-center font-semibold text-ink transition-transform hover:-translate-y-0.5"
              >
                Get Pro
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
