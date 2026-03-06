import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Claim Your Cafe — Cafepedia",
  description:
    "Own a cafe in Bandung? Claim your listing on Cafepedia to update info, add photos, and reach more customers.",
  alternates: { canonical: "https://cafepedia.id/claim" },
  openGraph: {
    title: "Claim Your Cafe — Cafepedia",
    description:
      "Own a cafe in Bandung? Claim your listing on Cafepedia to update info, add photos, and reach more customers.",
    url: "https://cafepedia.id/claim",
    siteName: "Cafepedia",
    type: "website",
  },
};

export default function ClaimPage() {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 bg-[var(--background)]/92 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="text-[var(--muted)] text-sm font-medium p-2 -ml-2"
          >
            &larr; Cafepedia
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-12">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-6 leading-tight">
          Claim Your Cafe
        </h1>

        <div className="mt-6 space-y-6 text-[15px] leading-relaxed text-[var(--muted)]">
          <p>
            If you own or manage a cafe listed on Cafepedia, you can claim your
            listing to take control of how your business appears to thousands of
            cafe-goers searching every month.
          </p>

          <h2 className="text-lg font-bold text-[var(--foreground)] pt-2">
            What you get when you claim
          </h2>

          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-[var(--foreground)] font-bold flex-shrink-0">Update info</span>
              <span>
                Correct your hours, address, phone number, price range, and
                description so customers always see accurate details.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--foreground)] font-bold flex-shrink-0">Add photos</span>
              <span>
                Upload your best photos — interior, food, drinks, ambience —
                to showcase what makes your cafe special.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--foreground)] font-bold flex-shrink-0">Tags</span>
              <span>
                Make sure your cafe has the right tags (work-friendly,
                pet-friendly, outdoor, live music, etc.) so the right customers
                find you.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--foreground)] font-bold flex-shrink-0">Visibility</span>
              <span>
                Claimed cafes get a verified badge, signaling trust and
                accuracy to users browsing Cafepedia.
              </span>
            </li>
          </ul>

          <h2 className="text-lg font-bold text-[var(--foreground)] pt-2">
            How to claim your listing
          </h2>

          <div className="rounded-xl border border-[var(--border)] p-5 space-y-3">
            <p>
              Send an email to{" "}
              <a
                href="mailto:hello@cafepedia.id"
                className="text-[var(--foreground)] font-bold hover:underline"
              >
                hello@cafepedia.id
              </a>{" "}
              with:
            </p>
            <ol className="list-decimal list-inside space-y-1.5">
              <li>
                <strong className="text-[var(--foreground)]">Your cafe name</strong>{" "}
                as it appears on Cafepedia
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Proof of ownership</strong>{" "}
                — a photo from inside the cafe, your business card, Google
                Business profile screenshot, or Instagram DM from the
                cafe&apos;s official account
              </li>
              <li>
                <strong className="text-[var(--foreground)]">What you want to update</strong>{" "}
                — hours, description, photos, tags, or anything else
              </li>
            </ol>
            <p className="text-sm">
              We verify and process claims within 48 hours.
            </p>
          </div>

          <h2 className="text-lg font-bold text-[var(--foreground)] pt-2">
            Coming soon for cafe owners
          </h2>

          <p>
            We&apos;re building tools specifically for cafe owners. Here&apos;s
            what&apos;s on the roadmap:
          </p>

          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-[var(--foreground)] font-bold flex-shrink-0">Analytics</span>
              <span>
                See how many people view and click on your cafe listing —
                understand your reach on Cafepedia.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--foreground)] font-bold flex-shrink-0">Dashboard</span>
              <span>
                A self-service owner dashboard to update your info, photos,
                and promotions anytime — no email needed.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--foreground)] font-bold flex-shrink-0">Promotions</span>
              <span>
                Highlight special offers, events, or new menu items directly on
                your Cafepedia listing.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--foreground)] font-bold flex-shrink-0">Reviews</span>
              <span>
                Respond to customer reviews and build your reputation within
                the Cafepedia community.
              </span>
            </li>
          </ul>

          <p>
            Claiming your cafe is free and always will be. Premium features
            (analytics, promotions, priority placement) will be available as
            optional paid upgrades in the future.
          </p>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="text-[14px] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            &larr; Back to Cafepedia
          </Link>
        </div>
      </main>
    </div>
  );
}
