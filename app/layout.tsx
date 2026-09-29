import type { Metadata } from "next";
import { BrandIntro } from "@/components/verendo/brand-intro";
import "./globals.css";
import "./verendo-brand.css";

export const metadata: Metadata = {
  title: "Verendo — AI Automation Agency",
  description:
    "Clear systems. Thoughtful automation. A better way to run your business.",
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
