import type { Metadata } from "next";
import { Gloock, Inter } from "next/font/google";
import "./globals.css";
import LayoutClientWrapper from "@/components/LayoutClientWrapper";

const gloock = Gloock({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SUSTAIN — Zero Waste, Full Impact",
  description:
    "SUSTAIN connects event organizers with NGOs to rescue surplus food, reduce waste, and nourish communities worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${gloock.variable} ${inter.variable}`}>
      <body className="antialiased min-h-screen font-[family-name:var(--font-sans)]">
        <LayoutClientWrapper>{children}</LayoutClientWrapper>
      </body>
    </html>
  );
}
