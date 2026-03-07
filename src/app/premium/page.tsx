"use client";

import { useState } from "react";
import PremiumAIPicks from "@/components/premium/PremiumAIPicks";
import GroupPick from "@/components/premium/GroupPick";
import CafeCompare from "@/components/premium/CafeCompare";

const FEATURES = [
  { id: "picks", label: "Personal AI Picks", desc: "Best match, hidden gem & alternative" },
  { id: "group", label: "Group Pick", desc: "Find the perfect compromise for your group" },
  { id: "compare", label: "Cafe Compare", desc: "Compare 2-3 cafes side by side" },
] as const;

type FeatureId = (typeof FEATURES)[number]["id"];

export default function PremiumPage() {
  const [active, setActive] = useState<FeatureId>("picks");

  return (
    <>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <div className="min-h-dvh bg-gray-50">
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-5 py-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-amber-600 mb-1">
              Internal Testing
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
              Premium Features
            </h1>
            <p className="text-[13px] text-[var(--muted)] mt-1">
              Experimental features — not visible to users.
            </p>
          </div>
        </header>

        <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-5 flex gap-1 overflow-x-auto">
            {FEATURES.map((f) => (
              <button
                key={f.id}
                onClick={() => setActive(f.id)}
                className={`px-4 py-3 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                  active === f.id
                    ? "border-[var(--foreground)] text-[var(--foreground)]"
                    : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-5 py-8">
          {active === "picks" && <PremiumAIPicks />}
          {active === "group" && <GroupPick />}
          {active === "compare" && <CafeCompare />}
        </main>
      </div>
    </>
  );
}
