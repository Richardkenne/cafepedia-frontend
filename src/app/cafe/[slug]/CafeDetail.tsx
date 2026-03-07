"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { getCafe, parseSlug, searchCafes, makeSlug } from "@/lib/api";
import { Cafe } from "@/lib/types";
import Link from "next/link";
import { formatHoursCompact } from "@/lib/formatHours";
import { DetailSkeleton } from "@/components/Skeleton";
import Image from "next/image";
import {
  ArrowLeft, Star, MapPin, Clock, Phone, Globe, Instagram,
  Navigation, Share2, ChevronLeft, ChevronRight, X, ExternalLink,
} from "lucide-react";

const DISPLAY_TAGS = new Set(["coffee","tea","bakery","roastery","food","bar_lounge","bistro","premium","work_friendly","outdoor","vintage","quiet","artsy","pet_friendly","budget","mid_range","upscale","top_rated","popular","late_night","aesthetic","instagrammable","date_spot","specialty_coffee","live_music","restaurant","cozy","modern","minimalist","industrial","tropical","rustic","elegant","romantic","lively","chill","western_food","korean_food","japanese_food","sundanese_food","chinese_food","seafood","steak","cocktails","wine","matcha","city_view","mountain_view","hidden_gem","kid_friendly","student","couple","group_friendly","solo_friendly","breakfast","lunch_spot","dinner_spot","weekend_brunch","hillside","garden","dessert","coworking","rooftop_view","brunch","bookish"]);

function formatTag(tag: string) {
  return tag.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

const VIBE_TAGS: Record<string, string> = {
  cozy: "Cozy", chill: "Chill", romantic: "Romantic", lively: "Lively",
  quiet: "Quiet", elegant: "Elegant", rustic: "Rustic", modern: "Modern",
  minimalist: "Minimalist", industrial: "Industrial", tropical: "Tropical",
  vintage: "Vintage", aesthetic: "Aesthetic", artsy: "Artsy", bookish: "Bookish",
};

function getVibeSummary(tags: string[]): string | null {
  const vibes = tags.filter(t => t in VIBE_TAGS).map(t => VIBE_TAGS[t]);
  return vibes.length > 0 ? vibes.slice(0, 4).join(" · ") : null;
}

function formatPrice(price?: string) {
  if (!price) return null;
  const count = (price.match(/★/g) || []).length;
  return count > 0 ? "$".repeat(count) : price;
}

const AMENITY_TAGS = new Set(["work_friendly","outdoor","indoor","ac","parking","smoking_area","halal","pet_friendly","kid_friendly","live_music","coworking","rooftop_view","garden","hillside","city_view","mountain_view","lake_view","pool","playground","board_games","ev_charging","prayer_room","meeting_room","private_room","reservation_needed","24h"]);

function extractIgHandle(ig?: string): string | null {
  if (!ig) return null;
  const clean = ig.replace(/https?:\/\/(www\.)?instagram\.com\//i, "").replace(/\/$/, "").trim();
  return clean ? `@${clean.replace(/^@/, "")}` : null;
}

export default function CafeDetail() {
  const router = useRouter();
  const params = useParams();
  const id = parseSlug(params.slug as string);

  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [similar, setSimilar] = useState<Cafe[]>([]);

  const allPhotos = cafe?.photos || [];
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevPhoto = useCallback(() => setLightboxIndex(i => i !== null ? (i - 1 + allPhotos.length) % allPhotos.length : null), [allPhotos.length]);
  const nextPhoto = useCallback(() => setLightboxIndex(i => i !== null ? (i + 1) % allPhotos.length : null), [allPhotos.length]);

  const openLightbox = useCallback((url: string) => {
    const idx = allPhotos.indexOf(url);
    setLightboxIndex(idx >= 0 ? idx : 0);
  }, [allPhotos]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevPhoto();
      else if (e.key === "ArrowRight") nextPhoto();
      else if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, prevPhoto, nextPhoto, closeLightbox]);

  const touchStartX = useCallback((e: React.TouchEvent) => {
    (e.currentTarget as HTMLElement).dataset.startX = String(e.touches[0].clientX);
  }, []);
  const touchEndX = useCallback((e: React.TouchEvent) => {
    const startX = Number((e.currentTarget as HTMLElement).dataset.startX || 0);
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 50) { diff > 0 ? prevPhoto() : nextPhoto(); }
  }, [prevPhoto, nextPhoto]);

  const displayPhotos = useMemo(() => {
    if (!cafe?.photos || cafe.photos.length === 0) return [];
    return cafe.photos.slice(0, 5);
  }, [cafe?.photos]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getCafe(id).then(c => {
      setCafe(c);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  // Fetch similar places
  useEffect(() => {
    if (!cafe) return;
    const vibeTags = (cafe.tags || []).filter(t => !AMENITY_TAGS.has(t) && DISPLAY_TAGS.has(t)).slice(0, 2);
    const q = vibeTags.length > 0 ? vibeTags.join(" ") : (cafe.area || "popular");
    searchCafes({ q }).then(data => {
      setSimilar((data.results || []).filter(c => c.id !== cafe.id && c.hero_photo).slice(0, 4));
    }).catch(() => {});
  }, [cafe]);

  const vibeSummary = cafe ? getVibeSummary(cafe.tags || []) : null;
  const price = cafe ? formatPrice(cafe.price_range as string) : null;
  const hours = cafe?.hours ? formatHoursCompact(cafe.hours) : null;
  const igHandle = cafe ? extractIgHandle(cafe.instagram) : null;
  const allTags = (cafe?.tags || []).filter(t => DISPLAY_TAGS.has(t));
  const vibeTags = allTags.filter(t => !AMENITY_TAGS.has(t));
  const amenityTags = allTags.filter(t => AMENITY_TAGS.has(t));

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: cafe?.name, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  }

  return (
    <div className="min-h-dvh bg-white">
      {/* Back button — floating over photo */}
      <div className="fixed top-4 left-4 z-30 flex gap-2">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center
            hover:bg-white transition-colors"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>
      </div>
      <div className="fixed top-4 right-4 z-30">
        <button
          onClick={handleShare}
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center
            hover:bg-white transition-colors"
          aria-label="Share"
        >
          <Share2 size={16} />
        </button>
      </div>

      <main className="max-w-4xl mx-auto pb-32">
        {loading && (
          <div className="px-4 pt-16">
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
            {/* ─── Photo Gallery ─── */}
            {displayPhotos.length > 0 ? (
              <div className="sm:px-6 sm:pt-6">
                {/* Desktop: Airbnb-style grid */}
                <div className="hidden sm:grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-[420px] cursor-pointer">
                  <div
                    className="col-span-2 row-span-2 relative group"
                    onClick={() => openLightbox(displayPhotos[0])}
                  >
                    <Image
                      src={displayPhotos[0]}
                      alt={`${cafe.name}`}
                      fill
                      className="object-cover group-hover:brightness-90 transition-all duration-300"
                      sizes="50vw"
                      priority
                    />
                  </div>
                  {displayPhotos.slice(1, 5).map((url, i) => (
                    <div
                      key={url}
                      className="relative group"
                      onClick={() => openLightbox(url)}
                    >
                      <Image
                        src={url}
                        alt={`${cafe.name} photo ${i + 2}`}
                        fill
                        className="object-cover group-hover:brightness-90 transition-all duration-300"
                        sizes="25vw"
                        loading="lazy"
                      />
                      {i === Math.min(3, displayPhotos.length - 2) && allPhotos.length > 5 && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">+{allPhotos.length - 5} foto</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Mobile: horizontal scroll */}
                <div className="sm:hidden flex gap-1 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                  {displayPhotos.map((url, i) => (
                    <div
                      key={url}
                      className="relative flex-shrink-0 w-[85vw] aspect-[4/3] snap-center first:ml-0"
                      onClick={() => openLightbox(url)}
                    >
                      <Image
                        src={url}
                        alt={`${cafe.name} photo ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="85vw"
                        priority={i === 0}
                        loading={i === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full h-56 sm:h-72 flex items-center justify-center bg-gradient-to-br from-teal-50 to-amber-50 sm:mx-6 sm:mt-6 sm:rounded-2xl">
                <svg viewBox="0 0 32 32" className="w-14 h-14 text-[var(--accent)] opacity-30">
                  <path fill="currentColor" d="M6 10h14v12a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V10z"/>
                  <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M20 13h2a3 3 0 0 1 0 6h-2"/>
                  <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M10 3c0 2 2 3 2 5M13 2c0 2 2 3 2 5M16 3c0 2 2 3 2 5"/>
                </svg>
              </div>
            )}

            {/* ─── Lightbox ─── */}
            {lightboxIndex !== null && allPhotos[lightboxIndex] && (
              <div
                className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                onClick={closeLightbox}
                onTouchStart={touchStartX}
                onTouchEnd={touchEndX}
              >
                <button
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-10 transition-colors"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
                <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/70 text-sm z-10 font-medium">
                  {lightboxIndex + 1} / {allPhotos.length}
                </div>
                {allPhotos.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                      className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-10 transition-colors"
                      aria-label="Previous"
                    >
                      <ChevronLeft size={22} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                      className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-10 transition-colors"
                      aria-label="Next"
                    >
                      <ChevronRight size={22} />
                    </button>
                  </>
                )}
                <div className="relative w-full h-full max-w-5xl max-h-[85vh] mx-12" onClick={(e) => e.stopPropagation()}>
                  <Image
                    key={allPhotos[lightboxIndex]}
                    src={allPhotos[lightboxIndex]}
                    alt={`${cafe.name} photo ${lightboxIndex + 1}`}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                </div>
              </div>
            )}

            {/* ─── Content ─── */}
            <div className="px-5 sm:px-6 pt-8">

              {/* ── Header: Name + Type badge ── */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-[var(--foreground)]">
                    {cafe.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {cafe.type && (
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[var(--accent-light)] text-[var(--accent)]">
                        {cafe.type}
                      </span>
                    )}
                    {(cafe.area || cafe.neighborhood) && (
                      <span className="flex items-center gap-1 text-[13px] text-[var(--muted)]">
                        <MapPin size={13} className="text-[var(--accent)]" />
                        {cafe.area || cafe.neighborhood}
                      </span>
                    )}
                    {price && (
                      <span className="text-[13px] font-semibold text-[var(--muted2)]">{price}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Rating + Vibe ── */}
              {cafe.rating && (
                <div className="mt-6 flex items-stretch gap-4 p-5 rounded-2xl bg-[var(--surface)]">
                  <div className="flex flex-col items-center justify-center px-3">
                    <span className="text-3xl font-extrabold text-[var(--foreground)]">{cafe.rating}</span>
                    <div className="flex gap-0.5 mt-1.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < Math.floor(Number(cafe.rating!))
                              ? "fill-[var(--accent)] text-[var(--accent)]"
                              : i === Math.floor(Number(cafe.rating!)) && Number(cafe.rating!) % 1 >= 0.3
                              ? "fill-[var(--accent)]/50 text-[var(--accent)]"
                              : "fill-none text-gray-200"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <div className="h-auto w-px bg-gray-200" />
                  <div className="flex flex-col justify-center">
                    <span className="text-[15px] font-semibold text-[var(--foreground)]">
                      {(Number(cafe.reviews) || cafe.rating_count || 0).toLocaleString()}
                    </span>
                    <span className="text-[13px] text-[var(--muted)]">ulasan Google</span>
                    {vibeSummary && (
                      <p className="text-[12px] text-[var(--accent)] font-medium mt-1.5">{vibeSummary}</p>
                    )}
                  </div>
                </div>
              )}

              {/* ── Quick actions row ── */}
              <div className="mt-6 flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
                {cafe.google_maps_link && (
                  <a
                    href={cafe.google_maps_link}
                    target="_blank"
                    rel="noopener"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-[13px] font-semibold text-[var(--foreground)]
                      hover:bg-gray-50 active:scale-[0.97] transition-all flex-shrink-0"
                  >
                    <Navigation size={15} className="text-[var(--accent)]" />
                    Directions
                  </a>
                )}
                {cafe.phone && (
                  <a
                    href={`https://wa.me/${cafe.phone.replace(/[^0-9+]/g, "").replace(/^\+/, "")}`}
                    target="_blank"
                    rel="noopener"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-[13px] font-semibold text-[var(--foreground)]
                      hover:bg-gray-50 active:scale-[0.97] transition-all flex-shrink-0"
                  >
                    <Phone size={15} className="text-green-500" />
                    WhatsApp
                  </a>
                )}
                {cafe.instagram && (
                  <a
                    href={cafe.instagram}
                    target="_blank"
                    rel="noopener"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-[13px] font-semibold text-[var(--foreground)]
                      hover:bg-gray-50 active:scale-[0.97] transition-all flex-shrink-0"
                  >
                    <Instagram size={15} className="text-pink-500" />
                    {igHandle || "Instagram"}
                  </a>
                )}
                {cafe.website && (
                  <a
                    href={cafe.website}
                    target="_blank"
                    rel="noopener"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-[13px] font-semibold text-[var(--foreground)]
                      hover:bg-gray-50 active:scale-[0.97] transition-all flex-shrink-0"
                  >
                    <Globe size={15} className="text-blue-500" />
                    Website
                  </a>
                )}
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-[13px] font-semibold text-[var(--muted)]
                    hover:bg-gray-50 active:scale-[0.97] transition-all flex-shrink-0"
                >
                  <Share2 size={15} />
                  Share
                </button>
              </div>

              {/* ═══════════════ About ═══════════════ */}
              {cafe.description && (
                <>
                  <div className="h-px bg-gray-100 mt-8 mb-7" />
                  <h3 className="text-[13px] font-bold text-[var(--foreground)] uppercase tracking-wider mb-3">About</h3>
                  <p className="text-[15px] leading-[1.85] text-[var(--foreground)]/80">
                    {cafe.description}
                  </p>
                </>
              )}

              {/* ═══════════════ Vibe ═══════════════ */}
              {displayTags.length > 0 && (
                <>
                  <div className="h-px bg-gray-100 mt-8 mb-7" />
                  <h3 className="text-[13px] font-bold text-[var(--foreground)] uppercase tracking-wider mb-4">Vibe</h3>
                  <div className="flex gap-2 flex-wrap">
                    {displayTags.map(t => (
                      <span
                        key={t}
                        className="text-[12px] px-3 py-1.5 rounded-full border border-gray-200 text-[var(--muted)] font-medium
                          hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-default"
                      >
                        {formatTag(t)}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {/* ═══════════════ Hours & Contact ═══════════════ */}
              <div className="h-px bg-gray-100 mt-8 mb-7" />
              <h3 className="text-[13px] font-bold text-[var(--foreground)] uppercase tracking-wider mb-5">Hours & Contact</h3>

              <div className="space-y-0 rounded-2xl border border-gray-100 overflow-hidden">
                {/* Hours */}
                {hours && (
                  <div className="flex gap-4 p-5 border-b border-gray-100 last:border-b-0">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                      <Clock size={18} className="text-[var(--accent)]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-[var(--muted2)] uppercase tracking-wider mb-1">Jam Buka</p>
                      <div className="text-[14px] leading-relaxed whitespace-pre-line">{hours}</div>
                    </div>
                  </div>
                )}

                {/* Phone */}
                {cafe.phone && (
                  <div className="flex gap-4 p-5 border-b border-gray-100 last:border-b-0">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                      <Phone size={18} className="text-green-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-[var(--muted2)] uppercase tracking-wider mb-1">Telepon</p>
                      <div className="flex items-center gap-3">
                        <a href={`tel:${cafe.phone}`} className="text-[14px] text-[var(--foreground)] font-medium">
                          {cafe.phone}
                        </a>
                        <a
                          href={`https://wa.me/${cafe.phone.replace(/[^0-9+]/g, "").replace(/^\+/, "")}`}
                          target="_blank"
                          rel="noopener"
                          className="text-[11px] px-2.5 py-1 rounded-full bg-green-50 text-green-600 font-semibold border border-green-100"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Instagram */}
                {cafe.instagram && (
                  <div className="flex gap-4 p-5 border-b border-gray-100 last:border-b-0">
                    <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center flex-shrink-0">
                      <Instagram size={18} className="text-pink-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-[var(--muted2)] uppercase tracking-wider mb-1">Instagram</p>
                      <a href={cafe.instagram} target="_blank" rel="noopener"
                        className="text-[14px] text-pink-500 font-semibold flex items-center gap-1.5 group/ig">
                        <span>{igHandle}</span>
                        <ExternalLink size={12} className="opacity-0 group-hover/ig:opacity-100 transition-opacity" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Website */}
                {cafe.website && (
                  <div className="flex gap-4 p-5 border-b border-gray-100 last:border-b-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Globe size={18} className="text-blue-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-[var(--muted2)] uppercase tracking-wider mb-1">Situs Web</p>
                      <a href={cafe.website} target="_blank" rel="noopener"
                        className="text-[14px] text-blue-500 font-medium flex items-center gap-1.5 truncate group/web">
                        <span className="truncate">{(() => { try { return new URL(cafe.website).hostname; } catch { return cafe.website; } })()}</span>
                        <ExternalLink size={12} className="opacity-0 group-hover/web:opacity-100 transition-opacity flex-shrink-0" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* ═══════════════ Location ═══════════════ */}
              {cafe.address && (
                <>
                  <div className="h-px bg-gray-100 mt-8 mb-7" />
                  <h3 className="text-[13px] font-bold text-[var(--foreground)] uppercase tracking-wider mb-5">Location</h3>
                  <div className="flex gap-4 p-5 rounded-2xl border border-gray-100">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                      <MapPin size={18} className="text-[var(--accent)]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] leading-relaxed">{cafe.address}</p>
                    </div>
                  </div>
                </>
              )}

              {/* Bottom spacer for sticky bar */}
              <div className="h-8" />
            </div>

            {/* ─── Sticky bottom action bar ─── */}
            <div className="fixed bottom-0 inset-x-0 z-20 bg-white/95 backdrop-blur-xl border-t border-gray-100 pb-safe">
              <div className="max-w-4xl mx-auto px-5 py-3 flex gap-3">
                {cafe.google_maps_link && (
                  <a
                    href={cafe.google_maps_link}
                    target="_blank"
                    rel="noopener"
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[var(--accent)] text-white text-[14px] font-bold
                      active:scale-[0.97] transition-all shadow-lg shadow-[var(--accent)]/20 min-h-[48px]"
                  >
                    <Navigation size={16} />
                    Buka di Maps
                  </a>
                )}
                {cafe.phone && (
                  <a
                    href={`https://wa.me/${cafe.phone.replace(/[^0-9+]/g, "").replace(/^\+/, "")}`}
                    target="_blank"
                    rel="noopener"
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-green-500 text-green-600 text-[14px] font-bold
                      active:scale-[0.97] transition-all min-h-[48px]"
                  >
                    <Phone size={16} />
                    WhatsApp
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
