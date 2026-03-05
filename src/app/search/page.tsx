"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchCafes } from "@/lib/api";
import { Cafe } from "@/lib/types";
import CafeCard from "@/components/CafeCard";
import SearchBar from "@/components/SearchBar";
import { CardSkeleton } from "@/components/Skeleton";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const nearParam = searchParams.get("near") || "";

  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<Cafe[]>([]);
  const [found, setFound] = useState(0);
  const [loading, setLoading] = useState(true);
  const [nearActive, setNearActive] = useState(!!nearParam);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);

  // Parse near param on mount
  useEffect(() => {
    if (nearParam) {
      const [lat, lng] = nearParam.split(",").map(Number);
      if (lat && lng) {
        setUserLat(lat);
        setUserLng(lng);
        setNearActive(true);
      }
    }
  }, [nearParam]);

  const doSearch = useCallback(async (q: string, lat?: number | null, lng?: number | null) => {
    setLoading(true);
    try {
      const params: Parameters<typeof searchCafes>[0] = { q: q || "*" };
      if (lat && lng) {
        params.near = { lat, lng };
        params.radius_km = 3;
      }
      const data = await searchCafes(params);
      setResults(data.results || []);
      setFound(data.found || 0);
    } catch {
      setResults([]);
      setFound(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search on mount
  useEffect(() => {
    if (nearParam) {
      const [lat, lng] = nearParam.split(",").map(Number);
      doSearch(initialQ, lat, lng);
    } else {
      doSearch(initialQ);
    }
  }, [initialQ, nearParam, doSearch]);

  // Debounced search on typing
  useEffect(() => {
    const timer = setTimeout(() => {
      const url = query ? `/search?q=${encodeURIComponent(query)}${nearActive && userLat ? `&near=${userLat},${userLng}` : ""}` : `/search${nearActive && userLat ? `?near=${userLat},${userLng}` : ""}`;
      window.history.replaceState(null, "", url);
      doSearch(query, nearActive ? userLat : null, nearActive ? userLng : null);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, doSearch, nearActive, userLat, userLng]);

  function toggleNear() {
    if (nearActive) {
      setNearActive(false);
      setUserLat(null);
      setUserLng(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
        setNearActive(true);
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  return (
    <div className="min-h-dvh">
      {/* Sticky header */}
      <header className="sticky top-0 z-20 bg-white/92 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2">
          <button
            onClick={() => router.push("/")}
            className="text-[var(--muted)] text-lg p-2 -ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Back"
          >
            ←
          </button>
          <div className="flex-1">
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={(q) => doSearch(q, nearActive ? userLat : null, nearActive ? userLng : null)}
              autoFocus
            />
          </div>
          <button
            onClick={toggleNear}
            className={`p-2.5 rounded-xl border min-w-[44px] min-h-[44px] flex items-center justify-center transition-all
              ${nearActive
                ? "border-[var(--foreground)] text-[var(--foreground)] bg-gray-50"
                : "border-[var(--border)] text-[var(--muted)] hover:bg-gray-50"
              }`}
            aria-label="Near me"
            title="Near me"
          >
            <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Results */}
      <main className="max-w-2xl mx-auto px-4 pb-8">
        {/* Meta */}
        {!loading && (
          <p className="text-xs text-[var(--muted2)] py-3">
            {found > 0 ? `${found} cafe${found !== 1 ? "s" : ""} found` : ""}
            {nearActive && found > 0 && " · sorted by distance"}
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div className="pt-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Results list */}
        {!loading && results.length > 0 && (
          <div>
            {results.map(cafe => (
              <CafeCard key={cafe.id} cafe={cafe} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && results.length === 0 && (
          <div className="text-center py-20 text-[var(--muted2)] text-sm">
            <p className="text-4xl mb-4">☕</p>
            <p>No cafes found</p>
            <p className="mt-1">Try a different search</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh">
        <div className="max-w-2xl mx-auto px-4 pt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
