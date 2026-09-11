import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { company } from "@/data/company";

export const metadata: Metadata = buildMetadata({
  title: "关于美好水业",
  description: `美好水业（${company.legalName}），自 1998 年起扎根廊坊，二十余年专注桶装水、一次性桶装水、瓶装水及饮水配送服务。`,
  path: "/about",
});

const milestones = [
  { label: "起点", desc: "自 1998 年起，从一桶水开始。" },
  { label: "走进社区", desc: "水站覆盖廊坊各区与街巷。" },
  { label: "服务企业与商务", desc: "为办公室、门店与会议场景提供稳定补给。" },
  { label: "今天", desc: "仍是廊坊本地的饮水服务品牌。" },
];

const values = [
  {
    title: "真实",
    desc: "不夸大，不虚构。每一桶水，背后都是一次日常。",
  },
  {
    title: "持续",
    desc: "二十余年的本地积累，是别人拿不走的。",
  },
  {
    title: "克制",
    desc: "做该做的事，不堆砌。该给到客户的，就给到。",
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
                {company.legalName}，自 1998 年起扎根廊坊。从一桶水开始，为家庭、企业与城市生活提供持续、可靠的饮水服务。
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
            <RevealItem>
              <p className="text-[12px] text-[var(--ink-muted)]">
                * 不标注具体年份节点，避免虚构事实。
              </p>
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
