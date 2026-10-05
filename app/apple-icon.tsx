import { ImageResponse } from "next/og";

// iOS home-screen icon: the same four-square mark as app/icon.svg.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const square = (background: string, radius = 14) => ({ width: 46, height: 46, borderRadius: radius, background });
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#111111" }}>
        <div style={{ display: "flex", flexWrap: "wrap", width: 104, gap: 12 }}>
          <div style={square("#7c5cfa")} />
          <div style={square("#ff6b1a")} />
          <div style={square("#ffffff")} />
          <div style={square("#c4b5fd", 999)} />
        </div>
      </div>
    ),
    size,
  );
}
