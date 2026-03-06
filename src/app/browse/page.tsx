import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Browse Cafes in Bandung — Cafepedia",
  description:
    "Browse all cafe categories, areas, and discovery pages in Bandung. Find the best cafes to work, date spots, aesthetic cafes, cheap coffee, and more on Cafepedia.",
  alternates: { canonical: "https://cafepedia.id/browse" },
  openGraph: {
    title: "Browse Cafes in Bandung — Cafepedia",
    description:
      "Browse all cafe categories, areas, and discovery pages in Bandung.",
    url: "https://cafepedia.id/browse",
    siteName: "Cafepedia",
    type: "website",
  },
};

const categories = [
  { href: "/best-cafes-bandung", label: "Best Cafes in Bandung" },
  { href: "/best-cafes-to-work-bandung", label: "Best Cafes to Work in Bandung" },
  { href: "/aesthetic-cafes-bandung", label: "Aesthetic Cafes in Bandung" },
  { href: "/cheap-cafes-bandung", label: "Cheap Cafes in Bandung" },
  { href: "/date-cafes-bandung", label: "Date Cafes in Bandung" },
  { href: "/outdoor-cafes-bandung", label: "Outdoor Cafes in Bandung" },
  { href: "/pet-friendly-cafes-bandung", label: "Pet-Friendly Cafes in Bandung" },
  { href: "/best-coffee-bandung", label: "Best Coffee in Bandung" },
  { href: "/cozy-cafes-bandung", label: "Cozy Cafes in Bandung" },
  { href: "/instagrammable-cafes-bandung", label: "Instagrammable Cafes in Bandung" },
  { href: "/cafes-with-view-bandung", label: "Cafes with View in Bandung" },
  { href: "/family-cafes-bandung", label: "Family Cafes in Bandung" },
  { href: "/late-night-cafes-bandung", label: "Late Night Cafes in Bandung" },
  { href: "/brunch-cafes-bandung", label: "Brunch Cafes in Bandung" },
  { href: "/live-music-cafes-bandung", label: "Live Music Cafes in Bandung" },
  { href: "/rooftop-cafes-bandung", label: "Rooftop Cafes in Bandung" },
  { href: "/quiet-cafes-bandung", label: "Quiet Cafes in Bandung" },
  { href: "/group-friendly-cafes-bandung", label: "Group-Friendly Cafes in Bandung" },
  { href: "/cafes-dago-bandung", label: "Cafes in Dago Bandung" },
  { href: "/cafes-braga-bandung", label: "Cafes in Braga Bandung" },
];

const areas = [
  "Dago",
  "Braga",
  "Dipatiukur",
  "Ciumbuleuit",
  "Setiabudi",
  "Buah Batu",
  "Pasteur",
  "Riau",
  "Cihampelas",
  "Lembang",
];

const explore = [
  { href: "/search", label: "Search all cafes" },
  { href: "/pick", label: "AI Pick for me" },
  { href: "/blog", label: "Blog" },
  { href: "/suggest", label: "Suggest a Cafe" },
];

export default function BrowsePage() {
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
          Browse Cafes in Bandung
        </h1>

        <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
          Explore 678+ verified cafes in Bandung by category, area, or use our
          AI-powered tools to find the perfect spot. Every page is built from
          real data — ratings, reviews, photos, and curated tags.
        </p>

        {/* By Category */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-[var(--foreground)]">
            By Category
          </h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {categories.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="flex items-center justify-between px-4 py-3 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors group"
              >
                <span className="text-[15px] text-[var(--foreground)] group-hover:text-[var(--accent)]">
                  {c.label}
                </span>
                <span className="text-[var(--muted)] text-sm group-hover:translate-x-0.5 transition-transform">
                  &rarr;
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* By Area */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-[var(--foreground)]">
            By Area
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {areas.map((area) => (
              <Link
                key={area}
                href={`/search?q=cafe+${encodeURIComponent(area)}`}
                className="px-4 py-2 rounded-full border border-[var(--border)] text-[14px] text-[var(--foreground)] hover:bg-[var(--bg-secondary)] hover:border-[var(--accent)] transition-colors"
              >
                {area}
              </Link>
            ))}
          </div>
        </section>

        {/* Explore */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-[var(--foreground)]">
            Explore
          </h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {explore.map((e) => (
              <Link
                key={e.href}
                href={e.href}
                className="flex items-center justify-between px-4 py-3 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors group"
              >
                <span className="text-[15px] text-[var(--foreground)] group-hover:text-[var(--accent)]">
                  {e.label}
                </span>
                <span className="text-[var(--muted)] text-sm group-hover:translate-x-0.5 transition-transform">
                  &rarr;
                </span>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="text-[14px] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            &larr; Back to Cafepedia
          </Link>
        </div>
      </main>

      {/* Schema.org BreadcrumbList for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Cafepedia",
                item: "https://cafepedia.id",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Browse Cafes in Bandung",
                item: "https://cafepedia.id/browse",
              },
            ],
          }),
        }}
      />
    </div>
  );
}
