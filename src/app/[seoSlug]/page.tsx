import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";
const SUPABASE_URL = "https://fkpxolnsqjfgcbkiqbld.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrcHhvbG5zcWpmZ2Nia2lxYmxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NzM5MTMsImV4cCI6MjA4ODI0OTkxM30.zVk8B3AxLCWkgomZxxsoOCQkugAmVxphjtGtFwkCJdE";

interface SeoPage {
  id: number;
  slug: string;
  city: string;
  intent: string;
  title: string;
  meta_description: string;
  intro_text: string;
  faq_json: { q: string; a: string }[];
  tag_filters: string[];
  area_filter: string | null;
  sort_by: string;
  cafe_limit: number;
  related_slugs: string[];
  is_published: boolean;
}

interface Cafe {
  id: number;
  name: string;
  area?: string;
  rating?: number;
  reviews?: number;
  price_range?: string;
  tags?: string[];
  description?: string;
  hero_photo?: string;
  photos?: string[];
}

function makeSlug(id: number, name: string): string {
  const s = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${id}-${s}`;
}

function formatPrice(price?: string) {
  if (!price) return null;
  const count = (price.match(/★/g) || []).length;
  return count > 0 ? "$".repeat(count) : null;
}

function getReasonForIntent(tags: string[], intent: string): string | null {
  const reasons: Record<string, Record<string, string>> = {
    "work_friendly": { work_friendly: "WiFi & colokan tersedia", quiet: "Suasana tenang untuk fokus", coworking: "Ruang coworking" },
    "aesthetic": { aesthetic: "Desain interior estetik", instagrammable: "Spot foto Instagramable", modern: "Konsep modern & stylish" },
    "budget": { budget: "Harga terjangkau", mid_range: "Harga menengah" },
    "outdoor": { outdoor: "Area outdoor tersedia", garden: "Taman & area hijau", rooftop_view: "Pemandangan rooftop" },
    "date_spot": { date_spot: "Cocok untuk kencan", romantic: "Suasana romantis", elegant: "Suasana elegan" },
    "quiet": { quiet: "Suasana tenang", cozy: "Nyaman & cozy" },
    "hidden_gem": { hidden_gem: "Tersembunyi & unik" },
    "premium": { premium: "Kualitas premium", upscale: "Suasana upscale", elegant: "Desain elegan" },
    "late_night": { late_night: "Buka sampai malam" },
    "specialty_coffee": { specialty_coffee: "Kopi spesialti", roastery: "Roastery sendiri" },
    "cozy": { cozy: "Nyaman & homey", rustic: "Nuansa rustic" },
    "top_rated": { top_rated: "Rating tertinggi", popular: "Populer di Bandung" },
  };

  // Find matching intent from page tags
  const intentKey = Object.keys(reasons).find(k =>
    tags.some(t => reasons[k][t])
  );
  if (!intentKey) return null;

  const matched = tags
    .filter(t => reasons[intentKey]?.[t])
    .map(t => reasons[intentKey][t])
    .slice(0, 2);
  return matched.length > 0 ? matched.join(" · ") : null;
}

function formatTag(tag: string) {
  return tag.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

async function getSeoPage(slug: string): Promise<SeoPage | null> {
  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/seo_pages?slug=eq.${slug}&is_published=eq.true&limit=1`,
    {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      next: { revalidate: 3600 },
    }
  );
  const data = await r.json();
  if (!data[0]) return null;
  const page = data[0];
  // Parse JSON string fields from Supabase
  if (typeof page.tag_filters === "string") page.tag_filters = JSON.parse(page.tag_filters);
  if (typeof page.faq_json === "string") page.faq_json = JSON.parse(page.faq_json);
  if (typeof page.related_slugs === "string") page.related_slugs = JSON.parse(page.related_slugs);
  return page;
}

async function getCafesForPage(page: SeoPage): Promise<Cafe[]> {
  // Build search query based on filters
  const tags = page.tag_filters || [];
  const area = page.area_filter;
  const limit = page.cafe_limit || 20;

  const params = new URLSearchParams();
  params.set("q", area || "*");
  if (tags.length > 0) params.set("tags", tags.join(","));
  // Fetch extra to allow filtering and still have enough results
  params.set("limit", String(Math.max(limit * 2, 40)));

  const r = await fetch(`${API_BASE}/search?${params}`, {
    next: { revalidate: 3600 },
  });
  const data = await r.json();

  let results: Cafe[] = data.results || [];

  // Filter: only rating >= 4.0 (keep unrated ones at bottom)
  results = results.filter((c) => !c.rating || c.rating >= 4.0);

  // Check if this is an aesthetic/visual intent — only show cafes with photos
  const isVisualIntent = tags.some((t) =>
    ["aesthetic", "instagrammable", "modern"].includes(t)
  );
  if (isVisualIntent) {
    results = results.filter((c) => c.hero_photo);
  }

  // Sort: tag match count desc, then has photo, then rating desc
  results.sort((a, b) => {
    // Tag match score
    const aTagScore = tags.filter((t) => (a.tags || []).includes(t)).length;
    const bTagScore = tags.filter((t) => (b.tags || []).includes(t)).length;
    if (bTagScore !== aTagScore) return bTagScore - aTagScore;

    // Prefer cafes with photos
    const aHasPhoto = a.hero_photo ? 1 : 0;
    const bHasPhoto = b.hero_photo ? 1 : 0;
    if (bHasPhoto !== aHasPhoto) return bHasPhoto - aHasPhoto;

    // Then by rating
    return (b.rating || 0) - (a.rating || 0);
  });

  return results.slice(0, limit);
}

async function getRelatedPages(slugs: string[]): Promise<SeoPage[]> {
  if (!slugs.length) return [];
  const filter = slugs.map((s) => `slug.eq.${s}`).join(",");
  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/seo_pages?or=(${filter})&is_published=eq.true&select=slug,title`,
    {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      next: { revalidate: 3600 },
    }
  );
  return r.json();
}

// ISR: regenerate pages every hour
export const revalidate = 3600;
export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ seoSlug: string }>;
}): Promise<Metadata> {
  const { seoSlug } = await params;
  const page = await getSeoPage(seoSlug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.meta_description,
    alternates: { canonical: `https://cafepedia.id/${page.slug}` },
    openGraph: {
      title: page.title,
      description: page.meta_description,
      url: `https://cafepedia.id/${page.slug}`,
      siteName: "Cafepedia",
      type: "website",
    },
  };
}

export default async function SeoPage({
  params,
}: {
  params: Promise<{ seoSlug: string }>;
}) {
  const { seoSlug } = await params;
  const page = await getSeoPage(seoSlug);
  if (!page) notFound();

  const [cafes, related] = await Promise.all([
    getCafesForPage(page),
    getRelatedPages(page.related_slugs || []),
  ]);

  const faq =
    typeof page.faq_json === "string"
      ? JSON.parse(page.faq_json)
      : page.faq_json || [];

  return (
    <div className="min-h-dvh">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/92 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-[var(--muted)] text-sm font-medium p-2 -ml-2">
            ← Cafepedia
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-12">
        {/* Breadcrumb */}
        <nav className="mt-4 text-[12px] text-[var(--muted2)]" aria-label="Breadcrumb">
          <ol className="flex items-center gap-1">
            <li><Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/best-cafes-bandung" className="hover:text-[var(--foreground)] transition-colors">{page.city}</Link></li>
            <li>/</li>
            <li className="text-[var(--muted)] font-medium">{page.intent}</li>
          </ol>
        </nav>

        {/* H1 */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-3 leading-tight">
          {page.title}
        </h1>

        {/* Hero image */}
        {cafes.length > 0 && cafes[0].hero_photo && (
          <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden mt-4">
            <Image
              src={cafes[0].hero_photo}
              alt={page.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
              priority
            />
          </div>
        )}

        {/* Intro */}
        {page.intro_text && (
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
            {page.intro_text}
          </p>
        )}

        {/* Cafe count */}
        <p className="mt-4 text-xs text-[var(--muted2)]">
          {cafes.length} cafe ditemukan
        </p>

        {/* Cafe List */}
        <div className="mt-2">
          {cafes.map((cafe, idx) => (
            <Link
              key={cafe.id}
              href={`/cafe/${makeSlug(cafe.id, cafe.name)}`}
              className="flex gap-4 py-4 border-b border-[var(--surface)] active:opacity-60 transition-opacity"
            >
              {/* Rank */}
              <div className="w-6 flex-shrink-0 flex items-start justify-center pt-1">
                <span className="text-[13px] font-bold text-[var(--muted2)]">
                  {idx + 1}
                </span>
              </div>

              {/* Photo */}
              {cafe.hero_photo ? (
                <Image
                  src={cafe.hero_photo}
                  alt={cafe.name}
                  width={96}
                  height={96}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover flex-shrink-0 bg-[var(--surface)]"
                  loading={idx < 3 ? "eager" : "lazy"}
                  sizes="(max-width: 640px) 80px, 96px"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[var(--surface)] flex-shrink-0 flex items-center justify-center text-[var(--muted2)] text-2xl">
                  ☕
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h2 className="font-semibold text-[15px] leading-tight truncate">
                  {cafe.name}
                </h2>
                <p className="text-[13px] text-[var(--muted)] mt-0.5">
                  {cafe.area}
                  {cafe.price_range && ` · ${formatPrice(cafe.price_range) || cafe.price_range}`}
                </p>
                {cafe.rating && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[13px] text-[var(--orange)] font-semibold">
                      ★ {cafe.rating}
                    </span>
                    {cafe.reviews && (
                      <span className="text-xs text-[var(--muted2)]">
                        ({Number(cafe.reviews).toLocaleString()})
                      </span>
                    )}
                  </div>
                )}
                {/* Short reason why this cafe fits the intent */}
                {cafe.description && (
                  <p className="text-[12px] text-[var(--muted2)] mt-1.5 line-clamp-2">
                    {cafe.description}
                  </p>
                )}
                {/* Why this cafe fits */}
                {(() => {
                  const reason = getReasonForIntent(cafe.tags || [], page.intent);
                  return reason ? (
                    <p className="text-[11px] text-green-700 bg-green-50 px-2 py-0.5 rounded mt-1.5 inline-block">
                      {reason}
                    </p>
                  ) : null;
                })()}
              </div>
            </Link>
          ))}
        </div>

        {/* FAQ */}
        {faq.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold mb-4">
              Pertanyaan Umum
            </h2>
            <div className="space-y-4">
              {faq.map((item: { q: string; a: string }, i: number) => (
                <details key={i} className="group">
                  <summary className="cursor-pointer text-[14px] font-medium py-2 list-none flex items-center justify-between">
                    {item.q}
                    <span className="text-[var(--muted2)] group-open:rotate-180 transition-transform">
                      ▾
                    </span>
                  </summary>
                  <p className="text-[14px] text-[var(--muted)] leading-relaxed pb-2 pl-0">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Related Pages */}
        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold mb-3">Jelajahi Lainnya</h2>
            <div className="flex flex-wrap gap-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${r.slug}`}
                  className="text-[13px] px-4 py-2 rounded-full border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface)] transition-colors"
                >
                  {r.title.replace(/ — .*$/, "")}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Blog articles — show relevant ones first based on page intent/tags */}
        {(() => {
          const allArticles = [
            { href: "/blog/best-cafes-bandung-2026", label: "Best Cafes in Bandung 2026", keywords: ["best", "top_rated", "popular", "premium", "aesthetic", "hidden_gem", "date_spot"] },
            { href: "/blog/work-friendly-cafes-bandung", label: "Work-Friendly Cafes in Bandung", keywords: ["work_friendly", "coworking", "quiet", "wifi", "budget"] },
            { href: "/blog/bandung-cafe-guide-by-area", label: "Bandung Cafe Guide by Area", keywords: ["dago", "braga", "riau", "ciumbuleuit", "buah_batu", "pasir_kaliki", "area"] },
          ];
          const pageTags = page.tag_filters || [];
          const pageIntent = (page.intent || "").toLowerCase();
          const pageArea = (page.area_filter || "").toLowerCase();

          // Score each article by relevance
          const scored = allArticles.map((a) => {
            let score = 0;
            for (const kw of a.keywords) {
              if (pageTags.includes(kw)) score += 2;
              if (pageIntent.includes(kw)) score += 2;
              if (pageArea.includes(kw)) score += 2;
            }
            return { ...a, score };
          });

          // Sort by score desc, take top 2 relevant + always show at least 1
          scored.sort((a, b) => b.score - a.score);
          // Show articles with score > 0 first, then fill up to 3
          const relevant = scored.filter((a) => a.score > 0);
          const rest = scored.filter((a) => a.score === 0);
          const toShow = [...relevant, ...rest].slice(0, 3);

          return (
            <section className="mt-8">
              <h3 className="text-sm font-semibold text-[var(--muted)] mb-2">Artikel Terkait</h3>
              <div className="flex flex-col gap-1">
                {toShow.map((a) => (
                  <Link key={a.href} href={a.href} className="text-[13px] text-[var(--muted2)] hover:text-[var(--foreground)] transition-colors">
                    {a.label}
                  </Link>
                ))}
              </div>
            </section>
          );
        })()}

        {/* Schema.org FAQ */}
        {faq.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faq.map((item: { q: string; a: string }) => ({
                  "@type": "Question",
                  name: item.q,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: item.a,
                  },
                })),
              }),
            }}
          />
        )}

        {/* Schema.org ItemList */}
        {cafes.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                name: page.title,
                description: page.meta_description,
                numberOfItems: cafes.length,
                itemListElement: cafes.map((cafe, idx) => ({
                  "@type": "ListItem",
                  position: idx + 1,
                  item: {
                    "@type": "CafeOrCoffeeShop",
                    name: cafe.name,
                    url: `https://cafepedia.id/cafe/${makeSlug(cafe.id, cafe.name)}`,
                    ...(cafe.area && { address: { "@type": "PostalAddress", addressLocality: cafe.area, addressRegion: "West Java", addressCountry: "ID" } }),
                    ...(cafe.rating && { aggregateRating: { "@type": "AggregateRating", ratingValue: cafe.rating, bestRating: 5, ...(cafe.reviews && { reviewCount: cafe.reviews }) } }),
                    ...(cafe.hero_photo && { image: cafe.hero_photo }),
                    ...(cafe.description && { description: cafe.description }),
                  },
                })),
              }),
            }}
          />
        )}

        {/* Schema.org BreadcrumbList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://cafepedia.id" },
                { "@type": "ListItem", position: 2, name: page.city, item: `https://cafepedia.id/best-cafes-bandung` },
                { "@type": "ListItem", position: 3, name: page.intent },
              ],
            }),
          }}
        />

        {/* Back to home */}
        <div className="mt-10 text-center">
          <Link
            href="/"
            className="text-[14px] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            ← Kembali ke Cafepedia
          </Link>
        </div>
      </main>
    </div>
  );
}
