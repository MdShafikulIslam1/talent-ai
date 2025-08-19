"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo with Modern Typography */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
              Talent-AI
            </div>
          </div>

          {/* Navigation - Clean Design */}
          {/* <nav className="hidden md:flex items-center space-x-8">
            {[
              { href: "#features", label: "Features" },
              { href: "#demo", label: "Demo" },
              { href: "#pricing", label: "Pricing" },
              { href: "#faq", label: "FAQ" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200 font-medium group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </nav> */}

          {/* Action Buttons - Refined */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            <Link href={isSignedIn ? "/dashboard" : "/sign-in"}>
              <Button
                variant="outline"
                className="hidden md:inline-flex border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-purple-700 dark:hover:bg-slate-800 rounded-xl px-6"
              >
                {isSignedIn ? "Dashboard" : "Sign In"}
              </Button>
            </Link>

            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white border-0 rounded-xl px-6 shadow-lg hover:shadow-xl transition-all duration-300">
                Try Free
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              ) : (
                <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Improved Design */}
        {isMenuOpen && (
          <nav className="md:hidden mt-6 pb-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col space-y-4 pt-6">
              {[
                { href: "#features", label: "Features" },
                { href: "#demo", label: "Demo" },
                { href: "#pricing", label: "Pricing" },
                { href: "#faq", label: "FAQ" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <Button
                  variant="outline"
                  className="w-full mb-3 border-slate-300 dark:border-slate-600 rounded-xl"
                >
                  Sign In
                </Button>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white border-0 rounded-xl">
                  Try Free
                </Button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
