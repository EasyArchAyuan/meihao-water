import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Figure } from "@/components/ui/Figure";
import { company, isTodo } from "@/data/company";

export const metadata: Metadata = buildMetadata({
  title: "水邻居",
  description:
    "水邻居，美好水业旗下新一代饮水生活品牌。让订水更简单，让喝水这件小事，变得更轻松。",
  path: "/shuineighbor",
});

const features = [
  { title: "更轻", desc: "一次性的便捷，丢掉繁琐的归还与清洗。" },
  { title: "更简单", desc: "下单、支付、追踪，几步搞定。" },
  { title: "更年轻", desc: "清新的视觉，温柔的节奏。" },
];

export default function ShuineighborPage() {
  const { shuineighbor } = company;
  const domain = shuineighbor.domain;
  const isDomainKnown = !isTodo(domain);
  const linkProps = isDomainKnown
    ? { href: domain, target: "_blank", rel: "noopener noreferrer" }
    : { href: "#" };

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
            <RevealItem as="h1">
              <h1 className="display-hero mt-6 text-[var(--accent-text)]">
                {shuineighbor.name}
              </h1>
            </RevealItem>
            <RevealItem>
              <p className="display-sub mt-8 text-[var(--ink)]">
                {shuineighbor.tagline}
              </p>
            </RevealItem>
            <RevealItem>
              <p className="body-lg mt-6 max-w-xl text-[var(--ink-soft)]">
                让订水更简单，让喝水这件小事，变得更轻松。
              </p>
            </RevealItem>
            <RevealItem>
              <a
                {...linkProps}
                className="mt-8 inline-flex items-center gap-2 text-[16px] font-medium text-[var(--accent-text)] underline-offset-4 transition-colors hover:underline"
              >
                {isDomainKnown ? "访问水邻居官网" : "官网即将上线"}
                <span aria-hidden>→</span>
              </a>
            </RevealItem>
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
                    <h2 className="text-[24px] font-medium tracking-tight text-[var(--ink)]">
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

        {/* 主图 */}
        <section className="container-wide pb-24">
          <Reveal>
            <Figure id="shuineighbor" ratio="16/9" rounded />
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
