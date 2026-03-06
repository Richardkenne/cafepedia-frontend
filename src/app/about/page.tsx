import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Cafepedia — The Bandung Cafe Guide",
  description:
    "Cafepedia is the vertical search engine for cafes in Indonesia. Built in Bandung with 678+ verified cafes, real data from Google Places, and AI-powered recommendations.",
  alternates: { canonical: "https://cafepedia.id/about" },
  openGraph: {
    title: "About Cafepedia",
    description: "The vertical search engine for cafes in Indonesia.",
    url: "https://cafepedia.id/about",
    siteName: "Cafepedia",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 bg-[var(--background)]/92 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="text-[var(--muted)] text-sm font-medium p-2 -ml-2"
          >
            ← Cafepedia
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-12">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-6 leading-tight">
          About Cafepedia
        </h1>

        <div className="mt-6 space-y-6 text-[15px] leading-relaxed text-[var(--muted)]">
          <p>
            <strong className="text-[var(--foreground)]">Cafepedia</strong> is
            the vertical search engine for cafes in Indonesia. We help you
            decide where to go — whether you need a quiet place to work, an
            aesthetic spot for photos, or the best cheap coffee nearby.
          </p>

          <p>
            We started in Bandung because it has one of the richest cafe scenes
            in Southeast Asia. Hundreds of cafes, from hidden gems in narrow
            alleys to rooftop spots overlooking the city — but no single place
            to find and compare them all. Google Maps is too generic. Blog posts
            go stale. Instagram is hard to search. Cafepedia solves this.
          </p>

          <h2 className="text-lg font-bold text-[var(--foreground)] pt-2">
            What makes us different
          </h2>

          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-[var(--foreground)] font-bold flex-shrink-0">678+</span>
              <span>
                Verified cafes in Bandung, each with real data from Google
                Places — ratings, hours, phone, photos, coordinates.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--foreground)] font-bold flex-shrink-0">72</span>
              <span>
                Curated tags per cafe (work-friendly, aesthetic, pet-friendly,
                outdoor, budget, etc.) — not auto-generated, but reviewed for
                accuracy.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--foreground)] font-bold flex-shrink-0">6,100+</span>
              <span>
                Real photos from Google Places (up to 10 per cafe), not stock
                images.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--foreground)] font-bold flex-shrink-0">AI</span>
              <span>
                A decision engine that understands what you want. Type
                &quot;quiet cafe to work in Dago&quot; and get the top 3 perfect
                matches with reasons.
              </span>
            </li>
          </ul>

          <h2 className="text-lg font-bold text-[var(--foreground)] pt-2">
            Our data
          </h2>

          <p>
            Every cafe in our database has been verified through Google Places
            API. Ratings, review counts, opening hours, and phone numbers come
            directly from Google. Tags are generated using AI and then curated
            for accuracy. Descriptions are written to be informative and
            factual, in the style of Google or Yelp — not poetic or
            promotional.
          </p>

          <p>
            We update our data weekly through automated sync with Google Places,
            and continuously add new cafes as they open across the city.
          </p>

          <h2 className="text-lg font-bold text-[var(--foreground)] pt-2">
            Our mission
          </h2>

          <p>
            <em>&quot;Where should we go? Check Cafepedia.&quot;</em>
          </p>

          <p>
            We want Cafepedia to be the first place people check when deciding
            on a cafe. Starting with Bandung, then expanding city by city across
            Indonesia — Jakarta, Bali, Surabaya, Yogyakarta, and beyond.
          </p>

          <h2 className="text-lg font-bold text-[var(--foreground)] pt-2">
            For cafe owners
          </h2>

          <p>
            If you own a cafe in Bandung and want to update your listing, add
            photos, or claim your page, reach out to us. We want every cafe
            represented accurately.
          </p>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="text-[14px] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            ← Back to Cafepedia
          </Link>
        </div>
      </main>

      {/* Schema.org Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Cafepedia",
            url: "https://cafepedia.id",
            description:
              "The vertical search engine for cafes in Indonesia. 678+ verified cafes in Bandung with AI-powered recommendations.",
            foundingLocation: {
              "@type": "Place",
              name: "Bandung, Indonesia",
            },
            sameAs: [],
          }),
        }}
      />
    </div>
  );
}
