import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name}｜廊坊本地饮水服务品牌`;
export const dynamic = "force-static";
export const runtime = "nodejs";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#F7F8F5",
          padding: "80px",
          fontFamily: '"PingFang SC", "Noto Sans SC", sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#0A1A2A",
            fontSize: 32,
            fontWeight: 500,
          }}
        >
          {/* 一个抽象"水"标记（圆角矩形 + 内部波纹） */}
          <div
            style={{
              display: "flex",
              width: 56,
              height: 56,
              borderRadius: 14,
              backgroundColor: "rgba(10,26,42,0.08)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32">
              <path
                d="M16 6 L16 26 M9 12 Q14 9 16 12 T23 12 M9 18 Q14 15 16 18 T23 18 M9 24 Q14 21 16 24 T23 24"
                stroke="#0A1A2A"
                strokeWidth="2.4"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
          <span>{site.name}</span>
        </div>

        <div
          style={{
            marginTop: 80,
            display: "flex",
            flexDirection: "column",
            color: "#0A1A2A",
            fontSize: 120,
            fontWeight: 500,
            lineHeight: 1.05,
            letterSpacing: -3,
          }}
        >
          <span>好水，</span>
          <span>在身边。</span>
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            color: "#4A545A",
            fontSize: 28,
            fontWeight: 400,
          }}
        >
          {site.shortDescription}
        </div>
      </div>
    ),
    { ...size },
  );
}
