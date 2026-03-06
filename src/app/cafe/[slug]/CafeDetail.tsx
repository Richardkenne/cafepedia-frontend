"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getCafe, parseSlug } from "@/lib/api";
import { Cafe } from "@/lib/types";
import { formatHoursCompact } from "@/lib/formatHours";
import { DetailSkeleton } from "@/components/Skeleton";
import Image from "next/image";

const DISPLAY_TAGS = new Set(["coffee","tea","bakery","roastery","food","bar_lounge","bistro","premium","work_friendly","outdoor","vintage","quiet","artsy","pet_friendly","budget","mid_range","upscale","top_rated","popular","late_night","aesthetic","instagrammable","date_spot","specialty_coffee","live_music","restaurant","cozy","modern","minimalist","industrial","tropical","rustic","elegant","romantic","lively","chill","western_food","korean_food","japanese_food","sundanese_food","chinese_food","seafood","steak","cocktails","wine","matcha","city_view","mountain_view","hidden_gem","kid_friendly","student","couple","group_friendly","solo_friendly","breakfast","lunch_spot","dinner_spot","weekend_brunch","hillside","garden","dessert","coworking","rooftop_view","brunch","bookish"]);

function formatTag(tag: string) {
  return tag.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

const VIBE_TAGS: Record<string, string> = {
  cozy: "Cozy", chill: "Chill", romantic: "Romantic", lively: "Lively",
  quiet: "Quiet", elegant: "Elegant", rustic: "Rustic", modern: "Modern",
  minimalist: "Minimalist", industrial: "Industrial", tropical: "Tropical",
  vintage: "Vintage", aesthetic: "Aesthetic", artsy: "Artsy", bookish: "Bookish",
}

function getVibeSummary(tags: string[], environment?: string): string | null {
  const vibes = tags.filter(t => t in VIBE_TAGS).map(t => VIBE_TAGS[t])
  if (vibes.length > 0) return vibes.slice(0, 4).join(" · ")
  if (environment && environment !== "Casual") return environment
  return null
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-3 border-b border-[var(--surface)]">
      <div className="text-[11px] uppercase tracking-wider text-[var(--muted2)] font-medium mb-1">
        {label}
      </div>
      <div className="text-[15px] leading-relaxed">{children}</div>
    </div>
  );
}

export default function CafeDetail() {
  const router = useRouter();
  const params = useParams();
  const id = parseSlug(params.slug as string);

  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [loading, setLoading] = useState(true);

  const displayPhotos = useMemo(() => {
    if (!cafe?.photos || cafe.photos.length === 0) return [];
    const count = Math.min(3 + Math.floor(Math.random() * 3), cafe.photos.length); // 3, 4, or 5
    const shuffled = [...cafe.photos].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }, [cafe?.photos]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getCafe(id).then(c => {
      setCafe(c);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-dvh">
      {/* Sticky header */}
      <header className="sticky top-0 z-20 bg-white/92 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-[var(--muted)] text-sm font-medium p-2 -ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center gap-1"
          >
            ← Back
          </button>
          {cafe && (
            <h1 className="text-sm font-semibold truncate flex-1">
              {cafe.name}
            </h1>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto pb-8">
        {loading && (
          <div className="px-4 pt-4">
            <DetailSkeleton />
          </div>
        )}

        {!loading && !cafe && (
          <div className="text-center py-20 text-[var(--muted2)] text-sm">
            Cafe not found
          </div>
        )}

        {!loading && cafe && (
          <>
            {/* Photo gallery — 3 random photos per visit */}
            {displayPhotos.length > 0 && (
              <div className="relative">
                <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-1">
                  {displayPhotos.map((url, i) => (
                    <div key={url} className="relative w-full sm:w-4/5 h-56 sm:h-72 flex-shrink-0 snap-start">
                      <Image
                        src={url}
                        alt={`${cafe.name} photo ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 80vw"
                        priority={i === 0}
                        loading={i === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  ))}
                </div>
                {cafe.photos && cafe.photos.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
                    {cafe.photos.length} photos
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="px-4 pt-5">
              {/* Name + area */}
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
                {cafe.name}
              </h2>
              <p className="text-[14px] text-[var(--muted)] mt-1 leading-relaxed">
                {cafe.area || cafe.neighborhood}
                {cafe.address && ` · ${cafe.address}`}
              </p>

              {/* Rating */}
              {cafe.rating && (
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-3xl font-bold text-[var(--orange)]">
                    ★ {cafe.rating}
                  </span>
                  {(cafe.reviews || cafe.rating_count) && (
                    <span className="text-sm text-[var(--muted2)]">
                      {(cafe.reviews || cafe.rating_count)?.toLocaleString()} reviews
                    </span>
                  )}
                </div>
              )}

              {/* Description */}
              {cafe.description && (
                <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
                  {cafe.description}
                </p>
              )}

              {/* Tags */}
              {cafe.tags && cafe.tags.length > 0 && (
                <div className="flex gap-2 mt-4 flex-wrap">
                  {cafe.tags.filter(t => DISPLAY_TAGS.has(t)).map(t => (
                    <span
                      key={t}
                      className="text-[12px] px-3 py-1.5 rounded-full bg-[var(--surface)] text-[var(--muted)] font-medium"
                    >
                      {formatTag(t)}
                    </span>
                  ))}
                </div>
              )}

              {/* Info sections */}
              <div className="mt-6">
                {cafe.price_range && (
                  <Section label="Price">{(cafe.price_range as string).replace(/★/g, "$")}</Section>
                )}
                {cafe.type && (
                  <Section label="Type">{cafe.type}</Section>
                )}
                {getVibeSummary(cafe.tags || [], cafe.environment) && (
                  <Section label="Vibe">{getVibeSummary(cafe.tags || [], cafe.environment)}</Section>
                )}
                {cafe.hours && formatHoursCompact(cafe.hours) && (
                  <Section label="Hours">
                    <div className="whitespace-pre-line">
                      {formatHoursCompact(cafe.hours)}
                    </div>
                  </Section>
                )}
                {cafe.phone && (
                  <Section label="Phone">
                    <div className="flex items-center gap-3">
                      <a href={`tel:${cafe.phone}`} className="text-blue-600">
                        {cafe.phone}
                      </a>
                      <a
                        href={`https://wa.me/${cafe.phone.replace(/[^0-9+]/g, "").replace(/^\+/, "")}`}
                        target="_blank"
                        rel="noopener"
                        className="text-[12px] px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </Section>
                )}
                {cafe.instagram && (
                  <Section label="Instagram">
                    <a href={cafe.instagram} target="_blank" rel="noopener" className="text-blue-600">
                      {cafe.instagram.replace("https://www.instagram.com/", "@").replace(/\/$/, "")}
                    </a>
                  </Section>
                )}
                {cafe.website && (
                  <Section label="Website">
                    <a href={cafe.website} target="_blank" rel="noopener" className="text-blue-600">
                      {(() => { try { return new URL(cafe.website).hostname; } catch { return cafe.website; } })()}
                    </a>
                  </Section>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 mt-8 pb-safe">
                {cafe.google_maps_link && (
                  <a
                    href={cafe.google_maps_link}
                    target="_blank"
                    rel="noopener"
                    className="flex-1 text-center py-3.5 rounded-xl bg-[var(--foreground)] text-white text-[14px] font-semibold
                      active:scale-95 transition-transform min-h-[48px] flex items-center justify-center"
                  >
                    Open in Maps
                  </a>
                )}
                {cafe.phone && (
                  <a
                    href={`tel:${cafe.phone}`}
                    className="flex-1 text-center py-3.5 rounded-xl border border-[var(--border)] text-[14px] font-semibold
                      active:scale-95 transition-transform min-h-[48px] flex items-center justify-center"
                  >
                    Call
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
