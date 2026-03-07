import type { Metadata } from "next";
import { parseSlug, makeSlug } from "@/lib/api";
import CafeDetail from "./CafeDetail";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.cafepedia.id";
const SITE_URL = "https://cafepedia.id";

type Props = {
  params: Promise<{ slug: string }>;
};

async function fetchCafe(id: number) {
  try {
    const r = await fetch(`${API_BASE}/cafes/${id}`, { next: { revalidate: 3600 } });
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const id = parseSlug(slug);
  const cafe = await fetchCafe(id);

  if (!cafe) {
    return {
      title: "Cafe Not Found — Cafepedia",
    };
  }

  const title = `${cafe.name} — Cafepedia`;
  const area = cafe.area || cafe.neighborhood || "Bandung";
  const description = cafe.description
    ? cafe.description.slice(0, 160)
    : `${cafe.name} in ${area}. ${cafe.rating ? `Rating: ${cafe.rating}/5.` : ""} ${cafe.price_range ? `Price: ${cafe.price_range}.` : ""} Find hours, photos, and directions on Cafepedia.`.trim();
  const photo = cafe.photos?.[0] || cafe.hero_photo || undefined;
  const canonicalSlug = makeSlug(cafe.id, cafe.name);
  const url = `${SITE_URL}/cafe/${canonicalSlug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: cafe.name,
      description,
      url,
      siteName: "Cafepedia",
      type: "article",
      ...(photo && {
        images: [
          {
            url: photo,
            width: 1200,
            height: 630,
            alt: cafe.name,
          },
        ],
      }),
    },
    twitter: {
      card: photo ? "summary_large_image" : "summary",
      title: cafe.name,
      description,
      ...(photo && { images: [photo] }),
    },
  };
}

function priceRangeToSymbol(pr?: string): string | undefined {
  if (!pr) return undefined;
  if (pr.includes("★★★★")) return "$$$$";
  if (pr.includes("★★★")) return "$$$";
  if (pr.includes("★★")) return "$$";
  if (pr.includes("★")) return "$";
  return undefined;
}

function buildJsonLd(cafe: Record<string, unknown>) {
  const area = (cafe.area || cafe.neighborhood || "Bandung") as string;
  const cafeSlug = `${(cafe as { id: number }).id}-${((cafe.name as string) || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
  const cafeUrl = `https://cafepedia.id/cafe/${cafeSlug}`;

  // Build CafeOrCoffeeShop entity
  const place: Record<string, unknown> = {
    "@type": "CafeOrCoffeeShop",
    "@id": `${cafeUrl}#place`,
    "name": cafe.name,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": area,
      "addressRegion": "West Java",
      "addressCountry": "ID",
      ...(cafe.address ? { "streetAddress": cafe.address as string } : {}),
    },
    "url": cafeUrl,
    "publisher": { "@id": "https://cafepedia.id#organization" },
  };
  if (cafe.lat && cafe.lng) {
    place.geo = { "@type": "GeoCoordinates", latitude: cafe.lat, longitude: cafe.lng };
  }
  if (cafe.rating) {
    place.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: cafe.rating,
      bestRating: 5,
      ...(cafe.reviews || cafe.rating_count ? { reviewCount: cafe.reviews || cafe.rating_count } : {}),
    };
  }
  const price = priceRangeToSymbol(cafe.price_range as string);
  if (price) place.priceRange = price;
  if (cafe.phone) place.telephone = cafe.phone;
  if (cafe.website) place.url = cafe.website;
  if (cafe.instagram) place.sameAs = [cafe.instagram];
  const photos = (cafe.photos as string[]) || [];
  const heroPhoto = cafe.hero_photo as string | undefined;
  if (photos.length > 0) {
    place.image = photos;
  } else if (heroPhoto) {
    place.image = [heroPhoto];
  }
  if (cafe.google_maps_link) place.hasMap = cafe.google_maps_link;
  if (cafe.description) place.description = (cafe.description as string).slice(0, 300);

  const graph = [
    place,
    {
      "@type": "Organization",
      "@id": "https://cafepedia.id#organization",
      "name": "Cafepedia",
      "url": "https://cafepedia.id",
      "logo": "https://cafepedia.id/logo-icon.svg",
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${cafeUrl}#breadcrumb`,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cafepedia.id" },
        { "@type": "ListItem", "position": 2, "name": "Bandung", "item": "https://cafepedia.id/cafe-bandung" },
        { "@type": "ListItem", "position": 3, "name": cafe.name as string },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${cafeUrl}#webpage`,
      "url": cafeUrl,
      "name": `${cafe.name} — Cafepedia`,
      "isPartOf": { "@id": "https://cafepedia.id#website" },
      "breadcrumb": { "@id": `${cafeUrl}#breadcrumb` },
    },
    {
      "@type": "WebSite",
      "@id": "https://cafepedia.id#website",
      "url": "https://cafepedia.id",
      "name": "Cafepedia",
      "publisher": { "@id": "https://cafepedia.id#organization" },
    },
  ];

  return { "@context": "https://schema.org", "@graph": graph };
}

export default async function CafePage({ params }: Props) {
  const { slug } = await params;
  const id = parseSlug(slug);
  const cafe = await fetchCafe(id);

  return (
    <>
      {cafe && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(cafe)) }}
        />
      )}
      {/* SSR content for SEO — hidden visually, visible to crawlers */}
      {cafe && (
        <div className="sr-only" aria-hidden="false">
          <h1>{cafe.name}</h1>
          {cafe.description && <p>{cafe.description}</p>}
          {cafe.area && <p>Area: {cafe.area}</p>}
          {cafe.rating && <p>Rating: {cafe.rating}/5</p>}
          {cafe.tags && <p>Tags: {(cafe.tags as string[]).join(", ")}</p>}
          {cafe.address && <p>Address: {cafe.address}</p>}
        </div>
      )}
      <CafeDetail initialData={cafe} />
    </>
  );
}
