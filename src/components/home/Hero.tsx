import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { primaryPhone, company } from "@/data/company";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-[var(--bg)]"
    >
      {/* 上半：标题区 */}
      <div className="container-site pt-36 pb-16 sm:pt-44 sm:pb-20 md:pt-52 md:pb-24">
        <Reveal className="flex flex-col items-center gap-8 text-center">
          <RevealItem>
            <span className="eyebrow">{company.city} · 本地饮水服务</span>
          </RevealItem>

          <RevealItem as="h1">
            <span
              id="hero-title"
              className="display-hero block text-[var(--ink)]"
            >
              好水，
              <br />
              在身边。
            </span>
          </RevealItem>

          <RevealItem>
            <p className="body-lg max-w-xl text-[var(--ink-soft)]">
              廊坊本地饮水服务品牌。扎根廊坊二十余年，从一桶水开始，为家庭、企业与城市生活提供持续、可靠的饮水服务。
            </p>
          </RevealItem>

          <RevealItem>
            <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
              <ButtonLink
                href={primaryPhone.tel}
                size="lg"
                fullWidthMobile
              >
                立即订水
              </ButtonLink>
              <ButtonLink
                href="/about"
                variant="secondary"
                size="lg"
                fullWidthMobile
              >
                了解美好水业
              </ButtonLink>
            </div>
          </RevealItem>
        </Reveal>
      </div>

      {/* 下半：大图占位（近满幅） */}
      <div className="container-wide pb-0">
        <div className="relative w-full overflow-hidden">
          <div
            className="relative w-full"
            style={{ aspectRatio: "16 / 9" }}
            data-placeholder="TODO: REPLACE_WITH_REAL_IMAGE"
          >
            {/* 占位：水的安静感 / 暖光 */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, var(--bg-alt) 0%, var(--accent-tint) 100%)",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-[var(--ink-muted)]">
                <p className="text-[11px] uppercase tracking-[0.24em]">
                  figure-placeholder
                </p>
                <p className="mt-2 text-[14px] text-[var(--ink-soft)]">
                  图片占位 · 待替换真实摄影
                </p>
                <p className="mt-1 text-[12px]">
                  16 / 9 · hero-city-water
                </p>
                <p className="mt-3 max-w-md text-[12px] text-[var(--ink-muted)]">
                  Hero 大图：水的通透感 + 城市生活感，安静干净
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
