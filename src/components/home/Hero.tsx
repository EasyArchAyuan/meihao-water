import { ButtonLink } from "@/components/ui/ButtonLink";
import { Figure } from "@/components/ui/Figure";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { primaryPhone, company } from "@/data/company";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-[var(--bg)]"
    >
      {/* 上半：标题区 */}
      <div className="container-site pt-28 pb-12 sm:pt-40 sm:pb-16 md:pt-52 md:pb-24">
        <Reveal className="flex flex-col items-center gap-6 text-center sm:gap-8">
          <RevealItem>
            <span className="eyebrow">{company.city} · 本地饮水服务</span>
          </RevealItem>

          <RevealItem
            as="h1"
            id="hero-title"
            className="display-hero text-[var(--ink)]"
          >
            好水，
            <br />
            在身边。
          </RevealItem>

          <RevealItem>
            {/*
              副文案承担「品牌坐标」职能：首屏第一句就给出只有美好水业才有的事实
              （起始年份 / 分店 / 库房），避免沦为「某本地水品牌」这类可套用描述。
            */}
            <p className="body-lg max-w-xl text-[var(--ink-soft)]">
              {company.yearsPhrase}在廊坊送水。四家分店、5000 余平米库房，
              家庭和公司的水，一直是我们送。
            </p>
          </RevealItem>

          <RevealItem as="div" className="w-full">
            <div className="mt-2 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
              <ButtonLink href={primaryPhone.tel} size="lg" fullWidthMobile>
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

      {/*
        下半：大图。移动端 4/5 竖构图（仅露出上半部分，诱导下滑）；≥640px 16/9 近满幅。
      */}
      <div className="container-wide pb-0">
        <Figure id="hero-city-water" ratio="4/5" ratioSm="16/9" priority />
      </div>
    </section>
  );
}
