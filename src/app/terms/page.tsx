import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Cafepedia",
  description:
    "Terms of Service for Cafepedia, the vertical search engine for cafes in Indonesia.",
  alternates: { canonical: "https://cafepedia.id/terms" },
  openGraph: {
    title: "Terms of Service — Cafepedia",
    description: "Terms of Service for using Cafepedia.",
    url: "https://cafepedia.id/terms",
    siteName: "Cafepedia",
    type: "website",
  },
};

export default function TermsPage() {
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
          Terms of Service
        </h1>

        <div className="mt-6 space-y-6 text-[15px] leading-relaxed text-[var(--muted)]">
          <p className="text-sm">Last updated: March 2026</p>

          <p>
            These Terms of Service (&quot;Terms&quot;) govern your use of{" "}
            <a
              href="https://cafepedia.id"
              className="underline text-[var(--foreground)]"
            >
              cafepedia.id
            </a>{" "}
            (&quot;the Service&quot;), operated by Cafepedia (&quot;we&quot;,
            &quot;us&quot;, &quot;our&quot;). By using the Service, you agree to
            these Terms.
          </p>

          <h2 className="text-lg font-bold text-[var(--foreground)] pt-2">
            Acceptance
          </h2>

          <p>
            By accessing or using Cafepedia, you agree to be bound by these
            Terms. If you do not agree, please do not use the Service. We may
            update these Terms at any time — continued use after changes
            constitutes acceptance.
          </p>

          <h2 className="text-lg font-bold text-[var(--foreground)] pt-2">
            Service Description
          </h2>

          <p>
            Cafepedia is a cafe discovery platform for Indonesia. We provide
            search, filtering, and AI-powered recommendations to help you find
            cafes based on location, vibe, tags, and preferences. The Service is
            currently focused on Bandung, with plans to expand to other
            Indonesian cities.
          </p>

          <p>
            The Service is provided free of charge to users. We reserve the right
            to modify, suspend, or discontinue any part of the Service at any
            time without prior notice.
          </p>

          <h2 className="text-lg font-bold text-[var(--foreground)] pt-2">
            User Conduct
          </h2>

          <p>When using Cafepedia, you agree not to:</p>

          <ul className="list-disc pl-5 space-y-2">
            <li>Use the Service for any unlawful purpose</li>
            <li>
              Scrape, crawl, or bulk-download data from the Service without our
              written permission
            </li>
            <li>
              Attempt to interfere with, compromise, or disrupt the Service or
              its infrastructure
            </li>
            <li>
              Impersonate Cafepedia or misrepresent your affiliation with us
            </li>
            <li>
              Use automated tools to send excessive requests that degrade service
              quality for others
            </li>
          </ul>

          <h2 className="text-lg font-bold text-[var(--foreground)] pt-2">
            Content &amp; Data
          </h2>

          <p>
            Cafe information displayed on Cafepedia — including ratings, reviews,
            hours, photos, and coordinates — is sourced primarily from Google
            Places API and supplemented with our own research. While we strive
            for accuracy, we cannot guarantee that all information is complete,
            current, or error-free.
          </p>

          <p>
            Descriptions and tags are generated using a combination of AI and
            human curation. They represent our best effort to characterize each
            cafe but should not be taken as guarantees of any specific experience.
          </p>

          <h2 className="text-lg font-bold text-[var(--foreground)] pt-2">
            Cafe Listings
          </h2>

          <p>
            If you are a cafe owner and your establishment appears on Cafepedia,
            you may contact us to update your listing, correct inaccuracies, or
            request removal. We aim to represent every cafe fairly and
            accurately.
          </p>

          <p>
            Cafepedia may offer paid listing features in the future. Any paid
            services will be governed by separate terms communicated at the time
            of purchase.
          </p>

          <h2 className="text-lg font-bold text-[var(--foreground)] pt-2">
            Intellectual Property
          </h2>

          <p>
            The Cafepedia name, logo, website design, tag system, and AI
            recommendation engine are the intellectual property of Cafepedia. You
            may not copy, reproduce, or redistribute any part of the Service
            without our written permission.
          </p>

          <p>
            Cafe photos displayed on the platform are sourced from Google Places
            and are subject to Google&apos;s terms. We do not claim ownership of
            those images.
          </p>

          <h2 className="text-lg font-bold text-[var(--foreground)] pt-2">
            Disclaimers
          </h2>

          <p>
            The Service is provided &quot;as is&quot; and &quot;as
            available&quot; without warranties of any kind, either express or
            implied. We do not warrant that:
          </p>

          <ul className="list-disc pl-5 space-y-2">
            <li>The Service will be uninterrupted or error-free</li>
            <li>
              Cafe information (hours, ratings, prices, availability) is always
              accurate or up to date
            </li>
            <li>
              AI recommendations will perfectly match your preferences or
              expectations
            </li>
          </ul>

          <p>
            Always verify critical details (opening hours, availability) directly
            with the cafe before visiting.
          </p>

          <h2 className="text-lg font-bold text-[var(--foreground)] pt-2">
            Limitation of Liability
          </h2>

          <p>
            To the fullest extent permitted by law, Cafepedia shall not be liable
            for any indirect, incidental, special, consequential, or punitive
            damages arising from your use of the Service. This includes, but is
            not limited to, disappointment with a cafe visit, reliance on
            inaccurate data, or inability to access the Service.
          </p>

          <p>
            Our total liability for any claim related to the Service shall not
            exceed the amount you paid to use the Service (which is currently
            zero).
          </p>

          <h2 className="text-lg font-bold text-[var(--foreground)] pt-2">
            Changes
          </h2>

          <p>
            We reserve the right to update these Terms at any time. Changes will
            be posted on this page with an updated &quot;Last updated&quot; date.
            Your continued use of the Service after changes are posted
            constitutes acceptance of the revised Terms.
          </p>

          <h2 className="text-lg font-bold text-[var(--foreground)] pt-2">
            Contact
          </h2>

          <p>
            For questions about these Terms, contact us at{" "}
            <a
              href="mailto:hello@cafepedia.id"
              className="underline text-[var(--foreground)]"
            >
              hello@cafepedia.id
            </a>
            .
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
