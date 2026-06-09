import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZINA Magazine",
  description: "A bilingual cultural magazine platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
