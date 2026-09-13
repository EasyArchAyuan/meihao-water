import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Figure } from "@/components/ui/Figure";
import { TelLink } from "@/components/ui/TelLink";
import { company, primaryPhone } from "@/data/company";
import { deliveryAreas, deliveryLeadTime } from "@/data/faq";

export const metadata: Metadata = buildMetadata({
  title: "廊坊桶装水配送",
  description: `廊坊桶装水配送与送水上门服务：${company.brandName}（${company.legalName}）自 1998 年起服务廊坊，覆盖${deliveryAreas}，经营桶装水、一次性桶装水、瓶装水与饮水机配送，承接家庭、公司、社区与会议用水。`,
  path: "/langfang",
  keywords: [
    "廊坊桶装水",
    "廊坊送水",
    "廊坊桶装水配送",
    "廊坊送水上门",
    "廊坊公司订水",
    "廊坊饮用水",
    "廊坊桶装水哪家好",
  ],
});

/** 实体锚点：城市 + 主体 + 业务 + 时效（一屏说清，便于 AI 抽取） */
const entityFacts = [
  { label: "服务城市", value: "河北省廊坊市" },
  { label: "经营主体", value: company.legalName },
  { label: "品牌名称", value: company.brandName },
  { label: "起始年份", value: `${company.establishedYear} 年` },
  { label: "覆盖区域", value: deliveryAreas },
  { label: "送达时效", value: deliveryLeadTime },
  { label: "经营品类", value: company.delivery.categories.join(" / ") },
  { label: "服务场景", value: company.delivery.scenes.join(" / ") },
];

/** 选择本地服务商的理由（只写已确认事实，不点名竞品） */
const reasons = [
  {
    title: "本地仓配，不等外调",
    desc: "库房 5000 余平米，成品水分区码放，廊坊本地出库，不依赖外地调货。",
  },
  {
    title: "二十余年没换行",
    desc: "自 1998 年起在廊坊经营饮用水配送，做的是同一件事。",
  },
  {
    title: "品牌可自选",
    desc: "代理多个知名品牌的桶装水与瓶装水，也有自有的「水邻居」天然矿泉水。",
  },
  {
    title: "公司客户有据可查",
    desc: "可为公司、门店提供固定频次配送与正规发票，按票据记录核对。",
  },
];

/** 承接的场景 */
const scenes = [
  { title: "家庭", desc: "日常的一桶水，按时送到，不用惦记。" },
  { title: "公司与门店", desc: "按周或按月约定频次，避免临时缺水。" },
  { title: "会议与活动", desc: "一次性桶装水更省事，不回收、不清洗。" },
  { title: "社区与应急", desc: "批量用水提前电话说明，便于安排车辆与人员。" },
];

export default function LangfangPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="bg-[var(--bg)] pt-16 sm:pt-[72px]">
        {/* Hero：城市 + 业务实体锚点 */}
        <section className="container-site section-y-sm">
          <Reveal className="max-w-3xl">
            <RevealItem as="span" className="eyebrow">
              廊坊本地服务
            </RevealItem>
            <RevealItem as="h1" className="display-hero mt-6 text-[var(--ink)]">
              廊坊桶装水配送，
              <br />
              一个电话就到。
            </RevealItem>
            <RevealItem>
              <p className="body-lg mt-8 max-w-2xl text-[var(--ink-soft)]">
                {company.brandName}（{company.legalName}）自 {company.establishedYear}{" "}
                年起在廊坊经营饮用水配送，覆盖{deliveryAreas}，为家庭、公司、社区与会议提供桶装水、一次性桶装水、瓶装水与饮水机配送。
              </p>
            </RevealItem>
            <RevealItem className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-10">
              <TelLink phone={primaryPhone} prominent />
              <Link
                href="/products"
                className="inline-flex min-h-11 items-center gap-2 text-[16px] font-medium text-[var(--ink)] underline-offset-4 transition-colors hover:underline"
              >
                查看产品与服务
                <span aria-hidden>→</span>
              </Link>
            </RevealItem>
          </Reveal>
        </section>

        {/* 实体锚点表 */}
        <section aria-labelledby="entity-title" className="container-wide pb-16 sm:pb-24">
          <Reveal className="flex flex-col gap-10">
            <RevealItem>
              <h2 id="entity-title" className="display-sub text-[var(--ink)]">
                一张表，看清楚。
              </h2>
            </RevealItem>
            <RevealItem>
              <dl className="grid gap-x-10 gap-y-0 border-t border-[var(--hairline-strong)] sm:grid-cols-2">
                {entityFacts.map((f) => (
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

        {/* 为什么选我们 */}
        <section aria-labelledby="why-title" className="bg-[var(--bg-alt)]">
          <div className="container-wide section-y">
            <Reveal className="flex flex-col gap-10 sm:gap-14">
              <RevealItem as="span" className="eyebrow">
                为什么选我们
              </RevealItem>
              <RevealItem>
                <h2 id="why-title" className="display-section text-[var(--ink)]">
                  送水这件事，
                  <br />
                  靠的是长期。
                </h2>
              </RevealItem>
              <RevealItem>
                <ul className="grid gap-8 sm:grid-cols-2 sm:gap-12">
                  {reasons.map((r) => (
                    <li key={r.title} className="flex flex-col gap-3">
                      <h3 className="text-[20px] font-medium tracking-tight text-[var(--ink)]">
                        {r.title}
                      </h3>
                      <p className="text-[15px] leading-relaxed text-[var(--ink-soft)]">
                        {r.desc}
                      </p>
                    </li>
                  ))}
                </ul>
              </RevealItem>
            </Reveal>
          </div>
        </section>

        {/* 场景 + 图片 */}
        <section aria-labelledby="scene-title" className="container-wide section-y">
          <Reveal className="grid gap-10 lg:grid-cols-12 lg:gap-20">
            <RevealItem className="lg:col-span-5 flex flex-col gap-6">
              <span className="eyebrow">服务场景</span>
              <h2 id="scene-title" className="display-sub text-[var(--ink)]">
                家里、公司、
                <br />
                会议都送。
              </h2>
              <ul className="flex flex-col gap-6">
                {scenes.map((s) => (
                  <li key={s.title} className="flex flex-col gap-1.5">
                    <span className="text-[16px] font-medium tracking-tight text-[var(--ink)]">
                      {s.title}
                    </span>
                    <span className="text-[15px] leading-relaxed text-[var(--ink-soft)]">
                      {s.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </RevealItem>
            <RevealItem className="lg:col-span-7">
              <Figure id="whatwedo-02" ratio="4/3" ratioSm="3/2" rounded />
            </RevealItem>
          </Reveal>
        </section>

        {/* 流程 */}
        <section aria-labelledby="flow-title" className="bg-[var(--bg-alt)]">
          <div className="container-wide section-y">
            <Reveal className="flex flex-col gap-10">
              <RevealItem>
                <h2 id="flow-title" className="display-sub text-[var(--ink)]">
                  四步走完。
                </h2>
              </RevealItem>
              <RevealItem>
                <ol className="grid gap-6 border-t border-[var(--hairline-strong)] pt-8 sm:grid-cols-4 sm:gap-10">
                  {["电话订水", "确认品牌与数量", "安排配送", "送达 / 回收空桶"].map(
                    (s, i) => (
                      <li key={s} className="flex flex-col gap-2.5">
                        <span className="tabular-nums text-[12px] tracking-[0.24em] text-[var(--ink-muted)]">
                          0{i + 1}
                        </span>
                        <span className="text-[17px] font-medium tracking-tight text-[var(--ink)]">
                          {s}
                        </span>
                      </li>
                    ),
                  )}
                </ol>
              </RevealItem>
            </Reveal>
          </div>
        </section>

        {/* 常见问题导流 */}
        <section className="container-wide section-y">
          <Reveal className="flex flex-col gap-8">
            <RevealItem>
              <h2 className="display-sub text-[var(--ink)]">
                还有几件要先问的。
              </h2>
            </RevealItem>
            <RevealItem>
              <p className="max-w-2xl text-[15px] leading-relaxed text-[var(--ink-soft)]">
                是不是正品、水桶怎么消毒、空桶和押金怎么处理、多久送到——这些都写在常见问题里，一次说清楚。
              </p>
            </RevealItem>
            <RevealItem className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
              <Link
                href="/faq"
                className="inline-flex min-h-11 items-center gap-2 text-[16px] font-medium text-[var(--ink)] underline-offset-4 transition-colors hover:underline"
              >
                查看常见问题
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center gap-2 text-[16px] font-medium text-[var(--ink)] underline-offset-4 transition-colors hover:underline"
              >
                联系方式与地址
                <span aria-hidden>→</span>
              </Link>
            </RevealItem>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
