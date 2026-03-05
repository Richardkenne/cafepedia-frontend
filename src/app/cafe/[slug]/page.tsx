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

export default function CafePage() {
  return <CafeDetail />;
}
