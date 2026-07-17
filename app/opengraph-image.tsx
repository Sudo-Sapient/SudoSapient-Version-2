import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Sudo Sapient — production AI systems, shipped in weeks";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#1E40AF",
        color: "white",
        padding: "70px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "space-between", fontSize: 24, letterSpacing: 4 }}
      >
        <span>SUDO SAPIENT</span>
        <span style={{ color: "#FBBF24" }}>AI STUDIO</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 82,
            lineHeight: 0.95,
            fontWeight: 700,
            maxWidth: 980,
          }}
        >
          Production AI systems, shipped in weeks.
        </div>
        <div style={{ marginTop: 34, fontSize: 27, color: "rgba(255,255,255,.75)" }}>
          AI products · automation · media systems
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "2px solid rgba(255,255,255,.25)",
          paddingTop: 22,
          fontSize: 20,
        }}
      >
        <span>sudosapient.dev</span>
        <span>6–10 week focused builds</span>
      </div>
    </div>,
    size
  );
}
