import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CA Saarthi — Free CA Foundation Exam Preparation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #6366f1 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
              fontWeight: 800,
              color: "#2563eb",
            }}
          >
            CA
          </div>
          <div
            style={{
              fontSize: "48px",
              fontWeight: 800,
              color: "white",
            }}
          >
            CA Saarthi
          </div>
        </div>
        <div
          style={{
            fontSize: "32px",
            fontWeight: 600,
            color: "white",
            textAlign: "center",
            lineHeight: 1.4,
            maxWidth: "900px",
          }}
        >
          Free CA Foundation Exam Preparation
        </div>
        <div
          style={{
            display: "flex",
            gap: "40px",
            marginTop: "40px",
            color: "rgba(255,255,255,0.9)",
            fontSize: "22px",
          }}
        >
          <span>2,500+ Questions</span>
          <span>•</span>
          <span>40 Mock Tests</span>
          <span>•</span>
          <span>AI Tutor</span>
          <span>•</span>
          <span>100% Free</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
