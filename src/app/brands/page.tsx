import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { agencyBrands, brandsIntro } from "@/data/brands";
import { primaryPhone } from "@/data/company";
import { Hairline } from "@/components/ui/Hairline";

export const metadata: Metadata = buildMetadata({
  title: "代理品牌",
  description:
    "美好水业为廊坊家庭提供多个品牌的桶装水与瓶装水。包含农夫山泉、怡宝、娃哈哈、恒大冰泉、昆仑山、汇源、水立方、冰露等。",
  path: "/brands",
});

// 按品类分组
const groups: Record<string, string[]> = {};
for (const b of agencyBrands) {
  for (const c of b.category) {
    if (!groups[c]) groups[c] = [];
    groups[c].push(b.name);
  }
}

export default function BrandsPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="bg-[var(--bg)] pt-16 sm:pt-[72px]">
        {/* Hero */}
        <section className="container-site section-y-sm">
          <Reveal className="max-w-3xl">
            <RevealItem>
              <span className="eyebrow">代理品牌</span>
            </RevealItem>
            <RevealItem as="h1">
              <h1 className="display-hero mt-6 text-[var(--ink)]">
                一处下单，
                <br />
                多个选择。
              </h1>
            </RevealItem>
            <RevealItem>
              <p className="body-lg mt-8 max-w-2xl text-[var(--ink-soft)]">
                {brandsIntro}本页仅展示品牌名称，不使用任何品牌商标图，规避版权。
              </p>
            </RevealItem>
          </Reveal>
        </section>

        {/* 分组列表 */}
        <section className="container-wide pb-24">
          <Reveal>
            <div className="flex flex-col gap-16">
              {Object.entries(groups).map(([category, names], gi) => (
                <RevealItem as="div" key={category}>
                  <div className="flex flex-col gap-6">
                    <div className="flex items-baseline justify-between">
                      <h2 className="text-[20px] font-medium tracking-tight text-[var(--ink)]">
                        {category}
                      </h2>
                      <span className="tabular-nums text-[12px] tracking-[0.24em] text-[var(--ink-muted)]">
                        0{gi + 1}
                      </span>
                    </div>
                    <Hairline />
                    <ul className="flex flex-wrap items-baseline gap-x-8 gap-y-4 sm:gap-x-12">
                      {names.map((n) => (
                        <li
                          key={n}
                          className="text-[clamp(20px,2.2vw,28px)] tracking-tight text-[var(--ink)]"
                        >
                          {n}
                        </li>
                      ))}
                    </ul>
                  </div>
                </RevealItem>
              ))}
            </div>
          </Reveal>
        </section>

        {/* CTA */}
        <section className="bg-[var(--bg-alt)]">
          <div className="container-site section-y text-center">
            <Reveal className="flex flex-col items-center gap-8">
              <RevealItem>
                <span className="eyebrow">需要帮助？</span>
              </RevealItem>
              <RevealItem as="h2">
                <h2 className="display-section text-[var(--ink)]">
                  不知道选哪个？
                  <br />
                  打给我们的客服。
                </h2>
              </RevealItem>
              <RevealItem>
                <a
                  href={primaryPhone.tel}
                  className="text-[clamp(28px,4vw,44px)] font-medium tabular-nums text-[var(--ink)] transition-colors hover:text-[var(--brand)]"
                >
                  {primaryPhone.display}
                </a>
              </RevealItem>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
