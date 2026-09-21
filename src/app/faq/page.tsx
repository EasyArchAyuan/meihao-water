import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { faqPageJsonLd } from "@/lib/jsonld";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { TelLink } from "@/components/ui/TelLink";
import { company, primaryPhone } from "@/data/company";
import { faqGroups, faqItems } from "@/data/faq";

export const metadata: Metadata = buildMetadata({
  title: "常见问题",
  description:
    "美好水业常见问题：桶装水是否为正品、水桶如何清洗消毒、空桶与押金怎么处理、配送时效与覆盖区域、公司订水与开票。",
  path: "/faq",
  keywords: [
    "廊坊桶装水",
    "廊坊送水",
    "桶装水退桶押金",
    "水桶消毒",
    "美好水业",
    "公司订水",
  ],
});

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="bg-[var(--bg)] pt-16 sm:pt-[72px]">
        {/* Hero */}
        <section className="container-site section-y-sm">
          <Reveal className="max-w-3xl">
            <RevealItem as="span" className="eyebrow">
              常见问题
            </RevealItem>
            <RevealItem as="h1" className="display-hero mt-6 text-[var(--ink)]">
              把话说在前面。
            </RevealItem>
            <RevealItem>
              <p className="body-lg mt-8 max-w-2xl text-[var(--ink-soft)]">
                订水之前最常问的几件事，我们一次写清楚：是不是正品、水桶干不干净、押金怎么退、多久送到。
              </p>
            </RevealItem>
          </Reveal>
        </section>

        {/* 主体：分组 Q&A */}
        <div className="container-wide pb-16 sm:pb-24">
          {faqGroups.map((group) => {
            const items = faqItems.filter((i) => i.group === group);
            if (items.length === 0) return null;
            return (
              <section
                key={group}
                aria-labelledby={`faq-${group}`}
                className="border-t border-[var(--hairline-strong)] pt-10 first:border-t-0 first:pt-0 sm:pt-14"
              >
                <Reveal className="grid gap-10 lg:grid-cols-12 lg:gap-20">
                  <RevealItem className="lg:col-span-4">
                    <h2
                      id={`faq-${group}`}
                      className="display-sub text-[var(--ink)]"
                    >
                      {group}
                    </h2>
                  </RevealItem>
                  <RevealItem className="lg:col-span-8">
                    <dl className="flex flex-col">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          id={item.id}
                          className="flex flex-col gap-3 border-b border-[var(--hairline)] py-8 first:pt-0 last:border-b-0 sm:py-10"
                        >
                          <dt className="text-[18px] font-medium leading-snug tracking-tight text-[var(--ink)] sm:text-[20px]">
                            {item.question}
                          </dt>
                          {item.answer.map((para, i) => (
                            <dd
                              key={i}
                              className="text-[15px] leading-relaxed text-[var(--ink-soft)]"
                            >
                              {para}
                            </dd>
                          ))}
                        </div>
                      ))}
                    </dl>
                  </RevealItem>
                </Reveal>
              </section>
            );
          })}
        </div>

        {/* 实体说明 + CTA */}
        <section className="bg-[var(--bg-alt)]">
          <div className="container-wide section-y">
            <Reveal className="grid gap-10 lg:grid-cols-12 lg:gap-20">
              <RevealItem className="lg:col-span-7 flex flex-col gap-6">
                <span className="eyebrow">关于主体</span>
                <h2 className="display-sub text-[var(--ink)]">
                  一个廊坊的牌子，
                  <br />
                  做了{company.yearsCopy}。
                </h2>
                <p className="body-lg text-[var(--ink-soft)]">
                  {company.disambiguation}
                </p>
                <p className="text-[15px] leading-relaxed text-[var(--ink-soft)]">
                  还有没写到的，直接打电话问。{company.brandName} ·{" "}
                  {company.legalName} · 地址 {company.address}
                </p>
                <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:gap-8">
                  <TelLink phone={primaryPhone} />
                  <Link
                    href="/contact"
                    className="inline-flex min-h-11 items-center gap-2 text-[16px] font-medium text-[var(--ink)] underline-offset-4 transition-colors hover:underline"
                  >
                    查看联系方式
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </RevealItem>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />

      {/* FAQPage 结构化数据：与页面正文同源（src/data/faq.ts），避免两处不一致 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqPageJsonLd() }}
      />
    </>
  );
}
