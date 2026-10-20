import { ImageResponse } from "next/og";

export const alt = "SOU Soluções Industriais — Tudo o que sua indústria precisa. Em um só lugar.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(120deg, #061636 0%, #0d2d70 60%, #1645b0 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 6, color: "#85a5f4", fontWeight: 700 }}>
          SOU SOLUÇÕES INDUSTRIAIS
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 72, fontWeight: 800, lineHeight: 1.05 }}>
          <span>Tudo o que sua indústria precisa.</span>
          <span style={{ color: "#85a5f4" }}>Em um só lugar.</span>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "rgba(255,255,255,0.75)" }}>
          Materiais, peças, componentes e equipamentos industriais · Solicite sua cotação
        </div>
      </div>
    ),
    size,
  );
}
