import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vote Copro",
  description: "Vote en ligne copropriété",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} font-sans bg-gradient-to-b from-slate-50 to-slate-100 antialiased`}
      >
        <ScrollToTop />
        <Navbar />
        <main className="min-h-screen flex justify-center w-full">
          <div>{children}</div>
        </main>
      </body>
    </html>
  );
}
