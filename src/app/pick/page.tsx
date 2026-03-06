"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { decideCafe, makeSlug } from "@/lib/api";
import { Cafe } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n";

const DISPLAY_TAGS = new Set(["coffee","tea","bakery","roastery","food","premium","work_friendly","outdoor","quiet","pet_friendly","budget","top_rated","aesthetic","specialty_coffee","cozy","modern","romantic","chill","western_food","korean_food","japanese_food","sundanese_food","mountain_view","hidden_gem","kid_friendly","breakfast","lunch_spot","dinner_spot","garden","dessert","rooftop_view"]);

function formatTag(tag: string) {
  return tag.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function AICard({ cafe, featured }: { cafe: Cafe; featured?: boolean }) {
  const tags = (cafe.tags || []).filter(t => DISPLAY_TAGS.has(t)).slice(0, 4);

  return (
    <Link href={`/cafe/${makeSlug(cafe.id, cafe.name)}`} className="block active:opacity-70 transition-opacity">
      <div className={`bg-[var(--surface)] rounded-2xl overflow-hidden ${featured ? "mb-4" : "mb-3"}`}>
        {cafe.hero_photo && featured && (
          <div className="relative w-full h-48 sm:h-56">
            <Image
              src={cafe.hero_photo}
              alt={cafe.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 672px"
              loading="lazy"
            />
          </div>
        )}
        <div className="p-4">
          <h3 className={`font-bold ${featured ? "text-lg" : "text-[15px]"}`}>
            {cafe.name}
          </h3>
          <p className="text-[13px] text-[var(--muted)] mt-0.5">
            {cafe.neighborhood || cafe.area}
            {cafe.distance_km != null && ` · ${cafe.distance_km < 1 ? Math.round(cafe.distance_km * 1000) + "m" : cafe.distance_km.toFixed(1) + "km"}`}
          </p>

          {cafe.rating && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[13px] text-[var(--orange)] font-semibold">★ {cafe.rating}</span>
              {cafe.rating_count && (
                <span className="text-xs text-[var(--muted2)]">({cafe.rating_count.toLocaleString()})</span>
              )}
            </div>
          )}

          {tags.length > 0 && (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {tags.map(t => (
                <span key={t} className="text-[11px] px-2.5 py-0.5 rounded-full bg-[var(--surface)] text-[var(--muted)] font-medium">
                  {formatTag(t)}
                </span>
              ))}
            </div>
          )}

          {cafe.reason && featured && (
            <p className="text-[13px] text-[var(--foreground)] leading-relaxed mt-3 p-3 bg-[var(--surface)] rounded-xl">
              {cafe.reason}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

function PickContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { t } = useTranslation();

  const [top3, setTop3] = useState<Cafe[]>([]);
  const [more, setMore] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;
    setLoading(true);

    // Try to get location
    const doFetch = async () => {
      let lat: number | undefined;
      let lng: number | undefined;
      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) =>
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 3000 })
        );
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } catch {}

      const data = await decideCafe(query, lat, lng);
      setTop3(data.top3 || []);
      setMore(data.more || []);
      setLoading(false);
    };
    doFetch().catch(() => setLoading(false));
  }, [query]);

  return (
    <div className="min-h-dvh">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[var(--background)]/92 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="text-[var(--muted)] text-sm font-medium p-2 -ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            {t("pick.back")}
          </button>
          <p className="text-sm text-[var(--muted)] truncate flex-1">{query}</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-8">
        {loading && (
          <div className="text-center py-20 text-[var(--muted2)]">
            <div className="text-4xl mb-4 animate-pulse">☕</div>
            <p className="text-sm">{t("pick.finding")}</p>
          </div>
        )}

        {!loading && top3.length > 0 && (
          <>
            <p className="text-[11px] uppercase tracking-wider text-[var(--muted2)] font-semibold mt-5 mb-3">
              {t("pick.top_picks")}
            </p>
            {top3.map(c => (
              <AICard key={c.id} cafe={c} featured />
            ))}
          </>
        )}

        {!loading && more.length > 0 && (
          <>
            <p className="text-[11px] uppercase tracking-wider text-[var(--muted2)] font-semibold mt-6 mb-3">
              {t("pick.also_worth")}
            </p>
            {more.map(c => (
              <AICard key={c.id} cafe={c} />
            ))}
          </>
        )}

        {!loading && top3.length === 0 && (
          <div className="text-center py-20 text-[var(--muted2)] text-sm">
            <p>{t("pick.no_match")}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function PickPage() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh flex items-center justify-center text-[var(--muted2)]">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">☕</div>
          <p className="text-sm">Loading...</p>
        </div>
      </div>
    }>
      <PickContent />
    </Suspense>
  );
}
