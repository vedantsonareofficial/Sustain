import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fira_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-headline",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const firaSans = Fira_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Sustain | Turn Surplus Into Support",
  description: "The ultimate logistics platform bridging the gap between corporate event surplus and community NGOs across India. Rescue meals, reduce waste, and feed thousands with precision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${firaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-body bg-background text-on-background bg-pattern transition-colors duration-300">
        <ThemeProvider><AuthProvider>{children}</AuthProvider></ThemeProvider>
      </body>
    </html>
  );
}
