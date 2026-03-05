import { Cafe } from "@/lib/types";
import { makeSlug } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

const DISPLAY_TAGS = new Set(["coffee","tea","bakery","roastery","food","bar_lounge","bistro","premium","work_friendly","outdoor","vintage","quiet","artsy","pet_friendly","budget","mid_range","upscale","top_rated","popular","late_night","aesthetic","instagrammable","date_spot","specialty_coffee","live_music","restaurant","cozy","modern","minimalist","industrial","tropical","rustic","elegant","romantic","lively","chill","western_food","korean_food","japanese_food","sundanese_food","chinese_food","seafood","steak","cocktails","wine","matcha","city_view","mountain_view","hidden_gem","kid_friendly","student","couple","group_friendly","solo_friendly","breakfast","lunch_spot","dinner_spot","weekend_brunch","hillside","garden","dessert","coworking","rooftop_view","brunch","bookish"]);

function formatTag(tag: string) {
  return tag.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function formatDistance(km?: number) {
  if (km == null) return null;
  return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`;
}

export default function CafeCard({ cafe }: { cafe: Cafe }) {
  const tags = (cafe.tags || []).filter(t => DISPLAY_TAGS.has(t)).slice(0, 3);
  const dist = formatDistance(cafe.distance_km);

  return (
    <Link
      href={`/cafe/${makeSlug(cafe.id, cafe.name)}`}
      className="flex gap-4 py-4 border-b border-[var(--surface)] active:opacity-60 transition-opacity"
    >
      {/* Photo */}
      {cafe.hero_photo ? (
        <img
          src={cafe.hero_photo}
          alt={cafe.name}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover flex-shrink-0 bg-[var(--surface)]"
          loading="lazy"
        />
      ) : (
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[var(--surface)] flex-shrink-0 flex items-center justify-center text-[var(--muted2)] text-2xl">
          ☕
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-[15px] sm:text-base leading-tight truncate">
            {cafe.name}
          </h3>
          {dist && (
            <span className="text-xs text-[var(--muted)] whitespace-nowrap flex-shrink-0 mt-0.5">
              {dist}
            </span>
          )}
        </div>

        <p className="text-[13px] text-[var(--muted)] mt-0.5 truncate">
          {cafe.neighborhood || cafe.area}
          {cafe.price_level && ` · ${cafe.price_level}`}
        </p>

        {cafe.rating && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[13px] text-[var(--orange)] font-semibold">
              ★ {cafe.rating}
            </span>
            {cafe.rating_count && (
              <span className="text-xs text-[var(--muted2)]">
                ({cafe.rating_count.toLocaleString()})
              </span>
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
      </div>
    </Link>
  );
}
