import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Cafepedia",
  description:
    "How Cafepedia collects, uses, and protects your data. We believe in transparency — here's everything you need to know.",
  alternates: { canonical: "https://cafepedia.id/privacy" },
  openGraph: {
    title: "Privacy Policy — Cafepedia",
    description: "How Cafepedia collects, uses, and protects your data.",
    url: "https://cafepedia.id/privacy",
    siteName: "Cafepedia",
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 bg-[var(--background)]/92 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="text-[var(--muted)] text-sm font-medium p-2 -ml-2"
          >
            &larr; Cafepedia
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-12">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-6 leading-tight">
          Privacy Policy
        </h1>

        <div className="mt-6 space-y-6 text-[15px] leading-relaxed text-[var(--muted)]">
          <p className="text-sm">Last updated: March 2026</p>

          <p>
            Cafepedia (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates
            the website{" "}
            <a
              href="https://cafepedia.id"
              className="underline text-[var(--foreground)]"
            >
              cafepedia.id
            </a>
            . This Privacy Policy explains what data we collect, how we use it,
            and your rights regarding that data.
          </p>

          <h2 className="text-lg font-bold text-[var(--foreground)] pt-2">
            Data We Collect
          </h2>

          <p>
            We collect minimal data to operate the service. Specifically:
          </p>

          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-[var(--foreground)]">Search queries</strong>{" "}
              — what you type into the search bar. We use this to improve search
              results and understand what users are looking for.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Usage data</strong>{" "}
              — pages visited, clicks, session duration, device type, and
              browser. Collected automatically through analytics.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Location (approximate)</strong>{" "}
              — if you use location-based features (e.g., &quot;cafes near
              me&quot;), your browser may share your approximate location. This
              is never stored permanently.
            </li>
          </ul>

          <p>
            We do <strong className="text-[var(--foreground)]">not</strong>{" "}
            require account creation. We do not collect names, email addresses,
            or payment information from visitors.
          </p>

          <h2 className="text-lg font-bold text-[var(--foreground)] pt-2">
            How We Use Data
          </h2>

          <ul className="list-disc pl-5 space-y-2">
            <li>To provide and improve cafe search results</li>
            <li>To power the AI recommendation engine (your query is sent to OpenAI to generate personalized cafe suggestions)</li>
            <li>To understand which cafes and areas are most popular</li>
            <li>To fix bugs and improve site performance</li>
            <li>To generate aggregate, anonymized statistics about cafe trends in Bandung</li>
          </ul>

          <h2 className="text-lg font-bold text-[var(--foreground)] pt-2">
            Cookies &amp; Analytics
          </h2>

          <p>
            We use <strong className="text-[var(--foreground)]">PostHog</strong>{" "}
            for product analytics, including page views, clicks, session recordings,
            and heatmaps to understand how users interact with our site.
            PostHog may use cookies or similar technologies to collect anonymized data.
            We do not use advertising cookies or third-party ad trackers.
          </p>

          <p>
            Your language preference (English or Indonesian) is stored in{" "}
            <code className="text-sm bg-[var(--card)] px-1.5 py-0.5 rounded">
              localStorage
            </code>{" "}
            on your device. This never leaves your browser.
          </p>

          <h2 className="text-lg font-bold text-[var(--foreground)] pt-2">
            Third-Party Services
          </h2>

          <p>
            We rely on the following third-party services to operate Cafepedia:
          </p>

          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-[var(--foreground)]">Google Places API</strong>{" "}
              — cafe data (ratings, reviews, hours, photos, coordinates) comes
              from Google. Google&apos;s privacy policy applies to data sourced
              from their platform.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Supabase</strong>{" "}
              — our database and photo storage provider. Data is stored on
              Supabase-managed infrastructure.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Vercel</strong>{" "}
              — hosts our frontend. Vercel may process request metadata
              (IP address, user agent) for performance and security purposes.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">PostHog</strong>{" "}
              — provides product analytics, session recordings, and heatmaps.
              Data is processed in the US.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">OpenAI</strong>{" "}
              — powers our AI recommendation engine. When you use the
              &quot;Pick for me&quot; feature, your query is sent to OpenAI to
              generate cafe suggestions. OpenAI&apos;s data usage policies apply.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Typesense</strong>{" "}
              — our search engine. Search queries are processed by Typesense to
              return results.
            </li>
          </ul>

          <h2 className="text-lg font-bold text-[var(--foreground)] pt-2">
            Data Retention
          </h2>

          <p>
            Search queries and usage analytics are retained for up to 12 months,
            after which they are deleted or anonymized. We do not maintain
            long-term profiles of individual users.
          </p>

          <h2 className="text-lg font-bold text-[var(--foreground)] pt-2">
            Your Rights
          </h2>

          <p>You have the right to:</p>

          <ul className="list-disc pl-5 space-y-2">
            <li>
              Ask what data we hold about you (though we collect very little
              identifiable data)
            </li>
            <li>Request deletion of any data associated with you</li>
            <li>Opt out of analytics by using browser privacy settings or ad blockers</li>
            <li>Disable location sharing in your browser settings</li>
          </ul>

          <h2 className="text-lg font-bold text-[var(--foreground)] pt-2">
            Contact
          </h2>

          <p>
            For any privacy-related questions or requests, contact us at{" "}
            <a
              href="mailto:hello@cafepedia.id"
              className="underline text-[var(--foreground)]"
            >
              hello@cafepedia.id
            </a>
            .
          </p>

          <h2 className="text-lg font-bold text-[var(--foreground)] pt-2">
            Changes to This Policy
          </h2>

          <p>
            We may update this Privacy Policy from time to time. Changes will be
            posted on this page with an updated &quot;Last updated&quot; date. We
            encourage you to review this page periodically.
          </p>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="text-[14px] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            &larr; Back to Cafepedia
          </Link>
        </div>
      </main>
    </div>
  );
}
