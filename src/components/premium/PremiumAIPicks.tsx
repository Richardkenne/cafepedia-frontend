"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

interface Pick {
  id: string;
  name: string;
  neighborhood: string;
  rating: number;
  tags: string[];
  hero_photo?: string;
  reason: string;
  role: string;
}

interface PicksResponse {
  intent: Record<string, unknown>;
  picks: {
    best_match: Pick;
    hidden_gem: Pick;
    alternative: Pick;
  };
}

const CARD_CONFIG: Record<string, { label: string; accent: string; border: string; bg: string; badge: string }> = {
  best_match: {
    label: "Best Match",
    accent: "text-green-700",
    border: "border-green-400",
    bg: "bg-green-50",
    badge: "bg-green-100 text-green-800",
  },
  hidden_gem: {
    label: "Hidden Gem",
    accent: "text-amber-700",
    border: "border-amber-400",
    bg: "bg-amber-50",
    badge: "bg-amber-100 text-amber-800",
  },
  alternative: {
    label: "Alternative",
    accent: "text-blue-700",
    border: "border-blue-400",
    bg: "bg-blue-50",
    badge: "bg-blue-100 text-blue-800",
  },
};

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function PickCard({ pick, role }: { pick: Pick; role: string }) {
  const config = CARD_CONFIG[role];
  const slug = toSlug(pick.name);
  const tags = pick.tags.slice(0, 3);

  return (
    <Link href={`/cafe/${pick.id}-${slug}`} className="block">
      <div
        className={`rounded-xl border-2 ${config.border} ${config.bg} overflow-hidden transition-shadow hover:shadow-lg`}
      >
        <div className="flex flex-col sm:flex-row">
          {pick.hero_photo && (
            <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
              <Image
                src={pick.hero_photo}
                alt={pick.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 192px"
              />
            </div>
          )}
          <div className="p-5 flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${config.badge}`}
              >
                {config.label}
              </span>
              {pick.rating > 0 && (
                <span className="text-sm text-gray-500">
                  {pick.rating.toFixed(1)}
                </span>
              )}
            </div>
            <h3 className={`text-lg font-bold ${config.accent} mb-1 truncate`}>
              {pick.name}
            </h3>
            <p className="text-sm text-gray-500 mb-2">{pick.neighborhood}</p>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-white/70 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <p className="text-sm text-gray-700 leading-relaxed">
              {pick.reason}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function PremiumAIPicks() {
  const [query, setQuery] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PicksResponse | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const body: Record<string, unknown> = { query: query.trim() };
      if (lat) body.lat = parseFloat(lat);
      if (lng) body.lng = parseFloat(lng);

      const res = await fetch(`${API_BASE}/premium/picks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed (${res.status})`);
      }

      const data: PicksResponse = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        AI Picks
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Tell us what you want and we'll find 3 perfect cafes.
      </p>

      <form onSubmit={handleSubmit} className="mb-8 space-y-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. quiet cafe to work near dago"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <div className="flex gap-3">
          <input
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="Latitude (optional)"
            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-400"
          />
          <input
            type="text"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="Longitude (optional)"
            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Finding picks..." : "Find my picks"}
        </button>
      </form>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
          <span className="ml-3 text-sm text-gray-500">
            Analyzing cafes...
          </span>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <PickCard pick={result.picks.best_match} role="best_match" />
          <PickCard pick={result.picks.hidden_gem} role="hidden_gem" />
          <PickCard pick={result.picks.alternative} role="alternative" />
        </div>
      )}
    </div>
  );
}
