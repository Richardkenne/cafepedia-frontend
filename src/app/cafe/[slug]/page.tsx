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
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "name": cafe.name,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": area,
      "addressRegion": "West Java",
      "addressCountry": "ID",
      ...(cafe.address ? { "streetAddress": cafe.address as string } : {}),
    },
    "url": `https://cafepedia.id/cafe/${(cafe as { id: number; name: string }).id}-${((cafe.name as string) || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
  };
  if (cafe.lat && cafe.lng) {
    ld.geo = { "@type": "GeoCoordinates", latitude: cafe.lat, longitude: cafe.lng };
  }
  if (cafe.rating) {
    ld.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: cafe.rating,
      bestRating: 5,
      ...(cafe.reviews || cafe.rating_count ? { reviewCount: cafe.reviews || cafe.rating_count } : {}),
    };
  }
  const price = priceRangeToSymbol(cafe.price_range as string);
  if (price) ld.priceRange = price;
  if (cafe.phone) ld.telephone = cafe.phone;
  if (cafe.website) ld.url = cafe.website;
  if (cafe.instagram) ld.sameAs = [cafe.instagram];
  const photo = (cafe.photos as string[])?.[0] || cafe.hero_photo;
  if (photo) ld.image = photo;
  if (cafe.google_maps_link) ld.hasMap = cafe.google_maps_link;
  if (cafe.description) ld.description = (cafe.description as string).slice(0, 300);
  return ld;
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
