import { Cafe } from "@/lib/types";
import { makeSlug } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Star } from "lucide-react";

const DISPLAY_TAGS = new Set(["coffee","tea","bakery","roastery","food","bar_lounge","bistro","premium","work_friendly","outdoor","vintage","quiet","artsy","pet_friendly","budget","mid_range","upscale","top_rated","popular","late_night","aesthetic","instagrammable","date_spot","specialty_coffee","live_music","restaurant","cozy","modern","minimalist","industrial","tropical","rustic","elegant","romantic","lively","chill","western_food","korean_food","japanese_food","sundanese_food","chinese_food","seafood","steak","cocktails","wine","matcha","city_view","mountain_view","hidden_gem","kid_friendly","student","couple","group_friendly","solo_friendly","breakfast","lunch_spot","dinner_spot","weekend_brunch","hillside","garden","dessert","coworking","rooftop_view","brunch","bookish"]);

function formatTag(tag: string) {
  return tag.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function formatDistance(km?: number) {
  if (km == null) return null;
  return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`;
}

function formatPrice(price?: string) {
  if (!price) return null;
  const count = (price.match(/★/g) || []).length;
  return count > 0 ? "$".repeat(count) : price;
}

export default function CafeCard({ cafe }: { cafe: Cafe }) {
  const tags = (cafe.tags || []).filter(t => DISPLAY_TAGS.has(t)).slice(0, 2);
  const dist = formatDistance(cafe.distance_km);
  const price = formatPrice(cafe.price_level);

  return (
    <Link
      href={`/cafe/${makeSlug(cafe.id, cafe.name)}`}
      className="group block"
    >
      {/* Photo */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[var(--surface)]">
        {cafe.hero_photo ? (
          <Image
            src={cafe.hero_photo}
            alt={cafe.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-amber-50">
            <svg viewBox="0 0 32 32" className="w-10 h-10 text-[var(--accent)] opacity-40">
              <path fill="currentColor" d="M6 10h14v12a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V10z"/>
              <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M20 13h2a3 3 0 0 1 0 6h-2"/>
              <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M10 3c0 2 2 3 2 5M13 2c0 2 2 3 2 5M16 3c0 2 2 3 2 5"/>
            </svg>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Distance badge */}
        {dist && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[11px] font-semibold text-[var(--foreground)] shadow-sm">
            <MapPin size={11} className="text-[var(--accent)]" />
            {dist}
          </div>
        )}

        {/* Area on photo */}
        {(cafe.neighborhood || cafe.area) && (cafe.neighborhood || cafe.area) !== "Bandung" && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white/90 text-[11px] font-medium">
            <MapPin size={11} />
            <span>{cafe.neighborhood || cafe.area}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 px-0.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-[15px] leading-snug line-clamp-1 group-hover:text-[var(--accent)] transition-colors duration-200">
            {cafe.name}
          </h3>
          {price && (
            <span className="text-[12px] font-semibold text-[var(--muted)] flex-shrink-0 mt-0.5">{price}</span>
          )}
        </div>

        {cafe.rating && (
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex items-center gap-0.5">
              <Star size={13} className="fill-[var(--accent)] text-[var(--accent)]" />
              <span className="text-[13px] font-bold text-[var(--foreground)]">{cafe.rating}</span>
            </div>
            {cafe.rating_count && (
              <span className="text-[12px] text-[var(--muted2)]">({cafe.rating_count.toLocaleString()})</span>
            )}
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex gap-1.5 mt-2">
            {tags.map(t => (
              <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-[var(--surface)] text-[var(--muted)] font-medium">
                {formatTag(t)}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
