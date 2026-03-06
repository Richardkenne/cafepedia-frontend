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
import Logo from "@/components/Logo";
import { MapPin, SlidersHorizontal, X } from "lucide-react";

const QUICK_FILTERS = [
  { label: "Work Friendly", tag: "work_friendly" },
  { label: "Aesthetic", tag: "aesthetic" },
  { label: "Cozy", tag: "cozy" },
  { label: "Rooftop", tag: "rooftop_view" },
  { label: "Outdoor", tag: "outdoor" },
  { label: "Date Spot", tag: "date_spot" },
  { label: "Hidden Gem", tag: "hidden_gem" },
  { label: "Late Night", tag: "late_night" },
  { label: "Pet Friendly", tag: "pet_friendly" },
  { label: "Coffee", tag: "specialty_coffee" },
];

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
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

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

  // Check if initial query matches a filter tag
  useEffect(() => {
    const matchingFilter = QUICK_FILTERS.find(f => f.tag === initialQ);
    if (matchingFilter) {
      setActiveFilters([matchingFilter.tag]);
      setQuery("");
    }
  }, [initialQ]);

  const doSearch = useCallback(async (q: string, lat?: number | null, lng?: number | null, filters?: string[]) => {
    setLoading(true);
    try {
      const searchQuery = filters?.length ? filters.join(" ") : q || "*";
      const params: Parameters<typeof searchCafes>[0] = { q: searchQuery };
      if (lat && lng) {
        params.near = { lat, lng };
        params.radius_km = 50;
      }
      const data = await searchCafes(params);
      setResults(data.results || []);
      setFound(data.found || 0);
      setVisible(PAGE_SIZE);
      logSearch(q || filters?.join(",") || "", data.found || 0);
    } catch {
      setResults([]);
      setFound(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search on mount
  useEffect(() => {
    const matchingFilter = QUICK_FILTERS.find(f => f.tag === initialQ);
    if (nearParam) {
      const [lat, lng] = nearParam.split(",").map(Number);
      doSearch(matchingFilter ? "" : initialQ, lat, lng, matchingFilter ? [matchingFilter.tag] : undefined);
    } else {
      doSearch(matchingFilter ? "" : initialQ, null, null, matchingFilter ? [matchingFilter.tag] : undefined);
    }
  }, [initialQ, nearParam, doSearch]);

  // Debounced search on typing
  useEffect(() => {
    const timer = setTimeout(() => {
      const url = query
        ? `/search?q=${encodeURIComponent(query)}${nearActive && userLat ? `&near=${userLat},${userLng}` : ""}`
        : `/search${nearActive && userLat ? `?near=${userLat},${userLng}` : ""}`;
      window.history.replaceState(null, "", url);
      doSearch(query, nearActive ? userLat : null, nearActive ? userLng : null, activeFilters.length ? activeFilters : undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, doSearch, nearActive, userLat, userLng, activeFilters]);

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

  function toggleFilter(tag: string) {
    setActiveFilters(prev =>
      prev.includes(tag) ? prev.filter(f => f !== tag) : [...prev, tag]
    );
  }

  function clearFilters() {
    setActiveFilters([]);
  }

  return (
    <div className="min-h-dvh bg-white">
      {/* Sticky header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2">
          {/* Logo brand — top left */}
          <div className="flex-shrink-0 mr-1">
            <Logo size={26} textClassName="text-lg font-extrabold tracking-tight text-[var(--foreground)] hidden sm:block" />
          </div>
          <div className="flex-1">
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={(q) => doSearch(q, nearActive ? userLat : null, nearActive ? userLng : null, activeFilters.length ? activeFilters : undefined)}
              placeholder={t("search.placeholder")}
              autoFocus
            />
          </div>
          <button
            onClick={toggleNear}
            className={`p-2.5 rounded-xl border min-w-[44px] min-h-[44px] flex items-center justify-center transition-all
              ${nearActive
                ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-light)]"
                : "border-gray-200 text-[var(--muted)] hover:bg-gray-50"
              }`}
            aria-label={t("home.near_me")}
            title={t("home.near_me")}
          >
            <MapPin size={18} />
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl border min-w-[44px] min-h-[44px] flex items-center justify-center transition-all
              ${showFilters || activeFilters.length > 0
                ? "border-[var(--foreground)] text-[var(--foreground)] bg-gray-50"
                : "border-gray-200 text-[var(--muted)] hover:bg-gray-50"
              }`}
            aria-label="Filters"
          >
            <SlidersHorizontal size={18} />
            {activeFilters.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--accent)] text-white text-[9px] font-bold flex items-center justify-center">
                {activeFilters.length}
              </span>
            )}
          </button>
          <LangToggle />
        </div>

        {/* Filter chips */}
        {showFilters && (
          <div className="max-w-3xl mx-auto px-4 pb-3">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
              {activeFilters.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-red-500 bg-red-50 border border-red-100
                    hover:bg-red-100 transition-colors flex-shrink-0"
                >
                  <X size={12} /> Clear
                </button>
              )}
              {QUICK_FILTERS.map(f => {
                const active = activeFilters.includes(f.tag);
                return (
                  <button
                    key={f.tag}
                    onClick={() => toggleFilter(f.tag)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0
                      ${active
                        ? "bg-[var(--foreground)] text-white border border-[var(--foreground)]"
                        : "bg-white text-[var(--muted)] border border-gray-200 hover:border-gray-300 hover:text-[var(--foreground)]"
                      }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Results */}
      <main className="max-w-3xl mx-auto px-4 pb-8">
        {/* Meta */}
        {!loading && (
          <div className="flex items-center justify-between py-3">
            <p className="text-xs text-[var(--muted2)]">
              {found > 0 ? `${found >= 100 ? "100+" : found >= 50 ? "50+" : found >= 10 ? `${Math.floor(found / 10) * 10}+` : found} ${t("search.cafes_found")}` : ""}
              {nearActive && found > 0 && ` · ${t("search.sorted_by_distance")}`}
            </p>
          </div>
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
                className="w-full py-4 mt-4 text-sm font-semibold text-[var(--muted)] border border-gray-200 rounded-xl
                  hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] transition-all min-h-[48px]"
              >
                Show more ({results.length - visible} remaining)
              </button>
            )}
          </div>
        )}

        {/* Empty */}
        {!loading && results.length === 0 && (
          <div className="text-center py-20 text-[var(--muted2)] text-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-none stroke-current stroke-1.5 text-gray-300">
                <circle cx="11" cy="11" r="7" />
                <path d="M16.5 16.5L21 21" strokeLinecap="round" />
              </svg>
            </div>
            <p className="font-medium text-[var(--muted)]">{t("search.no_cafes")}</p>
            <p className="mt-1 text-[var(--muted2)]">{t("search.try_different")}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh bg-white">
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
