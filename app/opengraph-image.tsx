import { ImageResponse } from "next/og";

export const alt = "Talent AI — nine friendly AI tools in one workspace";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Share preview for links posted on LinkedIn, X, WhatsApp, Slack, etc. */
export default function OpengraphImage() {
  const square = (background: string, radius = 10) => ({ width: 30, height: 30, borderRadius: radius, background });
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px", background: "#ffffff", color: "#111111", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", flexWrap: "wrap", width: 68, gap: 8 }}>
            <div style={square("#7c5cfa")} />
            <div style={square("#ff6b1a")} />
            <div style={square("#111111")} />
            <div style={square("#c4b5fd", 999)} />
          </div>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 800 }}>Talent AI</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 800, letterSpacing: -3, lineHeight: 1.05 }}>Get more done with</div>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 800, letterSpacing: -3, lineHeight: 1.05, color: "#7c5cfa" }}>nine friendly AI tools</div>
          <div style={{ display: "flex", fontSize: 32, color: "#5f5f64" }}>Chat, summarise, translate, fix grammar and write code.</div>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {["Free to start", "No card needed", "$20/month for unlimited"].map((t) => (
            <div key={t} style={{ display: "flex", padding: "12px 24px", borderRadius: 999, background: t === "Free to start" ? "#ff6b1a" : "#f4f4f5", color: t === "Free to start" ? "#ffffff" : "#111111", fontSize: 24, fontWeight: 600 }}>
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
