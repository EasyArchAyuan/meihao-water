import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { listArticles } from "@/lib/content";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { TelLink } from "@/components/ui/TelLink";
import { primaryPhone, company } from "@/data/company";

export const metadata: Metadata = buildMetadata({
  title: "行业资讯",
  description:
    "美好水业行业资讯：廊坊桶装水怎么选、桶装水保存与饮水机清洗、公司订水避坑、正品识别与退桶押金。廊坊本地近三十年送水经验分享。",
  path: "/news",
  keywords: ["廊坊桶装水", "廊坊送水", "桶装水怎么选", "公司订水", "美好水业"],
});

export default async function NewsPage() {
  const articles = await listArticles();

  return (
    <>
      <Navbar />
      <main id="main" className="bg-[var(--bg)] pt-16 sm:pt-[72px]">
        {/* Hero */}
        <section className="container-site section-y-sm">
          <Reveal className="max-w-3xl">
            <RevealItem as="span" className="eyebrow">
              行业资讯
            </RevealItem>
            <RevealItem as="h1" className="display-hero mt-6 text-[var(--ink)]">
              选水、订水、
              <br />
              那些该先问的。
            </RevealItem>
            <RevealItem>
              <p className="body-lg mt-8 max-w-2xl text-[var(--ink-soft)]">
                廊坊本地{company.yearsCopy}的送水经验，挑出来写成短文。不推销，只把判断标准说清楚。
              </p>
            </RevealItem>
          </Reveal>
        </section>

        {/* 列表 */}
        <section className="container-wide pb-16 sm:pb-24">
          {articles.length === 0 ? (
            <p className="text-[15px] text-[var(--ink-muted)]">暂无文章。</p>
          ) : (
            <Reveal>
              <ul className="flex flex-col border-t border-[var(--hairline-strong)]">
                {articles.map((a) => (
                  <RevealItem as="li" key={a.slug}>
                    <article className="border-b border-[var(--hairline)] py-8 sm:py-10">
                      <Link
                        href={`/news/${a.slug}/`}
                        className="group flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-10"
                      >
                        <time
                          dateTime={a.date}
                          className="shrink-0 tabular-nums text-[12px] tracking-[0.2em] text-[var(--ink-muted)] sm:w-28"
                        >
                          {a.date}
                        </time>
                        <div className="flex flex-col gap-2.5">
                          <h2 className="text-[20px] font-medium leading-snug tracking-tight text-[var(--ink)] transition-colors group-hover:text-[var(--brand)] sm:text-[24px]">
                            {a.title}
                          </h2>
                          {a.excerpt ? (
                            <p className="max-w-2xl text-[15px] leading-relaxed text-[var(--ink-soft)]">
                              {a.excerpt}
                            </p>
                          ) : null}
                          {a.tags.length > 0 ? (
                            <p className="text-[12px] tracking-[0.16em] text-[var(--ink-muted)]">
                              {a.tags.join(" · ")}
                            </p>
                          ) : null}
                        </div>
                      </Link>
                    </article>
                  </RevealItem>
                ))}
              </ul>
            </Reveal>
          )}
        </section>

        {/* CTA */}
        <section className="bg-[var(--bg-alt)]">
          <div className="container-wide section-y">
            <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <RevealItem className="flex flex-col gap-4">
                <span className="eyebrow">直接问更快</span>
                <h2 className="display-sub text-[var(--ink)]">订水，打个电话。</h2>
              </RevealItem>
              <RevealItem>
                <TelLink phone={primaryPhone} prominent />
              </RevealItem>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
