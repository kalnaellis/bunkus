import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Case Closed / Lips Glossed",
  description: "Typographic scroll narrative with intake and upload flow."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-ink text-gloss antialiased">{children}</body>
    </html>
  );
}
