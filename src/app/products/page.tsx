import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { products } from "@/data/products";
import { agencyBrands, brandsIntro } from "@/data/brands";
import { isTodo } from "@/data/company";
import { Hairline } from "@/components/ui/Hairline";

export const metadata: Metadata = buildMetadata({
  title: "产品与服务",
  description:
    "美好水业为廊坊家庭、企业与商务场景提供桶装水、一次性桶装水、瓶装水及饮水配送服务，并代理多家知名品牌的桶装与瓶装水。",
  path: "/products",
});

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="bg-[var(--bg)] pt-16 sm:pt-[72px]">
        {/* Hero */}
        <section className="container-site section-y-sm">
          <Reveal className="max-w-3xl">
            <RevealItem>
              <span className="eyebrow">产品与服务</span>
            </RevealItem>
            <RevealItem
              as="h1"
              className="display-hero mt-6 text-[var(--ink)]"
            >
              该到的水，
              <br />
              总到。
            </RevealItem>
            <RevealItem>
              <p className="body-lg mt-8 max-w-2xl text-[var(--ink-soft)]">
                自营五类产品，覆盖家庭、企业、商务的不同场景。同时为廊坊家庭提供多家品牌的桶装与瓶装水。
              </p>
            </RevealItem>
          </Reveal>
        </section>

        {/* 自营 5 类（极简） */}
        <section className="container-wide pb-16 sm:pb-24">
          <Reveal>
            <ul className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
              {products.map((p, i) => (
                <RevealItem as="li" key={p.id}>
                  <article className="flex h-full flex-col gap-4 border-t border-[var(--hairline-strong)] pt-5 sm:gap-5 sm:pt-6">
                    <div className="flex items-baseline justify-between">
                      <span className="tabular-nums text-[12px] tracking-[0.24em] text-[var(--ink-muted)]">
                        0{i + 1}
                      </span>
                      {!isTodo(p.volume) ? (
                        <span className="text-[12px] tabular-nums text-[var(--ink-muted)]">
                          {p.volume}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="text-[22px] font-medium tracking-tight text-[var(--ink)] sm:text-[24px]">
                      {p.name}
                    </h3>
                    <p className="text-[15px] leading-relaxed text-[var(--ink-soft)]">
                      {p.longDesc}
                    </p>
                    <div className="mt-auto pt-3 text-[13px] text-[var(--ink-muted)] sm:pt-4">
                      {isTodo(p.volume) ? "规格 · 暂未公示" : null}
                    </div>
                  </article>
                </RevealItem>
              ))}
            </ul>
          </Reveal>
        </section>

        {/* 代理品牌 strip */}
        <section className="bg-[var(--bg-alt)]">
          <div className="container-wide section-y">
            <Reveal className="flex flex-col gap-10">
              <RevealItem>
                <span className="eyebrow">我们同时为廊坊家庭提供</span>
              </RevealItem>
              <RevealItem>
                <h2 className="display-section text-[var(--ink)]">
                  多个品牌的桶装与瓶装水。
                </h2>
              </RevealItem>
              <RevealItem>
                <p className="body-lg max-w-2xl text-[var(--ink-soft)]">
                  {brandsIntro}（仅展示品牌名称，不使用品牌 logo 图，规避版权）
                </p>
              </RevealItem>
              <RevealItem>
                <Hairline />
              </RevealItem>
              <RevealItem>
                <ul className="flex flex-wrap items-baseline gap-x-6 gap-y-4 sm:gap-x-10">
                  {agencyBrands.map((b) => (
                    <li
                      key={b.name}
                      className="text-[18px] tracking-tight text-[var(--ink)] sm:text-[20px]"
                    >
                      {b.name}
                    </li>
                  ))}
                </ul>
              </RevealItem>
              <RevealItem>
                <Link
                  href="/brands"
                  className="mt-2 inline-flex min-h-11 items-center gap-2 text-[14px] font-medium text-[var(--brand)] underline-offset-4 transition-colors hover:underline"
                >
                  查看全部品牌
                  <span aria-hidden>→</span>
                </Link>
              </RevealItem>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
