import { SearchResponse, Cafe, DecideResponse } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export function makeSlug(id: number | string, name: string): string {
  const s = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${id}-${s}`;
}

export function parseSlug(slug: string): number {
  return parseInt(slug.split("-")[0], 10);
}

export async function searchCafes(params: {
  q?: string;
  tags?: string[];
  near?: { lat: number; lng: number };
  radius_km?: number;
}): Promise<SearchResponse> {
  const p = new URLSearchParams();
  p.set("q", params.q || "*");
  if (params.tags?.length) p.set("tags", params.tags.join(","));
  if (params.near) {
    p.set("near", `${params.near.lat},${params.near.lng}`);
    if (params.radius_km) p.set("radius_km", String(params.radius_km));
  }
  const r = await fetch(`${API_BASE}/search?${p}`);
  return r.json();
}

export async function getCafe(id: number): Promise<Cafe> {
  const r = await fetch(`${API_BASE}/cafes/${id}`);
  return r.json();
}

export function logSearch(query: string, resultsCount: number, city?: string) {
  if (!query || query === "*") return;
  fetch(`${API_BASE}/log/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, results_count: resultsCount, city: city || "" }),
  }).catch(() => {});
}

export async function decideCafe(query: string, lat?: number, lng?: number): Promise<DecideResponse> {
  const body: Record<string, unknown> = { query };
  if (lat && lng) { body.lat = lat; body.lng = lng; }
  const r = await fetch(`${API_BASE}/decide`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return r.json();
}
