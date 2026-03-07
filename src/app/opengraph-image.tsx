import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Cafepedia — Discover great places in Bandung";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0C4A44 0%, #115E59 50%, #0A3D38 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "#14B8A6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              color: "white",
            }}
          >
            📍
          </div>
          <span
            style={{
              fontSize: "64px",
              fontWeight: 800,
              color: "#F7F3EE",
              letterSpacing: "-2px",
            }}
          >
            Cafepedia
          </span>
        </div>
        <span
          style={{
            fontSize: "28px",
            color: "#B8A99A",
            marginBottom: "32px",
          }}
        >
          Discover great places.
        </span>
        <div
          style={{
            display: "flex",
            gap: "24px",
            fontSize: "18px",
            color: "#8B7D6B",
          }}
        >
          <span>900+ Places</span>
          <span>·</span>
          <span>AI Decision Engine</span>
          <span>·</span>
          <span>Bandung & Jakarta</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
