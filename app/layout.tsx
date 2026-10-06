import type { Metadata } from "next";
import { BrandIntro } from "@/components/verendo/brand-intro";
import "./globals.css";
import "./verendo-brand.css";
import "./verendo-design.css";
import "./verendo-responsive.css";

export const metadata: Metadata = {
  title: "Verendo — AI, Websites & Digital Marketing",
  description:
    "AI for Business, Website Development and Digital Marketing for local, small and medium businesses in the UK, USA and UAE.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <BrandIntro />
        {children}
      </body>
    </html>
  );
}
