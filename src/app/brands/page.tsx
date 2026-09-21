import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { agencyBrandsByCategory } from "@/data/brands";
import { primaryPhone } from "@/data/company";
import { Hairline } from "@/components/ui/Hairline";
import { BrandAuthorizations } from "@/components/about/BrandAuthorizations";

export const metadata: Metadata = buildMetadata({
  title: "代理品牌",
  description:
    "美好水业为廊坊家庭提供多个品牌的桶装水与瓶装水。包含农夫山泉、怡宝、娃哈哈、恒大冰泉、昆仑山、汇源、水立方、冰露等。",
  path: "/brands",
});

// 按品类分组（口径来自 src/data/brands.ts，与首页共用）
const groups = agencyBrandsByCategory;

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
            <RevealItem
              as="h1"
              className="display-hero mt-6 text-[var(--ink)]"
            >
              哪个牌子，
              <br />
              都能送。
            </RevealItem>
            <RevealItem>
              <p className="body-lg mt-8 max-w-2xl text-[var(--ink-soft)]">
                这些品牌的桶装水与瓶装水，廊坊本地都能送到。
              </p>
            </RevealItem>
          </Reveal>
        </section>

        {/* 分组列表 */}
        <section className="container-wide pb-16 sm:pb-24">
          <Reveal>
            <div className="flex flex-col gap-10 sm:gap-14">
              {groups.map(({ category, names }, gi) => (
                <RevealItem as="div" key={category}>
                  <div className="flex flex-col gap-5 sm:gap-6">
                    <div className="flex items-baseline justify-between">
                      <h2 className="text-[18px] font-medium tracking-tight text-[var(--ink)] sm:text-[20px]">
                        {category}
                      </h2>
                      <span className="tabular-nums text-[12px] tracking-[0.24em] text-[var(--ink-muted)]">
                        0{gi + 1}
                      </span>
                    </div>
                    <Hairline />
                    <ul className="flex flex-wrap items-baseline gap-x-6 gap-y-3 sm:gap-x-12 sm:gap-y-4">
                      {names.map((n) => (
                        <li
                          key={n}
                          className="text-[clamp(18px,2.2vw,28px)] tracking-tight text-[var(--ink)]"
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

        <BrandAuthorizations
          eyebrow="授权证明"
          title={`代理，
有授权书才算数。`}
          subtitle="这些品牌在廊坊的销售/配送授权，美好水业持有品牌方或区域总代理出具的书面证明。"
        />

        {/* CTA */}
        <section className="bg-[var(--bg-alt)]">
          <div className="container-site section-y text-center">
            <Reveal className="flex flex-col items-center gap-8">
              <RevealItem>
                <span className="eyebrow">需要帮助？</span>
              </RevealItem>
              <RevealItem
                as="h2"
                className="display-section text-[var(--ink)]"
              >
                不知道选哪个？
                <br />
                打个电话问我们。
              </RevealItem>
              <RevealItem>
                <a
                  href={primaryPhone.tel}
                  className="inline-flex min-h-11 items-center text-[clamp(30px,4.4vw,44px)] font-medium tabular-nums text-[var(--ink)] transition-colors hover:text-[var(--brand)]"
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
