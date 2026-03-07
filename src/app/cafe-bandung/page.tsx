import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.cafepedia.id";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Cafe Bandung — 4.000+ Cafe, Bar & Rooftop Terlengkap | Cafepedia",
  description:
    "Daftar cafe di Bandung paling lengkap: 4.000+ tempat dengan foto, rating, jam buka, dan lokasi. Temukan cafe terbaik berdasarkan suasana, area, atau biarkan AI pilihkan.",
  alternates: { canonical: "https://cafepedia.id/cafe-bandung" },
  openGraph: {
    title: "Cafe Bandung — Daftar Terlengkap | Cafepedia",
    description:
      "4.000+ cafe, bar, rooftop & coworking di Bandung. Cari berdasarkan suasana, area, atau AI.",
    url: "https://cafepedia.id/cafe-bandung",
    siteName: "Cafepedia",
    type: "website",
  },
};

interface Cafe {
  id: number;
  name: string;
  area?: string;
  rating?: number;
  rating_count?: number;
  tags?: string[];
  description?: string;
  hero_photo?: string;
}

function makeSlug(id: number, name: string): string {
  const s = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${id}-${s}`;
}

async function getTopCafes(): Promise<Cafe[]> {
  try {
    const r = await fetch(
      `${API_BASE}/search?q=popular&city=Bandung&per_page=30`,
      { next: { revalidate: 3600 } }
    );
    const data = await r.json();
    return (data.results || []).filter((c: Cafe) => c.hero_photo && c.rating && c.rating >= 4.0);
  } catch {
    return [];
  }
}

const CATEGORIES = [
  { slug: "cafe", label: "Cafe", count: "3.700+" },
  { slug: "restaurant", label: "Restoran", count: "247" },
  { slug: "bar", label: "Bar & Lounge", count: "150" },
  { slug: "rooftop", label: "Rooftop", count: "148" },
  { slug: "bakery", label: "Bakery", count: "144" },
  { slug: "dessert", label: "Dessert", count: "111" },
  { slug: "tea_house", label: "Tea House", count: "101" },
  { slug: "coworking", label: "Coworking", count: "75" },
  { slug: "late_night", label: "Late Night", count: "72" },
  { slug: "game_room", label: "Game Room", count: "62" },
];

const AREAS = [
  "Dago", "Braga", "Pasir Kaliki", "Buah Batu", "Setiabudhi",
  "Cihampelas", "Riau", "Dipatiukur", "Ciumbuleuit", "Lembang",
  "Punclut", "Cimahi", "Ujungberung", "Gedebage", "Antapani",
];

const GUIDES = [
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
  { href: "/date-cafes-bandung", label: "Cafe untuk kencan" },
];

const FAQ = [
  {
    q: "Berapa jumlah cafe di Bandung?",
    a: "Cafepedia mencatat lebih dari 4.000 cafe, bar, rooftop, dan tempat nongkrong di Bandung, tersebar di 100+ area dari Dago hingga Lembang.",
  },
  {
    q: "Area mana yang paling banyak cafe di Bandung?",
    a: "Dago, Braga, Riau, Pasir Kaliki, dan Setiabudhi adalah area dengan konsentrasi cafe tertinggi. Dago terkenal dengan cafe hillside dan pemandangan, sementara Braga dikenal dengan cafe heritage dan aesthetic.",
  },
  {
    q: "Bagaimana cara menemukan cafe terbaik di Bandung?",
    a: "Gunakan Cafepedia — cari berdasarkan suasana (cozy, aesthetic, quiet), area, atau fitur AI 'Pilihkan untukku' yang merekomendasikan 3 cafe terbaik sesuai keinginanmu.",
  },
  {
    q: "Apakah ada cafe 24 jam di Bandung?",
    a: "Ada beberapa cafe dan tempat nongkrong yang buka hingga larut malam atau 24 jam di Bandung. Cari dengan filter 'Late Night' di Cafepedia untuk menemukannya.",
  },
  {
    q: "Cafe mana yang bagus untuk kerja di Bandung?",
    a: "Bandung punya banyak cafe work-friendly dengan WiFi cepat, colokan, dan suasana tenang. Lihat panduan lengkap cafe untuk kerja di Cafepedia.",
  },
];

export default async function CafeBandungPage() {
  const cafes = await getTopCafes();

  return (
    <div className="min-h-dvh bg-[var(--background)]">
      <header className="sticky top-0 z-20 bg-[var(--background)]/95 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center gap-3">
          <Link href="/" className="text-[var(--muted)] text-sm font-medium p-2 -ml-2">
            &larr; Cafepedia
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 pb-16">
        {/* Breadcrumb */}
        <nav className="mt-4 text-[12px] text-[var(--muted2)]" aria-label="Breadcrumb">
          <ol className="flex items-center gap-1">
            <li><Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link></li>
            <li>/</li>
            <li className="text-[var(--muted)] font-medium">Cafe Bandung</li>
          </ol>
        </nav>

        {/* H1 */}
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-4 leading-tight">
          Cafe Bandung
        </h1>
        <p className="mt-3 text-[16px] leading-relaxed text-[var(--muted)]">
          Daftar lengkap cafe, bar, rooftop, dan tempat nongkrong di Bandung.
          Lebih dari <strong className="text-[var(--foreground)]">4.000 tempat</strong> dengan foto, rating, jam buka, dan lokasi —
          semuanya bisa dicari berdasarkan suasana, area, atau rekomendasi AI.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="text-center py-4 rounded-xl bg-gray-50">
            <p className="text-2xl font-black text-[var(--foreground)]">4.297</p>
            <p className="text-[12px] text-[var(--muted)] mt-0.5">Tempat</p>
          </div>
          <div className="text-center py-4 rounded-xl bg-gray-50">
            <p className="text-2xl font-black text-[var(--foreground)]">17</p>
            <p className="text-[12px] text-[var(--muted)] mt-0.5">Kategori</p>
          </div>
          <div className="text-center py-4 rounded-xl bg-gray-50">
            <p className="text-2xl font-black text-[var(--foreground)]">100+</p>
            <p className="text-[12px] text-[var(--muted)] mt-0.5">Area</p>
          </div>
        </div>

        {/* CTA search */}
        <div className="mt-6 flex gap-2">
          <Link
            href="/search?q=*"
            className="flex-1 text-center px-5 py-3 rounded-xl bg-[var(--foreground)] text-white text-[14px] font-semibold hover:opacity-90 transition-all"
          >
            Cari Cafe
          </Link>
          <Link
            href="/pick"
            className="flex-1 text-center px-5 py-3 rounded-xl border border-gray-200 text-[var(--foreground)] text-[14px] font-semibold hover:bg-gray-50 transition-all"
          >
            ✨ AI Pilihkan
          </Link>
        </div>

        {/* Categories */}
        <section className="mt-10">
          <h2 className="text-xl font-bold tracking-tight">Kategori</h2>
          <p className="text-[13px] text-[var(--muted)] mt-1">Jelajahi berdasarkan jenis tempat</p>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/search?category=${cat.slug}`}
                className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 hover:border-[var(--accent)] transition-colors group"
              >
                <span className="text-[14px] font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
                  {cat.label}
                </span>
                <span className="text-[12px] text-[var(--muted2)]">{cat.count}</span>
              </Link>
            ))}
          </div>
          <Link href="/browse" className="text-[13px] text-[var(--accent)] font-semibold mt-3 inline-block">
            Lihat semua 17 kategori &rarr;
          </Link>
        </section>

        {/* Top Cafes */}
        {cafes.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold tracking-tight">Cafe Populer di Bandung</h2>
            <p className="text-[13px] text-[var(--muted)] mt-1">Rating tertinggi, paling dicari</p>
            <div className="mt-4 space-y-0">
              {cafes.slice(0, 20).map((cafe, idx) => (
                <Link
                  key={cafe.id}
                  href={`/cafe/${makeSlug(cafe.id, cafe.name)}`}
                  className="flex gap-4 py-4 border-b border-gray-100 active:opacity-60 transition-opacity"
                >
                  <div className="w-6 flex-shrink-0 flex items-start justify-center pt-1">
                    <span className="text-[13px] font-bold text-[var(--muted2)]">{idx + 1}</span>
                  </div>
                  {cafe.hero_photo ? (
                    <Image
                      src={cafe.hero_photo}
                      alt={cafe.name}
                      width={96}
                      height={96}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                      loading={idx < 3 ? "eager" : "lazy"}
                      sizes="(max-width: 640px) 80px, 96px"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center text-2xl">
                      ☕
                    </div>
                  )}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="font-semibold text-[15px] leading-tight truncate">{cafe.name}</h3>
                    <p className="text-[13px] text-[var(--muted)] mt-0.5">{cafe.area}</p>
                    {cafe.rating && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[13px] text-amber-500 font-semibold">★ {cafe.rating}</span>
                        {cafe.rating_count && (
                          <span className="text-xs text-[var(--muted2)]">({cafe.rating_count.toLocaleString()})</span>
                        )}
                      </div>
                    )}
                    {cafe.description && (
                      <p className="text-[12px] text-[var(--muted2)] mt-1 line-clamp-1">{cafe.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            <Link
              href="/search?q=*"
              className="text-[13px] text-[var(--accent)] font-semibold mt-4 inline-block"
            >
              Lihat semua 4.297 tempat &rarr;
            </Link>
          </section>
        )}

        {/* Areas */}
        <section className="mt-10">
          <h2 className="text-xl font-bold tracking-tight">Area Populer</h2>
          <p className="text-[13px] text-[var(--muted)] mt-1">Cari cafe berdasarkan lokasi</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {AREAS.map((area) => (
              <Link
                key={area}
                href={`/search?q=${encodeURIComponent(area)}`}
                className="px-4 py-2 rounded-full border border-gray-200 text-[13px] font-semibold text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
              >
                {area}
              </Link>
            ))}
          </div>
        </section>

        {/* Guides */}
        <section className="mt-10">
          <h2 className="text-xl font-bold tracking-tight">Panduan Cafe Bandung</h2>
          <p className="text-[13px] text-[var(--muted)] mt-1">Rekomendasi berdasarkan kebutuhan</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            {GUIDES.map((g) => (
              <Link
                key={g.href}
                href={g.href}
                className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 hover:border-[var(--accent)] transition-colors group"
              >
                <span className="text-[14px] text-[var(--foreground)] group-hover:text-[var(--accent)]">{g.label}</span>
                <span className="text-[var(--muted)] text-sm group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Blog */}
        <section className="mt-10">
          <h2 className="text-xl font-bold tracking-tight">Artikel</h2>
          <div className="flex flex-col gap-2 mt-3">
            <Link href="/blog/best-cafes-bandung-2026" className="text-[14px] text-[var(--accent)] hover:underline">
              Best Cafes in Bandung 2026 — Panduan Lengkap
            </Link>
            <Link href="/blog/work-friendly-cafes-bandung" className="text-[14px] text-[var(--accent)] hover:underline">
              Work-Friendly Cafes in Bandung
            </Link>
            <Link href="/blog/bandung-cafe-guide-by-area" className="text-[14px] text-[var(--accent)] hover:underline">
              Bandung Cafe Guide by Area
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-10">
          <h2 className="text-xl font-bold tracking-tight">Pertanyaan Umum</h2>
          <div className="space-y-3 mt-4">
            {FAQ.map((item, i) => (
              <details key={i} className="group">
                <summary className="cursor-pointer text-[14px] font-medium py-2 list-none flex items-center justify-between">
                  {item.q}
                  <span className="text-[var(--muted2)] group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="text-[14px] text-[var(--muted)] leading-relaxed pb-2">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Back */}
        <div className="mt-12 text-center">
          <Link href="/" className="text-[14px] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
            &larr; Kembali ke Cafepedia
          </Link>
        </div>
      </main>

      {/* Schema.org @graph */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "CollectionPage",
                "@id": "https://cafepedia.id/cafe-bandung#webpage",
                "url": "https://cafepedia.id/cafe-bandung",
                "name": "Cafe Bandung",
                "description": "Daftar lengkap 4.000+ cafe, bar, rooftop di Bandung",
                "isPartOf": { "@id": "https://cafepedia.id#website" },
                "breadcrumb": { "@id": "https://cafepedia.id/cafe-bandung#breadcrumb" },
              },
              {
                "@type": "Organization",
                "@id": "https://cafepedia.id#organization",
                "name": "Cafepedia",
                "url": "https://cafepedia.id",
                "logo": "https://cafepedia.id/logo-icon.svg",
              },
              {
                "@type": "WebSite",
                "@id": "https://cafepedia.id#website",
                "url": "https://cafepedia.id",
                "name": "Cafepedia",
                "publisher": { "@id": "https://cafepedia.id#organization" },
              },
              {
                "@type": "BreadcrumbList",
                "@id": "https://cafepedia.id/cafe-bandung#breadcrumb",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cafepedia.id" },
                  { "@type": "ListItem", "position": 2, "name": "Cafe Bandung" },
                ],
              },
              {
                "@type": "FAQPage",
                "@id": "https://cafepedia.id/cafe-bandung#faq",
                "mainEntity": FAQ.map((item) => ({
                  "@type": "Question",
                  "name": item.q,
                  "acceptedAnswer": { "@type": "Answer", "text": item.a },
                })),
              },
            ],
          }),
        }}
      />
    </div>
  );
}
