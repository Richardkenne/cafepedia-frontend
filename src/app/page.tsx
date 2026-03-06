import HomeClient from "./HomeClient";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Cafepedia",
  "url": "https://cafepedia.id",
  "description": "Temukan cafe terbaik di Bandung berdasarkan suasana, lokasi & harga",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://cafepedia.id/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}
