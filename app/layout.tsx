import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Premier Laminates",
  description:
    "Premier makes premium laminate collections for homes and commercial spaces: Hybrid Lam, Versace 6H, Imazica, Jutex, Cork Versace, Sofitek Panels, Ubuntu and Fluted Acrylic.",
  icons: {
    icon: "/logo/premier-symbol.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fahkwang:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
