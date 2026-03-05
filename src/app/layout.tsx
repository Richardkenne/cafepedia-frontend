import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = "https://cafepedia.id";

export const metadata: Metadata = {
  title: {
    default: "Cafepedia — Bandung Cafe Guide",
    template: "%s",
  },
  description: "Discover the best cafes in Bandung. Search by vibe, area, or let AI pick for you. 600+ cafes with photos, hours, and directions.",
  metadataBase: new URL(SITE_URL),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Cafepedia",
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Cafepedia — Bandung Cafe Guide",
    description: "Discover the best cafes in Bandung. Search by vibe, area, or let AI pick for you.",
    url: SITE_URL,
    siteName: "Cafepedia",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Cafepedia — Bandung Cafe Guide",
    description: "Discover the best cafes in Bandung. Search by vibe, area, or let AI pick for you.",
  },
  icons: {
    apple: "/icon-192.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-ID">
      <body className="antialiased min-h-dvh">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
