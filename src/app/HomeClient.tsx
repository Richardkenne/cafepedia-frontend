"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { searchCafes, makeSlug } from "@/lib/api";
import { Cafe } from "@/lib/types";
import SearchBar from "@/components/SearchBar";
import LangToggle from "@/components/LangToggle";
import { useTranslation } from "@/lib/i18n";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/Logo";
import { motion, useInView, useScroll, useMotionValueEvent } from "framer-motion";
import {
  Laptop,
  Heart,
  Camera,
  Building2,
  Flame,
  TreePine,
  Coffee,
  Moon,
  PawPrint,
  Gem,
  Sparkles,
  MapPin,
  Star,
  ChevronRight,
  TrendingUp,
  Search,
} from "lucide-react";

/* ─── Categories ─── */
const CATEGORIES = [
  { label: "Work", tag: "work_friendly", icon: Laptop, color: "#3B82F6" },
  { label: "Date Night", tag: "date_spot", icon: Heart, color: "#EC4899" },
  { label: "Aesthetic", tag: "aesthetic", icon: Camera, color: "#8B5CF6" },
  { label: "Rooftop", tag: "rooftop_view", icon: Building2, color: "#06B6D4" },
  { label: "Cozy", tag: "cozy", icon: Flame, color: "#F97316" },
  { label: "Outdoor", tag: "outdoor", icon: TreePine, color: "#22C55E" },
  { label: "Specialty", tag: "specialty_coffee", icon: Coffee, color: "#92400E" },
  { label: "Late Night", tag: "late_night", icon: Moon, color: "#6366F1" },
  { label: "Pet Friendly", tag: "pet_friendly", icon: PawPrint, color: "#F43F5E" },
  { label: "Hidden Gem", tag: "hidden_gem", icon: Gem, color: "#D946EF" },
];

const POPULAR_AREAS = [
  "Dago", "Braga", "Pasir Kaliki", "Buah Batu", "Setiabudhi",
  "Cihampelas", "Riau", "Dipatiukur", "Ciumbuleuit", "Lembang",
];

const DISCOVERY_LISTS = [
  { label: "Best Cafes in Bandung", desc: "Top-rated spots locals love", href: "/best-cafes-bandung" },
  { label: "Best Cafes to Work From", desc: "WiFi, outlets, quiet vibes", href: "/best-cafes-to-work-bandung" },
  { label: "Most Aesthetic Cafes", desc: "Instagram-worthy interiors", href: "/aesthetic-cafes-bandung" },
  { label: "Best Cheap Coffee", desc: "Great coffee under 25K IDR", href: "/cheap-cafes-bandung" },
  { label: "Best Date Cafes", desc: "Romantic & intimate settings", href: "/date-cafes-bandung" },
];

/* ─── Animation variants ─── */
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

/* ─── Animated section wrapper ─── */
function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ─── Star rating visual ─── */
function StarRating({ rating, count }: { rating: number; count?: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.3;
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={13}
            className={
              i < full
                ? "fill-[var(--accent)] text-[var(--accent)]"
                : i === full && half
                ? "fill-[var(--accent)]/50 text-[var(--accent)]"
                : "fill-none text-gray-300"
            }
          />
        ))}
      </div>
      <span className="text-[13px] font-semibold text-[var(--foreground)] ml-0.5">{rating}</span>
      {count != null && (
        <span className="text-xs text-[var(--muted2)]">({count.toLocaleString()})</span>
      )}
    </div>
  );
}

/* ─── Trending card ─── */
function TrendingCard({ cafe, rank }: { cafe: Cafe; rank: number }) {
  const vibes = (cafe.tags || [])
    .filter(t => ["cozy", "outdoor", "work_friendly", "aesthetic", "hidden_gem", "modern", "vintage", "quiet", "rooftop_view", "garden", "romantic", "specialty_coffee"].includes(t))
    .slice(0, 2)
    .map(t => t.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()));

  return (
    <motion.div variants={staggerItem}>
      <Link
        href={`/cafe/${makeSlug(cafe.id, cafe.name)}`}
        className="group block"
      >
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[var(--surface)]">
          {cafe.hero_photo ? (
            <Image
              src={cafe.hero_photo}
              alt={cafe.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              sizes="(max-width: 640px) 50vw, 280px"
              loading="lazy"
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
          {/* Gradient overlay bottom */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Rank badge */}
          <div className="absolute top-3 left-3 w-7 h-7 rounded-lg bg-white shadow-md flex items-center justify-center">
            <span className="text-xs font-bold text-[var(--foreground)]">{rank}</span>
          </div>

          {/* Area label on photo */}
          {cafe.area && cafe.area !== "Bandung" && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white/90 text-[11px] font-medium">
              <MapPin size={11} />
              <span>{cafe.area}</span>
            </div>
          )}
        </div>

        <div className="mt-3 px-0.5">
          <h3 className="font-bold text-[15px] sm:text-base leading-snug line-clamp-1 group-hover:text-[var(--accent)] transition-colors duration-200">
            {cafe.name}
          </h3>
          {cafe.rating && (
            <div className="mt-1">
              <StarRating rating={cafe.rating} count={cafe.rating_count} />
            </div>
          )}
          {vibes.length > 0 && (
            <div className="flex gap-1.5 mt-2">
              {vibes.map(v => (
                <span key={v} className="text-[11px] px-2 py-0.5 rounded-md bg-[var(--surface)] text-[var(--muted)] font-medium">
                  {v}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Main component ─── */
export default function HomeClient() {
  const [query, setQuery] = useState("");
  const [aiQuery, setAiQuery] = useState("");
  const [shake, setShake] = useState(false);
  const [trending, setTrending] = useState<Cafe[]>([]);
  // Curated high-quality hero: Kalpa Tree (2400px premium photo)
  const HERO_IMAGE = "https://fkpxolnsqjfgcbkiqbld.supabase.co/storage/v1/object/public/cafe-photos/637_kalpa_tree/hero.jpg";
  const [heroImage] = useState<string>(HERO_IMAGE);
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const aiRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 300);
  });

  useEffect(() => {
    searchCafes({ q: "popular" }).then(data => {
      const cafes = data.results || [];
      setTrending(cafes.filter(c => c.hero_photo).slice(0, 8));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      const dismissed = sessionStorage.getItem("pwa-dismissed");
      if (!dismissed) setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;
    (installPrompt as unknown as { prompt: () => void }).prompt();
    setShowInstall(false);
  }

  function dismissInstall() {
    setShowInstall(false);
    sessionStorage.setItem("pwa-dismissed", "1");
  }

  function go(q: string) {
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  function goNear() {
    if (!("geolocation" in navigator)) {
      alert(t("alert.location_not_supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        router.push(`/search?q=&near=${pos.coords.latitude},${pos.coords.longitude}`);
      },
      (err) => {
        if (err.code === 1) alert(t("alert.location_denied"));
        else if (err.code === 3) alert(t("alert.location_timeout"));
        else alert(t("alert.location_error"));
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }

  function goAI(q: string) {
    if (!q.trim()) {
      setShake(true);
      aiRef.current?.querySelector("input")?.focus();
      setTimeout(() => setShake(false), 500);
      return;
    }
    router.push(`/pick?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <main className="min-h-dvh bg-white">
      {/* ━━━ NAVBAR — sticky, always visible ━━━ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          {/* Logo + Brand — always top-left */}
          <Logo
            size={36}
            textClassName={`text-[22px] font-black tracking-tight transition-colors duration-300 ${
              scrolled ? "text-[var(--foreground)]" : "text-white"
            }`}
          />

          {/* Center: compact search (only when scrolled) */}
          {scrolled && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="hidden sm:flex flex-1 max-w-md mx-8"
            >
              <button
                onClick={() => {
                  const el = document.querySelector<HTMLInputElement>('input[type="search"]');
                  if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); el.focus(); }
                  else router.push("/search");
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-gray-200 bg-gray-50
                  hover:bg-white hover:border-gray-300 hover:shadow-sm transition-all text-left"
              >
                <Search size={16} className="text-[var(--muted2)]" />
                <span className="text-sm text-[var(--muted2)]">Search cafes, areas, vibes...</span>
              </button>
            </motion.div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              href="/search?q=*"
              className={`hidden sm:block text-sm font-bold transition-colors duration-300 ${
                scrolled ? "text-[var(--muted)] hover:text-[var(--foreground)]" : "text-white/80 hover:text-white"
              }`}
            >
              Explore
            </Link>
            <Link
              href="/blog"
              className={`hidden sm:block text-sm font-bold transition-colors duration-300 ${
                scrolled ? "text-[var(--muted)] hover:text-[var(--foreground)]" : "text-white/80 hover:text-white"
              }`}
            >
              Blog
            </Link>
            <LangToggle />
          </div>
        </div>
      </nav>

      {/* ━━━ HERO ━━━ */}
      <section className="relative w-full h-[420px] sm:h-[480px] flex items-end justify-center overflow-hidden">
        <Image
          src={heroImage}
          alt="Cafe in Bandung"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center px-6 w-full max-w-2xl text-center pb-20 sm:pb-24"
        >
          <h1 className="text-[32px] sm:text-[56px] font-black text-white leading-[1.05] tracking-tight">
            Discover the best places<br className="hidden sm:block" /> in Bandung
          </h1>
          <p className="text-white/65 text-base sm:text-lg mt-3 font-semibold tracking-wide">
            2,800+ cafes, bars, rooftops & coworking spaces
          </p>

          {/* Search bar */}
          <div className="w-full mt-6 flex gap-2 max-w-lg">
            <div className="flex-1">
              <SearchBar
                value={query}
                onChange={setQuery}
                onSubmit={go}
                placeholder={t("home.search_placeholder")}
                large
                autoFocus
              />
            </div>
            <button
              onClick={goNear}
              className="px-4 rounded-2xl bg-white/10 backdrop-blur-md text-white border border-white/15
                hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center min-w-[52px] min-h-[52px]"
              aria-label={t("home.near_me")}
              title={t("home.near_me")}
            >
              <MapPin size={20} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* ━━━ CATEGORY BAR (floating over hero) ━━━ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-5xl mx-auto px-4 -mt-10 relative z-10"
      >
        <div className="bg-white rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.08)] border border-gray-100 px-3 py-4 sm:px-5 sm:py-5">
          <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide pb-1">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.tag}
                  href={`/search?q=${cat.tag}`}
                  className="flex flex-col items-center gap-1.5 min-w-[68px] sm:min-w-[76px] py-1.5 rounded-xl
                    hover:bg-gray-50 active:scale-95 transition-all group"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${cat.color}12` }}
                  >
                    <Icon size={20} style={{ color: cat.color }} strokeWidth={1.8} />
                  </div>
                  <span className="text-[11px] font-bold text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors whitespace-nowrap">
                    {cat.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ━━━ TRENDING CAFES ━━━ */}
      {trending.length > 0 && (
        <AnimatedSection className="w-full max-w-5xl mx-auto px-5 pt-12 pb-6 sm:pt-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-light)] flex items-center justify-center">
                <TrendingUp size={16} className="text-[var(--accent)]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">Trending Right Now</h2>
                <p className="text-xs text-[var(--muted2)] mt-0.5">Most searched this week in Bandung</p>
              </div>
            </div>
            <Link
              href="/search?q=*"
              className="text-sm text-[var(--accent)] font-semibold hover:opacity-75 transition-opacity flex items-center gap-0.5"
            >
              See all <ChevronRight size={16} />
            </Link>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5"
          >
            {trending.map((cafe, i) => (
              <TrendingCard key={cafe.id} cafe={cafe} rank={i + 1} />
            ))}
          </motion.div>
        </AnimatedSection>
      )}

      {/* ━━━ POPULAR AREAS ━━━ */}
      <AnimatedSection className="w-full max-w-5xl mx-auto px-5 py-10">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <MapPin size={16} className="text-blue-500" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">Popular Areas</h2>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {POPULAR_AREAS.map(area => (
            <Link
              key={area}
              href={`/search?q=${encodeURIComponent(area)}`}
              className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-bold text-[var(--muted)]
                hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)]
                active:scale-95 transition-all duration-200"
            >
              {area}
            </Link>
          ))}
        </div>
      </AnimatedSection>

      {/* ━━━ PICK FOR ME ━━━ */}
      <AnimatedSection className="w-full max-w-5xl mx-auto px-5 py-8">
        <div className="rounded-2xl border border-gray-100 bg-gray-50/50 px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Not sure where to go?
              </h2>
              <p className="text-sm sm:text-base text-[var(--muted)] mt-1.5 leading-relaxed">
                Describe what you&apos;re looking for and we&apos;ll find the best matches.
              </p>
            </div>
            <div className="sm:w-[320px] flex-shrink-0">
              <div className={`flex gap-2 ${shake ? "animate-shake" : ""}`} ref={aiRef}>
                <div className="flex-1">
                  <SearchBar
                    value={aiQuery}
                    onChange={setAiQuery}
                    onSubmit={(q) => goAI(q)}
                    placeholder="quiet cafe to work near dago"
                  />
                </div>
              </div>
              <button
                onClick={() => goAI(aiQuery)}
                className="mt-3 w-full px-6 py-3 rounded-xl bg-[var(--foreground)] text-white text-sm font-semibold
                  hover:opacity-90 active:scale-[0.97] transition-all duration-200
                  flex items-center justify-center gap-2"
              >
                <Sparkles size={14} />
                Pick for me
              </button>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ━━━ DISCOVERY COLLECTIONS ━━━ */}
      <AnimatedSection className="w-full max-w-5xl mx-auto px-5 py-8">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-4">Explore Collections</h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {DISCOVERY_LISTS.map(item => (
            <motion.div key={item.href} variants={staggerItem}>
              <Link
                href={item.href}
                className="flex items-center justify-between px-5 py-4 rounded-xl border border-gray-100 bg-gray-50/50
                  hover:bg-white hover:border-gray-200 hover:shadow-sm
                  active:scale-[0.98] transition-all duration-200 group"
              >
                <div>
                  <span className="font-bold text-[15px] text-[var(--foreground)]">{item.label}</span>
                  <p className="text-xs text-[var(--muted2)] mt-0.5">{item.desc}</p>
                </div>
                <ChevronRight size={18} className="text-[var(--muted2)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatedSection>

      {/* ━━━ STATS BAR ━━━ */}
      <AnimatedSection className="w-full max-w-5xl mx-auto px-5 py-8">
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { value: "2,800+", label: "Places" },
            { value: "9", label: "Categories" },
            { value: "10+", label: "Areas" },
          ].map(stat => (
            <div key={stat.label} className="py-4">
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--foreground)]">{stat.value}</div>
              <div className="text-xs font-bold text-[var(--muted2)] uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* ━━━ FOOTER ━━━ */}
      <footer className="w-full border-t border-gray-100 bg-gray-50/50 mt-4">
        <div className="max-w-5xl mx-auto px-5 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-8">
            {/* Brand column */}
            <div className="max-w-[260px]">
              <div className="mb-3">
                <Logo size={24} textClassName="text-base font-bold tracking-tight text-[var(--foreground)]" />
              </div>
              <p className="text-[13px] text-[var(--muted)] leading-relaxed">
                The ultimate guide to cafes, bars, rooftops and coworking spaces in Bandung. Discover, decide, go.
              </p>
            </div>

            {/* Link columns */}
            <div className="flex gap-16 text-[13px]">
              <div className="flex flex-col gap-3">
                <span className="font-bold text-[11px] uppercase tracking-widest text-[var(--muted2)]">Discover</span>
                <a href="/search?q=*" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">All places</a>
                <a href="/browse" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">Browse</a>
                <a href="/blog" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">Blog</a>
                <a href="/pick" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">AI Picks</a>
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-bold text-[11px] uppercase tracking-widest text-[var(--muted2)]">Company</span>
                <a href="/about" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">About</a>
                <a href="/suggest" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">Submit a place</a>
                <a href="/claim" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">Claim listing</a>
                <a href="/contact" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">Contact</a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] text-[var(--muted2)] mt-10 pt-6 border-t border-gray-200">
            <span>&copy; {new Date().getFullYear()} Cafepedia. Bandung, Indonesia.</span>
            <div className="flex gap-4">
              <a href="/privacy" className="hover:text-[var(--foreground)] transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-[var(--foreground)] transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ━━━ PWA Install banner ━━━ */}
      {showInstall && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between gap-4 z-50 shadow-[0_-4px_30px_rgba(0,0,0,0.08)]"
        >
          <p className="text-[13px] text-[var(--muted)]">
            {t("home.install_prompt")}
          </p>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={dismissInstall}
              className="text-[13px] text-[var(--muted2)] px-3 py-2 min-h-[44px]"
            >
              {t("home.later")}
            </button>
            <button
              onClick={handleInstall}
              className="text-[13px] font-bold bg-[var(--foreground)] text-white px-5 py-2 rounded-xl min-h-[44px]
                hover:opacity-90 active:scale-95 transition-all"
            >
              {t("home.install")}
            </button>
          </div>
        </motion.div>
      )}
    </main>
  );
}
