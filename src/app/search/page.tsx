"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchCafes, logSearch } from "@/lib/api";
import { Cafe } from "@/lib/types";
import CafeCard from "@/components/CafeCard";
import SearchBar from "@/components/SearchBar";
import { CardSkeleton } from "@/components/Skeleton";
import LangToggle from "@/components/LangToggle";
import { useTranslation } from "@/lib/i18n";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const nearParam = searchParams.get("near") || "";
  const { t } = useTranslation();

  const PAGE_SIZE = 15;
  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<Cafe[]>([]);
  const [found, setFound] = useState(0);
  const [visible, setVisible] = useState(PAGE_SIZE);
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
        params.radius_km = 50;
      }
      const data = await searchCafes(params);
      setResults(data.results || []);
      setFound(data.found || 0);
      setVisible(PAGE_SIZE);
      logSearch(q, data.found || 0);
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
      (err) => {
        if (err.code === 1) alert(t("alert.location_denied"));
        else if (err.code === 3) alert(t("alert.location_timeout"));
        else alert(t("alert.location_error_short"));
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }

  return (
    <div className="min-h-dvh">
      {/* Sticky header */}
      <header className="sticky top-0 z-20 bg-[var(--background)]/92 backdrop-blur-xl border-b border-[var(--border)] shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2">
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
              placeholder={t("search.placeholder")}
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
            aria-label={t("home.near_me")}
            title={t("home.near_me")}
          >
            <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </button>
          <LangToggle />
        </div>
      </header>

      {/* Results */}
      <main className="max-w-3xl mx-auto px-4 pb-8">
        {/* Meta */}
        {!loading && (
          <p className="text-xs text-[var(--muted2)] py-3">
            {found > 0 ? `${found >= 100 ? "100+" : found >= 50 ? "50+" : found >= 10 ? `${Math.floor(found / 10) * 10}+` : found} ${t("search.cafes_found")}` : ""}
            {nearActive && found > 0 && ` \u00b7 ${t("search.sorted_by_distance")}`}
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
            {results.slice(0, visible).map(cafe => (
              <CafeCard key={cafe.id} cafe={cafe} />
            ))}
            {visible < results.length && (
              <button
                onClick={() => setVisible(v => v + PAGE_SIZE)}
                className="w-full py-4 mt-2 text-sm font-medium text-[var(--muted)] border border-[var(--border)] rounded-xl
                  hover:bg-[var(--surface)] active:scale-[0.98] transition-all min-h-[48px]"
              >
                Show more ({results.length - visible} remaining)
              </button>
            )}
          </div>
        )}

        {/* Empty */}
        {!loading && results.length === 0 && (
          <div className="text-center py-20 text-[var(--muted2)] text-sm">
            <p className="text-4xl mb-4">☕</p>
            <p>{t("search.no_cafes")}</p>
            <p className="mt-1">{t("search.try_different")}</p>
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
        <div className="max-w-3xl mx-auto px-4 pt-6">
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
