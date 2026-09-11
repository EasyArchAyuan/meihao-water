import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { company } from "@/data/company";

const keywords = ["廊坊", "家庭", "社区", "企业", "城市生活"];

export function CitySection() {
  return (
    <section
      aria-labelledby="city-title"
      className="relative overflow-hidden bg-[var(--bg-alt)]"
    >
      {/* 抽象城市线条背景层 */}
      <CityLineArt />

      <div className="container-wide section-y relative">
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-7 flex flex-col gap-6 sm:gap-8">
            <RevealItem>
              <span className="eyebrow">{company.city} · 城市服务</span>
            </RevealItem>
            <RevealItem
              as="h2"
              id="city-title"
              className="display-section text-[var(--ink)]"
            >
              我们熟悉这座城。
            </RevealItem>
            <RevealItem>
              <p className="body-lg max-w-xl text-[var(--ink-soft)]">
                二十余年，我们把一桶桶水送进廊坊的家庭、办公室和街巷。
              </p>
            </RevealItem>
            <RevealItem>
              <p className="text-[12px] text-[var(--ink-muted)] sm:text-[13px]">
                * 线条为抽象示意，非行政地图。
              </p>
            </RevealItem>
          </Reveal>

          <Reveal className="lg:col-span-5 flex flex-col gap-5 sm:gap-6">
            <RevealItem>
              <span className="eyebrow">关键词</span>
            </RevealItem>
            <RevealItem>
              <ul className="flex flex-col">
                {keywords.map((k, i) => (
                  <li
                    key={k}
                    className="flex items-baseline gap-4 border-b border-[var(--hairline)] py-3 last:border-b-0"
                  >
                    <span className="tabular-nums text-[10px] tracking-[0.2em] text-[var(--ink-muted)] sm:text-[11px] sm:tracking-[0.24em]">
                      0{i + 1}
                    </span>
                    <span className="text-[18px] font-medium tracking-tight text-[var(--ink)] sm:text-[20px]">
                      {k}
                    </span>
                  </li>
                ))}
              </ul>
            </RevealItem>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function CityLineArt() {
  // 移动端屏窄空间有限，且线条会穿过正文，故仅在 ≥640px 显示。
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden text-[var(--ink)] opacity-[0.07] sm:block"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1600 720"
        preserveAspectRatio="xMidYMid slice"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          className="[&>*]:[vector-effect:non-scaling-stroke]"
        >
          {/* 横线（街道） */}
          <path d="M0 180 Q 400 140 800 200 T 1600 180" />
          <path d="M0 360 Q 500 320 900 380 T 1600 360" />
          <path d="M0 540 Q 400 500 800 560 T 1600 540" />
          {/* 竖线（街区） */}
          <path d="M240 60 Q 260 360 240 660" />
          <path d="M520 80 Q 540 360 520 640" />
          <path d="M800 40 Q 820 360 800 680" />
          <path d="M1080 60 Q 1100 360 1080 660" />
          <path d="M1360 80 Q 1380 360 1360 640" />
          {/* 散点（建筑） */}
          <circle cx="380" cy="280" r="6" />
          <circle cx="660" cy="220" r="4" />
          <circle cx="940" cy="300" r="5" />
          <circle cx="1220" cy="260" r="4" />
          <circle cx="420" cy="500" r="5" />
          <circle cx="700" cy="460" r="4" />
          <circle cx="980" cy="520" r="6" />
          <circle cx="1260" cy="480" r="4" />
        </g>
      </svg>
    </div>
  );
}
