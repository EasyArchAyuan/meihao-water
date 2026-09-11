import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { company } from "@/data/company";

export const metadata: Metadata = buildMetadata({
  title: "关于美好水业",
  description: `美好水业（${company.legalName}），1998 年成立，二十余年专注廊坊本地的桶装水、一次性桶装水、瓶装水与饮水配送服务。`,
  path: "/about",
});

const milestones = [
  { label: "起点", desc: "1998 年，从一桶水开始。" },
  { label: "走进社区", desc: "一桶桶水，送进廊坊的社区与街巷。" },
  { label: "服务企业与商务", desc: "办公室、门店、会议，水提前备好。" },
  { label: "今天", desc: "还在廊坊，还做这件事。" },
];

const values = [
  {
    title: "真实",
    desc: "不编故事，也不喊口号。水就是水。",
  },
  {
    title: "持续",
    desc: "二十余年，做的是同一件事。",
  },
  {
    title: "克制",
    desc: "不打扰，不催促。需要的时候，水就在。",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="bg-[var(--bg)] pt-16 sm:pt-[72px]">
        {/* Hero 标题 */}
        <section className="container-site section-y-sm">
          <Reveal className="max-w-3xl">
            <RevealItem>
              <span className="eyebrow">关于美好水业</span>
            </RevealItem>
            <RevealItem
              as="h1"
              className="display-hero mt-6 text-[var(--ink)]"
            >
              我们在廊坊，
              <br />
              做了二十余年。
            </RevealItem>
            <RevealItem>
              <p className="body-lg mt-8 max-w-2xl text-[var(--ink-soft)]">
                {company.legalName}，1998 年成立。二十余年，只做一件事：把好水送到廊坊人的身边。
              </p>
            </RevealItem>
          </Reveal>
        </section>

        {/* 时间线 */}
        <section className="container-wide pb-16 sm:pb-24">
          <Reveal className="grid gap-10 sm:gap-14">
            <RevealItem>
              <h2 className="display-sub text-[var(--ink)]">关键节点</h2>
            </RevealItem>
            <RevealItem>
              <ol className="grid gap-6 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
                {milestones.map((m, i) => (
                  <li
                    key={m.label}
                    className="flex flex-col gap-2.5 border-t border-[var(--hairline-strong)] pt-5 sm:gap-3 sm:pt-6"
                  >
                    <span className="tabular-nums text-[12px] tracking-[0.24em] text-[var(--ink-muted)]">
                      0{i + 1}
                    </span>
                    <span className="text-[18px] font-medium tracking-tight text-[var(--ink)] sm:text-[20px]">
                      {m.label}
                    </span>
                    <span className="text-[14px] leading-relaxed text-[var(--ink-soft)]">
                      {m.desc}
                    </span>
                  </li>
                ))}
              </ol>
            </RevealItem>
          </Reveal>
        </section>

        {/* 价值主张 */}
        <section className="bg-[var(--bg-alt)]">
          <div className="container-wide section-y">
            <Reveal className="flex flex-col gap-10">
              <RevealItem>
                <span className="eyebrow">我们相信</span>
              </RevealItem>
              <RevealItem>
                <h2 className="display-section text-[var(--ink)]">
                  可靠，但不老气。
                  <br />
                  年轻，但不轻浮。
                </h2>
              </RevealItem>
              <RevealItem>
                <div className="grid gap-8 sm:grid-cols-3 sm:gap-12">
                  {values.map((v) => (
                    <div key={v.title} className="flex flex-col gap-3">
                      <span className="text-[20px] font-medium tracking-tight text-[var(--ink)]">
                        {v.title}
                      </span>
                      <p className="text-[15px] leading-relaxed text-[var(--ink-soft)]">
                        {v.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </RevealItem>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
