"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

interface SearchResult {
  id: string;
  name: string;
  neighborhood?: string;
  rating?: number;
  rating_count?: number;
  tags?: string[];
  hero_photo?: string;
}

interface CafeDetail {
  id: string;
  name: string;
  neighborhood?: string;
  rating?: number;
  rating_count?: number;
  price_range?: string;
  tags?: string[];
  hero_photo?: string;
  instagram?: string;
  phone?: string;
  g_hours?: string;
  description?: string;
  lat?: number;
  lng?: number;
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function hasTag(tags: string[] | undefined, ...search: string[]): boolean {
  if (!tags) return false;
  return search.some((s) => tags.includes(s));
}

export default function CafeCompare() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCafes, setSelectedCafes] = useState<CafeDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Debounced search
  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (!value.trim()) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }
      timerRef.current = setTimeout(async () => {
        try {
          const res = await fetch(
            `${API_BASE}/search?q=${encodeURIComponent(value.trim())}`
          );
          if (!res.ok) return;
          const data = await res.json();
          setSearchResults(data.results || []);
          setShowDropdown(true);
        } catch {
          // silently fail
        }
      }, 300);
    },
    []
  );

  // Select a cafe from search results
  const selectCafe = useCallback(
    async (result: SearchResult) => {
      if (selectedCafes.length >= 3) return;
      if (selectedCafes.some((c) => c.id === result.id)) return;

      setShowDropdown(false);
      setQuery("");
      setSearchResults([]);
      setLoading(true);

      try {
        const res = await fetch(`${API_BASE}/cafes/${result.id}`);
        if (!res.ok) throw new Error("Failed to fetch cafe detail");
        const cafe: CafeDetail = await res.json();
        setSelectedCafes((prev) => [...prev, cafe]);
      } catch {
        // Fallback: use search result data
        setSelectedCafes((prev) => [
          ...prev,
          {
            id: result.id,
            name: result.name,
            neighborhood: result.neighborhood,
            rating: result.rating,
            rating_count: result.rating_count,
            tags: result.tags,
            hero_photo: result.hero_photo,
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [selectedCafes]
  );

  const removeCafe = (id: string) => {
    setSelectedCafes((prev) => prev.filter((c) => c.id !== id));
  };

  // Determine winner for numeric rows (highest wins)
  const getNumericWinner = (
    cafes: CafeDetail[],
    key: keyof CafeDetail
  ): string | null => {
    let best: string | null = null;
    let bestVal = -Infinity;
    for (const c of cafes) {
      const val = c[key] as number | undefined;
      if (val != null && val > bestVal) {
        bestVal = val;
        best = c.id;
      }
    }
    return best;
  };

  // Determine winner for boolean rows (true wins)
  const getBooleanWinner = (
    cafes: CafeDetail[],
    check: (c: CafeDetail) => boolean
  ): string | null => {
    const winners = cafes.filter(check);
    if (winners.length === 1) return winners[0].id;
    return null;
  };

  const ratingWinner = getNumericWinner(selectedCafes, "rating");
  const reviewsWinner = getNumericWinner(selectedCafes, "rating_count");
  const wifiWinner = getBooleanWinner(selectedCafes, (c) =>
    hasTag(c.tags, "wifi", "good_wifi")
  );
  const outdoorWinner = getBooleanWinner(selectedCafes, (c) =>
    hasTag(c.tags, "outdoor", "outdoor_seating", "rooftop", "garden")
  );

  const highlightClass = (cafeId: string, winnerId: string | null) =>
    winnerId === cafeId ? "bg-green-50 text-green-800 font-semibold" : "";

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Compare Cafes</h2>

      {/* Search input */}
      <div className="relative mb-4" ref={dropdownRef}>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
          placeholder={
            selectedCafes.length >= 3
              ? "Max 3 cafes selected"
              : "Search for a cafe..."
          }
          disabled={selectedCafes.length >= 3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        {loading && (
          <div className="absolute right-3 top-3.5 w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        )}

        {/* Dropdown */}
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {searchResults.map((r) => {
              const alreadySelected = selectedCafes.some((c) => c.id === r.id);
              return (
                <button
                  key={r.id}
                  onClick={() => !alreadySelected && selectCafe(r)}
                  disabled={alreadySelected}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-amber-50 transition-colors ${
                    alreadySelected
                      ? "opacity-40 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  {r.hero_photo && (
                    <Image
                      src={r.hero_photo}
                      alt={r.name}
                      width={40}
                      height={40}
                      className="rounded-md object-cover w-10 h-10"
                    />
                  )}
                  <div>
                    <div className="font-medium text-gray-900">{r.name}</div>
                    {r.neighborhood && (
                      <div className="text-sm text-gray-500">
                        {r.neighborhood}
                      </div>
                    )}
                  </div>
                  {r.rating != null && (
                    <span className="ml-auto text-sm text-amber-600 font-medium">
                      {r.rating.toFixed(1)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected cafe pills */}
      {selectedCafes.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedCafes.map((c) => (
            <span
              key={c.id}
              className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full text-sm font-medium"
            >
              {c.name}
              <button
                onClick={() => removeCafe(c.id)}
                className="ml-1 w-5 h-5 flex items-center justify-center rounded-full bg-amber-200 hover:bg-amber-300 text-amber-700 text-xs leading-none transition-colors"
                aria-label={`Remove ${c.name}`}
              >
                x
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Comparison table */}
      {selectedCafes.length >= 2 && (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 w-32">
                  &nbsp;
                </th>
                {selectedCafes.map((c) => (
                  <th
                    key={c.id}
                    className="text-center px-4 py-3 font-semibold text-gray-900"
                  >
                    <Link
                      href={`/cafe/${c.id}-${toSlug(c.name)}`}
                      className="hover:text-amber-600 underline underline-offset-2"
                    >
                      {c.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Photo */}
              <tr className="border-b border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-600">Photo</td>
                {selectedCafes.map((c) => (
                  <td key={c.id} className="px-4 py-3 text-center">
                    {c.hero_photo ? (
                      <Image
                        src={c.hero_photo}
                        alt={c.name}
                        width={120}
                        height={80}
                        className="rounded-md object-cover w-[120px] h-[80px] mx-auto"
                      />
                    ) : (
                      <span className="text-gray-400">No photo</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Rating */}
              <tr className="border-b border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-600">Rating</td>
                {selectedCafes.map((c) => (
                  <td
                    key={c.id}
                    className={`px-4 py-3 text-center ${highlightClass(c.id, ratingWinner)}`}
                  >
                    {c.rating != null ? c.rating.toFixed(1) : "-"}
                  </td>
                ))}
              </tr>

              {/* Reviews */}
              <tr className="border-b border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-600">
                  Reviews
                </td>
                {selectedCafes.map((c) => (
                  <td
                    key={c.id}
                    className={`px-4 py-3 text-center ${highlightClass(c.id, reviewsWinner)}`}
                  >
                    {c.rating_count != null ? c.rating_count.toLocaleString() : "-"}
                  </td>
                ))}
              </tr>

              {/* Area */}
              <tr className="border-b border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-600">Area</td>
                {selectedCafes.map((c) => (
                  <td key={c.id} className="px-4 py-3 text-center">
                    {c.neighborhood || "-"}
                  </td>
                ))}
              </tr>

              {/* Price */}
              <tr className="border-b border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-600">Price</td>
                {selectedCafes.map((c) => (
                  <td key={c.id} className="px-4 py-3 text-center">
                    {c.price_range || "-"}
                  </td>
                ))}
              </tr>

              {/* Vibe Tags */}
              <tr className="border-b border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-600">
                  Vibe Tags
                </td>
                {selectedCafes.map((c) => (
                  <td key={c.id} className="px-4 py-3 text-center">
                    {c.tags && c.tags.length > 0 ? (
                      <div className="flex flex-wrap justify-center gap-1">
                        {c.tags.slice(0, 6).map((tag) => (
                          <span
                            key={tag}
                            className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs"
                          >
                            {tag.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                ))}
              </tr>

              {/* WiFi */}
              <tr className="border-b border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-600">WiFi</td>
                {selectedCafes.map((c) => {
                  const has = hasTag(c.tags, "wifi", "good_wifi");
                  return (
                    <td
                      key={c.id}
                      className={`px-4 py-3 text-center ${highlightClass(c.id, wifiWinner)}`}
                    >
                      {has ? "Yes" : "No"}
                    </td>
                  );
                })}
              </tr>

              {/* Outdoor */}
              <tr>
                <td className="px-4 py-3 font-medium text-gray-600">
                  Outdoor
                </td>
                {selectedCafes.map((c) => {
                  const has = hasTag(
                    c.tags,
                    "outdoor",
                    "outdoor_seating",
                    "rooftop",
                    "garden"
                  );
                  return (
                    <td
                      key={c.id}
                      className={`px-4 py-3 text-center ${highlightClass(c.id, outdoorWinner)}`}
                    >
                      {has ? "Yes" : "No"}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Empty state */}
      {selectedCafes.length < 2 && (
        <p className="text-gray-500 text-center mt-8">
          Select at least 2 cafes to compare them side by side.
        </p>
      )}
    </div>
  );
}
