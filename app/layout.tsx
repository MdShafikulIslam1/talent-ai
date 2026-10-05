import ModalProvider from "@/components/modalProvider";
import CrispProvider from "@/components/ui/crispProvider";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const description =
  "Nine friendly AI tools in one workspace: chat, summarise, translate, fix grammar, paraphrase, write code, analyse sentiment and turn speech into text. Free to start.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Talent AI — Nine friendly AI tools in one workspace",
    template: "%s · Talent AI",
  },
  description,
  applicationName: "Talent AI",
  keywords: [
    "AI tools",
    "AI writing assistant",
    "grammar checker",
    "text summarizer",
    "AI translator",
    "paraphrasing tool",
    "AI code generator",
    "speech to text",
    "sentiment analysis",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Talent AI",
    title: "Talent AI — Nine friendly AI tools in one workspace",
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Talent AI — Nine friendly AI tools in one workspace",
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        {/* <CrispProvider /> */}
        <body className={inter.className}>
          <Toaster />
          <ModalProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
