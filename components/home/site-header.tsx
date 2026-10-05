"use client";

import { useAuth } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "./logo";

const links = [
  { href: "#tools", label: "Tools" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-5 md:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-[15px] font-medium text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={isSignedIn ? "/dashboard" : "/sign-in"}
            className="hidden rounded-full px-4 py-2 text-[15px] font-medium text-ink hover:bg-ink-100 md:inline-block"
          >
            {isSignedIn ? "Dashboard" : "Log in"}
          </Link>
          <Link
            href="/dashboard"
            className="hidden rounded-full bg-ink px-5 py-2.5 text-[15px] font-semibold text-white transition-transform hover:-translate-y-px md:inline-block"
          >
            Try it free
          </Link>
          <button
            className="rounded-full p-2 text-ink hover:bg-ink-100 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-ink-200 bg-white px-5 pb-5 pt-3 md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-3 font-medium text-ink hover:bg-ink-100"
            >
              {l.label}
            </a>
          ))}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              href={isSignedIn ? "/dashboard" : "/sign-in"}
              className="rounded-full border border-ink-200 py-3 text-center font-medium text-ink"
            >
              {isSignedIn ? "Dashboard" : "Log in"}
            </Link>
            <Link href="/dashboard" className="rounded-full bg-ink py-3 text-center font-semibold text-white">
              Try it free
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
