import { Metadata } from "next";
import Link from "next/link";
import {
  UtensilsCrossed, Wine, Sunrise, Cake, Leaf,
  Briefcase, Moon, Gamepad2, Sparkles, Mic2, Target, Clapperboard,
  PawPrint, BookOpen, Heart, Mountain,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Explore Bandung — Cafepedia",
  description:
    "Jelajahi tempat-tempat seru di Bandung: restoran, bar, rooftop, karaoke, billiard, dan lainnya. Temukan tempat favorit kamu.",
  alternates: { canonical: "https://cafepedia.id/browse" },
  openGraph: {
    title: "Explore Bandung — Cafepedia",
    description: "Jelajahi tempat-tempat seru di Bandung selain cafe.",
    url: "https://cafepedia.id/browse",
    siteName: "Cafepedia",
    type: "website",
  },
};

const EXPLORE_CATEGORIES = [
  { slug: "restaurant", label: "Restoran", icon: UtensilsCrossed, color: "bg-orange-50 text-orange-500", count: 247 },
  { slug: "bar", label: "Bar & Lounge", icon: Wine, color: "bg-purple-50 text-purple-500", count: 150 },
  { slug: "rooftop", label: "Rooftop", icon: Mountain, color: "bg-sky-50 text-sky-500", count: 148 },
  { slug: "bakery", label: "Bakery", icon: Cake, color: "bg-amber-50 text-amber-600", count: 144 },
  { slug: "dessert", label: "Dessert", icon: Sparkles, color: "bg-pink-50 text-pink-500", count: 111 },
  { slug: "tea_house", label: "Tea House", icon: Leaf, color: "bg-green-50 text-green-600", count: 101 },
  { slug: "coworking", label: "Coworking", icon: Briefcase, color: "bg-blue-50 text-blue-500", count: 75 },
  { slug: "late_night", label: "Late Night", icon: Moon, color: "bg-indigo-50 text-indigo-500", count: 72 },
  { slug: "game_room", label: "Game Room", icon: Gamepad2, color: "bg-red-50 text-red-500", count: 62 },
  { slug: "spa_wellness", label: "Spa & Wellness", icon: Heart, color: "bg-rose-50 text-rose-500", count: 58 },
  { slug: "karaoke", label: "Karaoke", icon: Mic2, color: "bg-fuchsia-50 text-fuchsia-500", count: 52 },
  { slug: "billiard", label: "Billiard", icon: Target, color: "bg-emerald-50 text-emerald-600", count: 51 },
  { slug: "brunch", label: "Brunch", icon: Sunrise, color: "bg-yellow-50 text-yellow-600", count: 42 },
  { slug: "bookstore_cafe", label: "Bookstore Cafe", icon: BookOpen, color: "bg-stone-100 text-stone-600", count: 41 },
  { slug: "pet_cafe", label: "Pet Cafe", icon: PawPrint, color: "bg-lime-50 text-lime-600", count: 34 },
  { slug: "cinema", label: "Cinema", icon: Clapperboard, color: "bg-slate-100 text-slate-600", count: 12 },
];

const CAFE_PAGES = [
  { href: "/best-cafes-bandung", label: "Cafe terbaik di Bandung" },
  { href: "/best-cafes-to-work-bandung", label: "Cafe untuk kerja" },
  { href: "/aesthetic-cafes-bandung", label: "Cafe aesthetic" },
  { href: "/cheap-cafes-bandung", label: "Cafe murah" },
  { href: "/outdoor-cafes-bandung", label: "Cafe outdoor" },
  { href: "/rooftop-cafes-bandung", label: "Cafe rooftop" },
  { href: "/cozy-cafes-bandung", label: "Cafe cozy" },
  { href: "/quiet-cafes-bandung", label: "Cafe tenang" },
  { href: "/late-night-cafes-bandung", label: "Cafe buka malam" },
  { href: "/brunch-cafes-bandung", label: "Cafe brunch" },
];

export default function BrowsePage() {
  return (
    <div className="min-h-dvh bg-white">
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-3">
          <Link
            href="/"
            className="text-[var(--muted)] text-sm font-medium p-2 -ml-2"
          >
            &larr; Cafepedia
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 pb-16">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-8 leading-tight">
          Explore Bandung
        </h1>

        <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
          Selain cafe, Bandung punya banyak tempat seru untuk dijelajahi.
          Temukan restoran, bar, rooftop, dan lainnya.
        </p>

        {/* Explore Categories Grid */}
        <section className="mt-10">
          <h2 className="text-[13px] font-bold text-[var(--foreground)] uppercase tracking-wider mb-5">
            Kategori
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {EXPLORE_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.slug}
                  href={`/search?category=${cat.slug}`}
                  className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 hover:border-[var(--accent)] hover:shadow-sm transition-all group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cat.color}`}>
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[14px] font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors block">
                      {cat.label}
                    </span>
                    <span className="text-[12px] text-[var(--muted)]">
                      {cat.count} tempat
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Cafe Pages (SEO) */}
        <section className="mt-12">
          <h2 className="text-[13px] font-bold text-[var(--foreground)] uppercase tracking-wider mb-5">
            Panduan Cafe
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CAFE_PAGES.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 hover:border-[var(--accent)] transition-colors group"
              >
                <span className="text-[14px] text-[var(--foreground)] group-hover:text-[var(--accent)]">
                  {c.label}
                </span>
                <span className="text-[var(--muted)] text-sm group-hover:translate-x-0.5 transition-transform">
                  &rarr;
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section className="mt-12">
          <h2 className="text-[13px] font-bold text-[var(--foreground)] uppercase tracking-wider mb-5">
            Lainnya
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/search" className="px-4 py-2 rounded-full border border-gray-100 text-[13px] hover:border-[var(--accent)] transition-colors">
              Cari semua cafe
            </Link>
            <Link href="/pick" className="px-4 py-2 rounded-full border border-gray-100 text-[13px] hover:border-[var(--accent)] transition-colors">
              AI Pilihkan
            </Link>
            <Link href="/blog" className="px-4 py-2 rounded-full border border-gray-100 text-[13px] hover:border-[var(--accent)] transition-colors">
              Blog
            </Link>
            <Link href="/suggest" className="px-4 py-2 rounded-full border border-gray-100 text-[13px] hover:border-[var(--accent)] transition-colors">
              Sarankan Tempat
            </Link>
          </div>
        </section>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-[13px] text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
          >
            &larr; Kembali ke Cafepedia
          </Link>
        </div>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Cafepedia", item: "https://cafepedia.id" },
              { "@type": "ListItem", position: 2, name: "Explore Bandung", item: "https://cafepedia.id/browse" },
            ],
          }),
        }}
      />
    </div>
  );
}
