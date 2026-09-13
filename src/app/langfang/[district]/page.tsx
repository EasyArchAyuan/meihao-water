import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { districts, getDistrict } from "@/data/districts";
import { company, primaryPhone } from "@/data/company";
import { deliveryAreas, deliveryLeadTime, faqItems } from "@/data/faq";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { TelLink } from "@/components/ui/TelLink";

type Params = { district: string };

export function generateStaticParams(): Params[] {
  return districts.map((d) => ({ district: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { district } = await params;
  const d = getDistrict(district);
  if (!d) return { title: "页面不存在" };
  return buildMetadata({
    title: `${d.name}桶装水配送`,
    description: `${d.name}桶装水配送与送水上门：${company.brandName}（${company.legalName}）自 ${company.establishedYear} 年起服务廊坊，${d.focus}。覆盖${deliveryAreas}，承接${d.scenes.join("、")}用水。`,
    path: `/langfang/${d.slug}/`,
    keywords: [
      `${d.name}桶装水`,
      `${d.name}送水`,
      "廊坊桶装水",
      "廊坊送水上门",
      "公司订水",
    ],
  });
}

/** 该页引用的 FAQ（按 id 挑选，避免 11 个页面雷同） */
const FAQ_REF: Record<string, string[]> = {
  guangyang: ["authentic", "lead-time", "payment"],
  anci: ["lead-time", "deposit", "scenes"],
  kaifaqu: ["qualification", "payment", "scenes"],
  sanhe: ["lead-time", "deposit", "scenes"],
  xianghe: ["scenes", "payment", "lead-time"],
  bazhou: ["qualification", "payment", "sanitation"],
  guan: ["water-quality", "authentic", "lead-time"],
  yongqing: ["lead-time", "deposit", "scenes"],
  wenan: ["payment", "scenes", "lead-time"],
  dacheng: ["lead-time", "payment", "scenes"],
  dachang: ["lead-time", "deposit", "scenes"],
};

export default async function DistrictPage({ params }: { params: Promise<Params> }) {
  const { district } = await params;
  const d = getDistrict(district);
  if (!d) notFound();

  const faqIds = FAQ_REF[d.slug] ?? ["lead-time"];
  const faqs = faqIds
    .map((id) => faqItems.find((f) => f.id === id))
    .filter((f): f is (typeof faqItems)[number] => Boolean(f));

  const facts = [
    { label: "服务区域", value: `廊坊市${d.name}` },
    { label: "经营主体", value: company.legalName },
    { label: "服务侧重", value: d.focus },
    { label: "覆盖口径", value: deliveryAreas },
    { label: "送达时效", value: deliveryLeadTime },
    { label: "经营品类", value: company.delivery.categories.join(" / ") },
  ];

  const others = districts.filter((x) => x.slug !== d.slug);

  return (
    <>
      <Navbar />
      <main id="main" className="bg-[var(--bg)] pt-16 sm:pt-[72px]">
        {/* Hero */}
        <section className="container-site section-y-sm">
          <Reveal className="max-w-3xl">
            <RevealItem as="span" className="eyebrow">
              廊坊 · {d.name}
            </RevealItem>
            <RevealItem as="h1" className="display-hero mt-6 text-[var(--ink)]">
              {d.name}桶装水配送
            </RevealItem>
            <RevealItem>
              <p className="body-lg mt-8 text-[var(--ink-soft)]">{d.intro}</p>
            </RevealItem>
            <RevealItem className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-10">
              <TelLink phone={primaryPhone} prominent />
              <Link
                href="/products/"
                className="inline-flex min-h-11 items-center gap-2 text-[16px] font-medium text-[var(--ink)] underline-offset-4 transition-colors hover:underline"
              >
                查看产品与服务
                <span aria-hidden>→</span>
              </Link>
            </RevealItem>
          </Reveal>
        </section>

        {/* 实体锚点 */}
        <section className="container-wide pb-16 sm:pb-24">
          <Reveal>
            <RevealItem>
              <dl className="grid gap-x-10 border-t border-[var(--hairline-strong)] sm:grid-cols-2">
                {facts.map((f) => (
                  <div
                    key={f.label}
                    className="flex flex-col gap-1 border-b border-[var(--hairline)] py-5 sm:flex-row sm:items-baseline sm:gap-6 sm:py-6"
                  >
                    <dt className="w-28 shrink-0 text-[11px] uppercase tracking-[0.24em] text-[var(--ink-muted)]">
                      {f.label}
                    </dt>
                    <dd className="text-[15px] leading-relaxed text-[var(--ink)]">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </RevealItem>
          </Reveal>
        </section>

        {/* 本地服务要点（差异化内容） */}
        <section className="bg-[var(--bg-alt)]">
          <div className="container-wide section-y">
            <Reveal className="grid gap-10 lg:grid-cols-12 lg:gap-20">
              <RevealItem className="lg:col-span-4">
                <h2 className="display-sub text-[var(--ink)]">在{d.name}，怎么送</h2>
              </RevealItem>
              <RevealItem className="lg:col-span-8">
                <ul className="flex flex-col gap-6">
                  {d.anchors.map((a) => (
                    <li
                      key={a}
                      className="flex gap-4 border-t border-[var(--hairline-strong)] pt-5 text-[15px] leading-relaxed text-[var(--ink-soft)]"
                    >
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]" />
                      {a}
                    </li>
                  ))}
                </ul>
                <p className="mt-8 text-[15px] leading-relaxed text-[var(--ink-soft)]">
                  主要服务场景：{d.scenes.join(" / ")}。
                </p>
              </RevealItem>
            </Reveal>
          </div>
        </section>

        {/* 本地化 FAQ 片段 */}
        <section className="container-wide section-y">
          <Reveal className="flex flex-col gap-8">
            <RevealItem>
              <h2 className="display-sub text-[var(--ink)]">订水前常问的</h2>
            </RevealItem>
            <RevealItem>
              <dl className="flex flex-col">
                {faqs.map((f) => (
                  <div
                    key={f.id}
                    className="flex flex-col gap-3 border-b border-[var(--hairline)] py-8 first:pt-0 last:border-b-0"
                  >
                    <dt className="text-[17px] font-medium leading-snug tracking-tight text-[var(--ink)]">
                      {f.question}
                    </dt>
                    {f.answer.map((p, i) => (
                      <dd key={i} className="text-[15px] leading-relaxed text-[var(--ink-soft)]">
                        {p}
                      </dd>
                    ))}
                  </div>
                ))}
              </dl>
            </RevealItem>
            <RevealItem>
              <Link
                href="/faq/"
                className="inline-flex min-h-11 items-center gap-2 text-[16px] font-medium text-[var(--ink)] underline-offset-4 transition-colors hover:underline"
              >
                查看全部常见问题
                <span aria-hidden>→</span>
              </Link>
            </RevealItem>
          </Reveal>
        </section>

        {/* 其他区县（内链矩阵） */}
        <section className="bg-[var(--bg-alt)]">
          <div className="container-wide section-y">
            <Reveal className="flex flex-col gap-8">
              <RevealItem>
                <h2 className="display-sub text-[var(--ink)]">其他区域</h2>
              </RevealItem>
              <RevealItem>
                <ul className="flex flex-wrap gap-x-6 gap-y-3">
                  {others.map((o) => (
                    <li key={o.slug}>
                      <Link
                        href={`/langfang/${o.slug}/`}
                        className="inline-flex min-h-11 items-center text-[15px] text-[var(--ink-soft)] underline-offset-4 transition-colors hover:text-[var(--ink)] hover:underline"
                      >
                        {o.name}桶装水配送
                      </Link>
                    </li>
                  ))}
                </ul>
              </RevealItem>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbJsonLd([
            { name: "首页", path: "/" },
            { name: "廊坊桶装水配送", path: "/langfang/" },
            { name: `${d.name}桶装水配送`, path: `/langfang/${d.slug}/` },
          ]),
        }}
      />
    </>
  );
}
