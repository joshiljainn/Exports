import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kivaro Copilot",
  description: "B2B Export Fraud Scanner for Indian exporters",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 font-sans antialiased">{children}</body>
    </html>
  );
}
