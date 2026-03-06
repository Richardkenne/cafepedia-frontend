import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { PostHogProvider } from "./providers";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

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
    description: "Temukan cafe terbaik di Bandung. Cari berdasarkan suasana, lokasi, atau biarkan AI pilihkan untukmu.",
    url: SITE_URL,
    siteName: "Cafepedia",
    type: "website",
    locale: "id_ID",
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
  verification: {
    google: "Len34hYmLrRfhRHrRWVAotTK1K86IZNwNgAE2VneAKs",
    other: { "msvalidate.01": "387672607C2F1E39AA2896C6CF1C77D9" },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#F7F3EE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={plusJakarta.variable}>
      <body className="antialiased min-h-dvh font-sans">
        <PostHogProvider>
        <I18nProvider>
        {children}
        </I18nProvider>
        </PostHogProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').then(function(reg) {
                    reg.update();
                    reg.addEventListener('updatefound', function() {
                      var w = reg.installing;
                      if (w) w.addEventListener('statechange', function() {
                        if (w.state === 'activated') window.location.reload();
                      });
                    });
                  }).catch(function(){});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
