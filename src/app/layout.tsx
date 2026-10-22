import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "THRIFTCYCLE | A second life for good things",
  description: "A verified marketplace for pre-loved goods, repair, exchange, and reuse.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
