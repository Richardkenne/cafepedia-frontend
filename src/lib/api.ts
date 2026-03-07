import { SearchResponse, Cafe, DecideResponse } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

async function apiFetch(url: string, options?: RequestInit): Promise<Response> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const r = await fetch(url, { ...options, signal: controller.signal });
      if (!r.ok) throw new Error(`API ${r.status}`);
      return r;
    } catch (e) {
      clearTimeout(timeout);
      if (attempt === 1) throw e;
      await new Promise(res => setTimeout(res, 2000));
    }
  }
  throw new Error("API unreachable");
}

export function makeSlug(id: number | string, name: string): string {
  const s = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${id}-${s}`;
}

export function parseSlug(slug: string): number {
  return parseInt(slug.split("-")[0], 10);
}

function cacheGet(key: string): SearchResponse | null {
  try {
    const raw = sessionStorage.getItem(`cafe_cache_${key}`);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > 5 * 60 * 1000) return null;
    return data;
  } catch { return null; }
}

function cacheSet(key: string, data: SearchResponse) {
  try { sessionStorage.setItem(`cafe_cache_${key}`, JSON.stringify({ data, ts: Date.now() })); } catch {}
}

export async function searchCafes(params: {
  q?: string;
  tags?: string[];
  near?: { lat: number; lng: number };
  radius_km?: number;
  category?: string;
}): Promise<SearchResponse> {
  const p = new URLSearchParams();
  p.set("q", params.q || "*");
  if (params.tags?.length) p.set("tags", params.tags.join(","));
  if (params.category) p.set("category", params.category);
  if (params.near) {
    p.set("near", `${params.near.lat},${params.near.lng}`);
    if (params.radius_km) p.set("radius_km", String(params.radius_km));
  }
  const cacheKey = p.toString();
  try {
    const r = await apiFetch(`${API_BASE}/search?${p}`);
    const data: SearchResponse = await r.json();
    cacheSet(cacheKey, data);
    return data;
  } catch (e) {
    const cached = cacheGet(cacheKey);
    if (cached) return { ...cached, _stale: true } as SearchResponse;
    throw e;
  }
}

export async function getCafe(id: number): Promise<Cafe> {
  const r = await apiFetch(`${API_BASE}/cafes/${id}`);
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

export async function getTrendingCafes(): Promise<Cafe[]> {
  const r = await apiFetch(`${API_BASE}/search?q=*&per_page=12`);
  const data: SearchResponse = await r.json();
  return (data.results || []).filter(c => c.hero_photo);
}

export async function decideCafe(query: string, lat?: number, lng?: number, lang?: string): Promise<DecideResponse> {
  const body: Record<string, unknown> = { query, lang: lang || "id" };
  if (lat && lng) { body.lat = lat; body.lng = lng; }
  const r = await apiFetch(`${API_BASE}/decide`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return r.json();
}
