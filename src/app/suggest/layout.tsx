import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sarankan Cafe — Cafepedia",
  description: "Sarankan cafe favoritmu yang belum ada di Cafepedia. Bantu kami melengkapi database cafe terbaik di Bandung.",
  alternates: { canonical: "https://cafepedia.id/suggest" },
  openGraph: { title: "Sarankan Cafe — Cafepedia" },
};

export default function SuggestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
