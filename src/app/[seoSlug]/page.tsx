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

/** Answer-first paragraph: 2-3 sentences, 40-60 words, Indonesian */
function generateAnswerFirst(page: SeoPage, cafeCount: number, cafes: Cafe[]): string {
  const city = page.city || "Bandung";
  const tags = page.tag_filters || [];
  const topCafe = cafes.length > 0 ? cafes[0] : null;
  const topRating = topCafe?.rating ? topCafe.rating.toFixed(1) : null;

  // Collect unique areas from results
  const areas = [...new Set(cafes.map(c => c.area).filter(Boolean))].slice(0, 3);
  const areaStr = areas.length > 0 ? areas.join(", ") : city;

  const intentTemplates: Record<string, string> = {
    work_friendly: `${city} punya ${cafeCount}+ cafe yang cocok untuk bekerja dengan WiFi cepat dan suasana tenang. Tersebar di area ${areaStr}, berikut rekomendasi cafe work-friendly terbaik berdasarkan rating dan fasilitas.${topCafe && topRating ? ` ${topCafe.name} dengan rating ${topRating} menjadi pilihan teratas.` : ""}`,
    aesthetic: `Ada ${cafeCount}+ cafe estetik dan Instagramable di ${city} yang wajib dikunjungi. Dari ${areaStr}, berikut cafe dengan desain interior terbaik berdasarkan review pengunjung.${topCafe && topRating ? ` ${topCafe.name} (${topRating}) menjadi yang paling populer.` : ""}`,
    budget: `${city} punya ${cafeCount}+ cafe murah dan terjangkau tanpa mengorbankan kualitas. Tersebar di ${areaStr}, berikut pilihan cafe budget-friendly terbaik untuk mahasiswa dan pekerja.${topCafe ? ` ${topCafe.name} di ${topCafe.area || city} jadi favorit.` : ""}`,
    outdoor: `Nikmati ${cafeCount}+ cafe outdoor di ${city} dengan suasana terbuka dan pemandangan indah. Area ${areaStr} menawarkan pilihan terbaik untuk bersantai di luar ruangan.${topCafe && topRating ? ` ${topCafe.name} dengan rating ${topRating} paling direkomendasikan.` : ""}`,
    date_spot: `${city} menawarkan ${cafeCount}+ cafe romantis yang cocok untuk kencan. Dari ${areaStr}, berikut rekomendasi tempat kencan terbaik berdasarkan suasana dan rating pengunjung.${topCafe ? ` ${topCafe.name} menjadi pilihan utama.` : ""}`,
    quiet: `Butuh tempat tenang? ${city} punya ${cafeCount}+ cafe dengan suasana damai untuk fokus atau bersantai. Tersebar di ${areaStr}, berikut cafe paling tenang berdasarkan review.${topCafe && topRating ? ` ${topCafe.name} (${topRating}) paling direkomendasikan.` : ""}`,
    hidden_gem: `${city} menyimpan ${cafeCount}+ hidden gem cafe yang belum banyak diketahui orang. Tersembunyi di ${areaStr}, berikut cafe unik yang layak dikunjungi.${topCafe ? ` ${topCafe.name} jadi salah satu temuan terbaik.` : ""}`,
    premium: `Ada ${cafeCount}+ cafe premium di ${city} dengan kualitas kopi dan pelayanan terbaik. Area ${areaStr} menjadi pusat cafe high-end.${topCafe && topRating ? ` ${topCafe.name} dengan rating ${topRating} memimpin daftar ini.` : ""}`,
    late_night: `${city} punya ${cafeCount}+ cafe yang buka hingga larut malam. Dari ${areaStr}, berikut pilihan cafe malam terbaik untuk nongkrong atau bekerja.${topCafe ? ` ${topCafe.name} jadi favorit pengunjung malam.` : ""}`,
    specialty_coffee: `Pecinta kopi spesialti? ${city} menawarkan ${cafeCount}+ cafe dengan single origin dan manual brew terbaik. Tersebar di ${areaStr}, berikut roastery dan coffee shop terbaik.${topCafe && topRating ? ` ${topCafe.name} (${topRating}) paling direkomendasikan.` : ""}`,
    cozy: `${city} punya ${cafeCount}+ cafe cozy dengan suasana hangat dan nyaman. Dari ${areaStr}, berikut cafe paling nyaman untuk bersantai berjam-jam.${topCafe && topRating ? ` ${topCafe.name} dengan rating ${topRating} jadi pilihan utama.` : ""}`,
    top_rated: `Berikut ${cafeCount}+ cafe terbaik di ${city} berdasarkan rating tertinggi pengunjung. Tersebar di ${areaStr}, daftar ini diperbarui berdasarkan data terbaru.${topCafe && topRating ? ` ${topCafe.name} memimpin dengan rating ${topRating}.` : ""}`,
    rooftop: `${city} punya ${cafeCount}+ rooftop cafe dengan pemandangan kota yang menakjubkan. Dari ${areaStr}, berikut rekomendasi rooftop cafe terbaik berdasarkan rating dan review pengunjung.${topCafe && topRating ? ` ${topCafe.name} (${topRating}) menjadi yang paling populer.` : ""}`,
    instagrammable: `Ada ${cafeCount}+ cafe Instagramable di ${city} dengan spot foto yang aesthetic. Area ${areaStr} menawarkan desain interior paling menarik.${topCafe && topRating ? ` ${topCafe.name} dengan rating ${topRating} paling banyak difoto pengunjung.` : ""}`,
  };

  // Match intent from tags or page intent
  const intentKey = tags.find(t => intentTemplates[t]) || page.intent?.toLowerCase().replace(/[- ]/g, "_") || "";
  if (intentTemplates[intentKey]) return intentTemplates[intentKey];

  // Fallback: generic template
  return `${city} menawarkan ${cafeCount}+ cafe terbaik untuk ${page.intent || "dikunjungi"}. Tersebar di area ${areaStr}, berikut rekomendasi berdasarkan rating dan review pengunjung.${topCafe && topRating ? ` ${topCafe.name} dengan rating ${topRating} memimpin daftar ini.` : ""}`;
}

/** Group cafes by area for structured sections */
function groupCafesByArea(cafes: Cafe[]): { area: string; cafes: Cafe[] }[] {
  const groups: Record<string, Cafe[]> = {};
  for (const cafe of cafes) {
    const area = cafe.area || "Lainnya";
    if (!groups[area]) groups[area] = [];
    groups[area].push(cafe);
  }
  return Object.entries(groups)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([area, cafes]) => ({ area, cafes }));
}

/** Area intro sentence */
function getAreaIntro(area: string, areaCafes: Cafe[], intent: string): string {
  const count = areaCafes.length;
  const topCafe = areaCafes[0];
  const ratedCafes = areaCafes.filter(c => c.rating);
  const avgRating = ratedCafes.length > 0
    ? (ratedCafes.reduce((sum, c) => sum + (c.rating || 0), 0) / ratedCafes.length).toFixed(1)
    : null;
  const intentLabel = intent ? intent.replace(/_/g, " ") : "";
  return `Area ${area} memiliki ${count} cafe${intentLabel ? ` untuk ${intentLabel}` : ""} ${avgRating ? `dengan rating rata-rata ${avgRating}` : ""}.${topCafe ? ` ${topCafe.name} menjadi yang terpopuler di area ini.` : ""}`;
}

/** Auto-generate FAQ from real data */
function generateAutoFaq(page: SeoPage, cafes: Cafe[]): { q: string; a: string }[] {
  const city = page.city || "Bandung";
  const intent = page.intent || "";
  const intentLabel = intent.replace(/_/g, " ");
  const areas = [...new Set(cafes.map(c => c.area).filter(Boolean))];
  const ratedCafes = cafes.filter(c => c.rating).sort((a, b) => (b.rating || 0) - (a.rating || 0));
  const topCafe = ratedCafes[0];
  const topRating = topCafe?.rating?.toFixed(1);
  const avgRating = ratedCafes.length > 0
    ? (ratedCafes.reduce((s, c) => s + (c.rating || 0), 0) / ratedCafes.length).toFixed(1)
    : null;

  const faqs: { q: string; a: string }[] = [];

  faqs.push({
    q: `Berapa banyak ${intentLabel} cafe di ${city}?`,
    a: `Ada ${cafes.length}+ ${intentLabel} cafe di ${city}${areas.length > 0 ? `, tersebar di area ${areas.slice(0, 3).join(", ")}` : ""}. Daftar ini diperbarui secara berkala berdasarkan data terbaru dari review pengunjung.`,
  });

  if (topCafe && topRating) {
    faqs.push({
      q: `${intentLabel.replace(/\b\w/g, c => c.toUpperCase())} cafe terbaik di ${city}?`,
      a: `Berdasarkan rating pengunjung, ${topCafe.name}${topCafe.area ? ` di ${topCafe.area}` : ""} dengan rating ${topRating} adalah yang paling direkomendasikan.${ratedCafes.length > 1 && ratedCafes[1] ? ` Disusul oleh ${ratedCafes[1].name} (${ratedCafes[1].rating?.toFixed(1)}).` : ""}`,
    });
  }

  if (avgRating) {
    faqs.push({
      q: `Berapa rating rata-rata ${intentLabel} cafe di ${city}?`,
      a: `Rating rata-rata ${intentLabel} cafe di ${city} adalah ${avgRating} dari 5.0 berdasarkan ${ratedCafes.length} cafe yang sudah dirating pengunjung. Semua cafe dalam daftar ini memiliki rating minimal 4.0.`,
    });
  }

  if (areas.length >= 2) {
    faqs.push({
      q: `Di area mana ${intentLabel} cafe terbanyak di ${city}?`,
      a: `Area dengan ${intentLabel} cafe terbanyak di ${city} adalah ${areas[0]}${areas[1] ? ` dan ${areas[1]}` : ""}. Kedua area ini dikenal sebagai pusat kuliner dan nongkrong favorit warga ${city}.`,
    });
  }

  return faqs;
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

  const dbFaq: { q: string; a: string }[] =
    typeof page.faq_json === "string"
      ? JSON.parse(page.faq_json)
      : page.faq_json || [];
  const autoFaq = generateAutoFaq(page, cafes);
  // Merge: DB FAQ first, then auto-generated (skip duplicates by question)
  const dbQuestions = new Set(dbFaq.map(f => f.q.toLowerCase()));
  const uniqueAutoFaq = autoFaq.filter(f => !dbQuestions.has(f.q.toLowerCase()));
  const faq = [...dbFaq, ...uniqueAutoFaq];

  return (
    <div className="min-h-dvh">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[var(--background)]/92 backdrop-blur-xl border-b border-[var(--border)]">
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
            <li><Link href="/cafe-bandung" className="hover:text-[var(--foreground)] transition-colors">{page.city}</Link></li>
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

        {/* Answer-first paragraph */}
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--foreground)]">
          {generateAnswerFirst(page, cafes.length, cafes)}
        </p>

        {/* Original intro text (if present and adds value) */}
        {page.intro_text && (
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--muted)]">
            {page.intro_text}
          </p>
        )}

        {/* Top 5 comparison table */}
        {cafes.length >= 3 && (
          <section className="mt-6">
            <h2 className="text-lg font-bold mb-3">
              Top {Math.min(5, cafes.length)} {page.intent?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())} Cafe di {page.city || "Bandung"}
            </h2>
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full text-[13px] border-collapse">
                <thead>
                  <tr className="border-b-2 border-[var(--border)]">
                    <th className="text-left py-2 pr-3 font-semibold text-[var(--foreground)]">#</th>
                    <th className="text-left py-2 pr-3 font-semibold text-[var(--foreground)]">Nama</th>
                    <th className="text-left py-2 pr-3 font-semibold text-[var(--foreground)]">Area</th>
                    <th className="text-left py-2 pr-3 font-semibold text-[var(--foreground)]">Rating</th>
                    <th className="text-left py-2 font-semibold text-[var(--foreground)]">Tags</th>
                  </tr>
                </thead>
                <tbody>
                  {cafes.slice(0, 5).map((cafe, idx) => (
                    <tr key={cafe.id} className="border-b border-[var(--surface)]">
                      <td className="py-2 pr-3 text-[var(--muted2)] font-medium">{idx + 1}</td>
                      <td className="py-2 pr-3 font-medium">
                        <Link href={`/cafe/${makeSlug(cafe.id, cafe.name)}`} className="hover:text-[var(--accent)] transition-colors">
                          {cafe.name}
                        </Link>
                      </td>
                      <td className="py-2 pr-3 text-[var(--muted)]">{cafe.area || "-"}</td>
                      <td className="py-2 pr-3 text-[var(--orange)] font-semibold">{cafe.rating ? `${cafe.rating}` : "-"}</td>
                      <td className="py-2 text-[var(--muted2)]">{(cafe.tags || []).slice(0, 3).map(t => formatTag(t)).join(", ") || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Cafe count */}
        <p className="mt-6 text-xs text-[var(--muted2)]">
          {cafes.length} cafe ditemukan
        </p>

        {/* Cafe List — grouped by area with H2/H3 headings when enough data */}
        {(() => {
          const areaGroups = groupCafesByArea(cafes);
          const showGrouped = areaGroups.length >= 2 && cafes.length >= 6;
          let globalIdx = 0;

          const renderCafeCard = (cafe: Cafe, idx: number, useH3: boolean) => (
            <Link
              key={cafe.id}
              href={`/cafe/${makeSlug(cafe.id, cafe.name)}`}
              className="flex gap-4 py-4 border-b border-[var(--surface)] active:opacity-60 transition-opacity"
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
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover flex-shrink-0 bg-[var(--surface)]"
                  loading={idx < 3 ? "eager" : "lazy"}
                  sizes="(max-width: 640px) 80px, 96px"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[var(--surface)] flex-shrink-0 flex items-center justify-center text-[var(--muted2)] text-2xl">
                  ☕
                </div>
              )}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                {useH3 ? (
                  <h3 className="font-semibold text-[15px] leading-tight truncate">{cafe.name}</h3>
                ) : (
                  <h2 className="font-semibold text-[15px] leading-tight truncate">{cafe.name}</h2>
                )}
                <p className="text-[13px] text-[var(--muted)] mt-0.5">
                  {cafe.area}{cafe.price_range && ` · ${formatPrice(cafe.price_range) || cafe.price_range}`}
                </p>
                {cafe.rating && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[13px] text-[var(--orange)] font-semibold">★ {cafe.rating}</span>
                    {cafe.reviews && <span className="text-xs text-[var(--muted2)]">({Number(cafe.reviews).toLocaleString()})</span>}
                  </div>
                )}
                {cafe.description && <p className="text-[12px] text-[var(--muted2)] mt-1.5 line-clamp-2">{cafe.description}</p>}
                {(() => {
                  const reason = getReasonForIntent(cafe.tags || [], page.intent);
                  return reason ? (
                    <p className="text-[11px] text-green-700 bg-green-50 px-2 py-0.5 rounded mt-1.5 inline-block">{reason}</p>
                  ) : null;
                })()}
              </div>
            </Link>
          );

          if (showGrouped) {
            return (
              <div className="mt-2">
                {areaGroups.map((group) => {
                  const sectionCafes = group.cafes.map((cafe) => {
                    const idx = globalIdx++;
                    return renderCafeCard(cafe, idx, true);
                  });
                  return (
                    <section key={group.area} className="mt-6">
                      <h2 className="text-base font-bold mb-1">
                        {page.intent?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())} Cafe di {group.area}
                      </h2>
                      <p className="text-[13px] text-[var(--muted)] mb-3 leading-relaxed">
                        {getAreaIntro(group.area, group.cafes, page.intent)}
                      </p>
                      {sectionCafes}
                    </section>
                  );
                })}
              </div>
            );
          }

          // Flat list (few areas or few cafes)
          return (
            <div className="mt-2">
              {cafes.map((cafe, idx) => renderCafeCard(cafe, idx, false))}
            </div>
          );
        })()}

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

        {/* Hub link */}
        <div className="mt-8">
          <Link
            href="/cafe-bandung"
            className="inline-flex items-center gap-2 text-[13px] px-4 py-2.5 rounded-xl border border-gray-200 text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors font-medium"
          >
            Semua cafe di {page.city} &rarr;
          </Link>
        </div>

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

        {/* Schema.org @graph */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                ...(cafes.length > 0 ? [{
                  "@type": "ItemList",
                  "@id": `https://cafepedia.id/${page.slug}#itemlist`,
                  "name": page.title,
                  "description": page.meta_description,
                  "numberOfItems": cafes.length,
                  "itemListElement": cafes.map((cafe: Cafe, idx: number) => ({
                    "@type": "ListItem",
                    "position": idx + 1,
                    "item": {
                      "@type": "CafeOrCoffeeShop",
                      "name": cafe.name,
                      "url": `https://cafepedia.id/cafe/${makeSlug(cafe.id, cafe.name)}`,
                      ...(cafe.area && { "address": { "@type": "PostalAddress", "addressLocality": cafe.area, "addressRegion": "West Java", "addressCountry": "ID" } }),
                      ...(cafe.rating && { "aggregateRating": { "@type": "AggregateRating", "ratingValue": cafe.rating, "bestRating": 5, ...(cafe.reviews && { "reviewCount": cafe.reviews }) } }),
                      ...(cafe.hero_photo && { "image": cafe.hero_photo }),
                      ...(cafe.description && { "description": cafe.description }),
                    },
                  })),
                }] : []),
                {
                  "@type": "WebPage",
                  "@id": `https://cafepedia.id/${page.slug}#webpage`,
                  "url": `https://cafepedia.id/${page.slug}`,
                  "name": page.title,
                  "description": page.meta_description,
                  "isPartOf": { "@id": "https://cafepedia.id#website" },
                  "breadcrumb": { "@id": `https://cafepedia.id/${page.slug}#breadcrumb` },
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
                  "@id": `https://cafepedia.id/${page.slug}#breadcrumb`,
                  "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cafepedia.id" },
                    { "@type": "ListItem", "position": 2, "name": page.city, "item": "https://cafepedia.id/cafe-bandung" },
                    { "@type": "ListItem", "position": 3, "name": page.intent },
                  ],
                },
                ...(faq.length > 0 ? [{
                  "@type": "FAQPage",
                  "@id": `https://cafepedia.id/${page.slug}#faq`,
                  "mainEntity": faq.map((item: { q: string; a: string }) => ({
                    "@type": "Question",
                    "name": item.q,
                    "acceptedAnswer": { "@type": "Answer", "text": item.a },
                  })),
                }] : []),
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
