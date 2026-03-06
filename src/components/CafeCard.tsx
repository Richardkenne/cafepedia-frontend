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

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.3;
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={
            i < full
              ? "fill-[var(--accent)] text-[var(--accent)]"
              : i === full && half
              ? "fill-[var(--accent)]/50 text-[var(--accent)]"
              : "fill-none text-gray-200"
          }
        />
      ))}
    </div>
  );
}

export default function CafeCard({ cafe }: { cafe: Cafe }) {
  const tags = (cafe.tags || []).filter(t => DISPLAY_TAGS.has(t)).slice(0, 3);
  const dist = formatDistance(cafe.distance_km);

  return (
    <Link
      href={`/cafe/${makeSlug(cafe.id, cafe.name)}`}
      className="flex gap-4 py-4 border-b border-gray-100 group transition-colors hover:bg-gray-50/50 -mx-2 px-2 rounded-xl"
    >
      {/* Photo */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--surface)]">
        {cafe.hero_photo ? (
          <Image
            src={cafe.hero_photo}
            alt={cafe.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            sizes="(max-width: 640px) 96px, 112px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--muted2)]">
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-none stroke-current stroke-1.5">
              <path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8zM6 2v4M10 2v4M14 2v4" />
            </svg>
          </div>
        )}
        {dist && (
          <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[10px] text-white font-medium">
            <MapPin size={9} />
            {dist}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h3 className="font-semibold text-[15px] sm:text-base leading-tight truncate group-hover:text-[var(--accent)] transition-colors">
          {cafe.name}
        </h3>

        <p className="text-[13px] text-[var(--muted)] mt-0.5 truncate">
          {cafe.neighborhood || cafe.area}
          {cafe.price_level && ` · ${formatPrice(cafe.price_level)}`}
        </p>

        {cafe.rating && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <StarRating rating={cafe.rating} />
            <span className="text-[13px] font-semibold text-[var(--foreground)]">{cafe.rating}</span>
            {cafe.rating_count && (
              <span className="text-xs text-[var(--muted2)]">({cafe.rating_count.toLocaleString()})</span>
            )}
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {tags.map(t => (
              <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 text-[var(--muted)] font-medium">
                {formatTag(t)}
              </span>
            ))}
          </div>
        )}

        {cafe.description && (
          <p className="text-xs text-[var(--muted2)] mt-1.5 line-clamp-1 leading-relaxed">
            {cafe.description}
          </p>
        )}
      </div>
    </Link>
  );
}
