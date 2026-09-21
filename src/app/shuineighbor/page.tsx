import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { shuineighborProductJsonLd } from "@/lib/jsonld";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Figure } from "@/components/ui/Figure";
import { company, isTodo } from "@/data/company";

export const metadata: Metadata = buildMetadata({
  title: "水邻居",
  description:
    "水邻居，美好水业旗下新一代饮水生活品牌。订水更简单，喝水这件小事也更轻松。",
  path: "/shuineighbor",
});

const features = [
  { title: "更轻", desc: "一次性的便捷，不用归还，也不用清洗。" },
  { title: "更简单", desc: "下单、付款、看配送，几步就完。" },
  { title: "更年轻", desc: "清爽的样子，慢一点的节奏。" },
];

export default function ShuineighborPage() {
  const { shuineighbor } = company;
  const domain = shuineighbor.domain;
  const isDomainKnown = !isTodo(domain);

  return (
    <>
      <Navbar />
      <main id="main" className="bg-[var(--accent-tint)] pt-16 sm:pt-[72px]">
        {/* Hero */}
        <section className="container-site section-y-sm">
          <Reveal className="max-w-3xl">
            <RevealItem>
              <span className="eyebrow !text-[var(--accent-text)]">
                旗下品牌
              </span>
            </RevealItem>
            <RevealItem
              as="h1"
              className="display-hero mt-6 text-[var(--accent-text)]"
            >
              {shuineighbor.name}
            </RevealItem>
            <RevealItem>
              <p className="display-sub mt-8 text-[var(--ink)]">
                {shuineighbor.tagline}
              </p>
            </RevealItem>
            <RevealItem>
              <p className="body-lg mt-6 max-w-xl text-[var(--ink-soft)]">
                订水更简单，喝水这件小事也更轻松。
              </p>
            </RevealItem>
            {/*
              口径修正：独立域名仍为 TODO 时，原实现回退成 href="#"（点了跳页首）。
              该链接指向水邻居独立官网，未上线前**不渲染**比放一个死链干净。
            */}
            {isDomainKnown ? (
              <RevealItem>
                <a
                  href={domain}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex min-h-11 items-center gap-2 text-[16px] font-medium text-[var(--accent-text)] underline-offset-4 transition-colors hover:underline"
                >
                  访问水邻居官网
                  <span aria-hidden>→</span>
                </a>
              </RevealItem>
            ) : null}
          </Reveal>
        </section>

        {/* Feature list */}
        <section className="container-wide section-y">
          <Reveal>
            <ul className="grid gap-6 sm:grid-cols-3 sm:gap-10">
              {features.map((f, i) => (
                <RevealItem as="li" key={f.title}>
                  <article className="flex flex-col gap-3 border-t border-[var(--accent)]/40 pt-6">
                    <span className="tabular-nums text-[12px] tracking-[0.24em] text-[var(--accent-text)]/70">
                      0{i + 1}
                    </span>
                    <h2 className="text-[22px] font-medium tracking-tight text-[var(--ink)] sm:text-[24px]">
                      {f.title}
                    </h2>
                    <p className="text-[15px] leading-relaxed text-[var(--ink-soft)]">
                      {f.desc}
                    </p>
                  </article>
                </RevealItem>
              ))}
            </ul>
          </Reveal>
        </section>

        {/* 水源与品质 */}
        <section className="container-wide pb-16 sm:pb-24">
          <Reveal className="grid gap-10 sm:gap-14 lg:grid-cols-12 lg:gap-20">
            <RevealItem className="lg:col-span-5 flex flex-col gap-6">
              <span className="eyebrow !text-[var(--accent-text)]">
                水源与品质
              </span>
              <h2 className="display-sub text-[var(--ink)]">
                来自中国十大矿泉水之乡。
              </h2>
              <p className="body-lg text-[var(--ink-soft)]">
                「水邻居」与同门的「美好水一族」，水源地是河北固安——中国十大矿泉水之乡，水取自地下深层。
              </p>
              <ul className="flex flex-col gap-3 text-[15px] leading-relaxed text-[var(--ink-soft)]">
                {shuineighbor.facts.map((f) => (
                  <li key={f}>{f}</li>
                ))}
                <li>2020 年上市，作为廊坊的城市名片打造，自有品牌、自主灌装</li>
              </ul>
            </RevealItem>
            <RevealItem className="lg:col-span-7">
              <Figure id="source-gu-an" ratio="4/3" ratioSm="3/2" rounded />
            </RevealItem>
          </Reveal>
        </section>
      </main>
      <Footer />

      {/* Product 结构化数据：水源 / 认证 / 微量元素，正面回应「贴牌」质疑 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: shuineighborProductJsonLd() }}
      />
    </>
  );
}
