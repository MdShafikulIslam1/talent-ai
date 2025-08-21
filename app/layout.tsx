import ModalProvider from "@/components/modalProvider";
import CrispProvider from "@/components/ui/crispProvider";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "talent ai",
  description: "AI software",
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
