import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Figure } from "@/components/ui/Figure";
import { company } from "@/data/company";

export const metadata: Metadata = buildMetadata({
  title: "关于美好水业",
  description: `美好水业（${company.legalName}），1998 年成立，二十余年专注廊坊本地的桶装水、一次性桶装水、瓶装水与饮水配送服务。`,
  path: "/about",
});

/** 企业历程（1998 起步，1999 定名美好水业） */
const milestones = [
  {
    year: "1999",
    title: "定名美好水业",
    desc: "迁址朝阳市场，正式定名「美好水业」。送水的车辙，开始铺进廊坊的社区与街巷。",
  },
  {
    year: "2004",
    title: "并购两个水站",
    desc: "搬到燕青宾馆附近，并购两个水站；每个站点单日送水量能做到 500 桶。",
  },
  {
    year: "2012",
    title: "北凤道 399 号",
    desc: "库房占地 5000 余平米，铺设光明西道、燕青宾馆、花园楼市场、朝阳市场四个分店；同时承接百事可乐廊坊地区前进仓，做物流中转。",
  },
  {
    year: "2014–2017",
    title: "走出市区",
    desc: "凭信誉陆续承接河北省辖区内高速公路服务区的供水，以及廊坊开发区 40% 外企的用水任务。",
  },
  {
    year: "2020",
    title: "做自己的品牌",
    desc: "「水邻居」「美好水一族」天然矿泉水上市——水源来自中国十大矿泉水之乡，河北固安。",
  },
  {
    year: "2023",
    title: "仓配一体",
    desc: "新增为北京盒马鲜生提供饮用水与饮料的仓配一体化服务，日吞吐量 30 吨。",
  },
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

const honours = [
  { id: "about-honor-01", label: "疫情防控爱心企业", by: "廊坊市小微企业协会 · 2022" },
  { id: "about-honor-02", label: "3·15 国际消费者权益日重点推荐品牌", by: "廊坊市美好商贸有限公司" },
  { id: "about-honor-03", label: "守合同 重信用 消费者推荐单位", by: "荣誉证书" },
  { id: "about-honor-04", label: "2015 年度 消费者满意示范单位", by: "" },
  { id: "about-honor-05", label: "放心消费创建示范单位", by: "廊坊市 · 河北省消费者协会消费者满意示范单位" },
  { id: "about-honor-06", label: "河北省 AAA 级信用优秀单位", by: "" },
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
              {/* 实体消歧：与天津同名主体区分，避免工商平台信息被 AI 混淆 */}
              <RevealItem>
                <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-[var(--ink-muted)]">
                  {company.disambiguation}
                </p>
              </RevealItem>
            </Reveal>
          </section>

          {/* 主体信息（品牌名 / 法律主体 / 地址 / 起始年） */}
          <section aria-labelledby="entity-title" className="pb-16 sm:pb-24">
            <div className="container-wide">
              <Reveal className="flex flex-col gap-8">
                <RevealItem>
                  <h2 id="entity-title" className="sr-only">
                    企业主体信息
                  </h2>
                </RevealItem>
                <RevealItem>
                  <dl className="grid gap-x-10 border-t border-[var(--hairline-strong)] sm:grid-cols-2">
                    {[
                      { label: "品牌名称", value: company.brandName },
                      { label: "法律主体", value: company.legalName },
                      { label: "成立时间", value: `${company.establishedYear} 年` },
                      { label: "所在城市", value: "河北省廊坊市" },
                      { label: "注册地址", value: company.address },
                      { label: "订水电话", value: company.phones.map((p) => p.display).join(" / ") },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex flex-col gap-1 border-b border-[var(--hairline)] py-5 sm:flex-row sm:items-baseline sm:gap-6 sm:py-6"
                      >
                        <dt className="w-28 shrink-0 text-[11px] uppercase tracking-[0.24em] text-[var(--ink-muted)]">
                          {row.label}
                        </dt>
                        <dd className="text-[15px] leading-relaxed text-[var(--ink)]">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </RevealItem>
              </Reveal>
            </div>
          </section>

        {/* 企业历程 */}
        <section className="container-wide pb-16 sm:pb-24">
          <Reveal className="grid gap-10 sm:gap-14">
            <RevealItem>
              <span className="eyebrow">企业历程</span>
            </RevealItem>
            <RevealItem>
              <h2 className="display-sub text-[var(--ink)]">
                一桶水，二十余年。
              </h2>
            </RevealItem>
            <RevealItem>
              <ol className="grid gap-6 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
                {milestones.map((m) => (
                  <li
                    key={m.year}
                    className="flex flex-col gap-2.5 border-t border-[var(--hairline-strong)] pt-5 sm:gap-3 sm:pt-6"
                  >
                    <span className="tabular-nums text-[12px] tracking-[0.24em] text-[var(--ink-muted)]">
                      {m.year}
                    </span>
                    <span className="text-[18px] font-medium tracking-tight text-[var(--ink)] sm:text-[20px]">
                      {m.title}
                    </span>
                    <span className="text-[14px] leading-relaxed text-[var(--ink-soft)]">
                      {m.desc}
                    </span>
                  </li>
                ))}
              </ol>
            </RevealItem>
            <RevealItem>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                <Figure id="about-warehouse-01" ratio="3/2" rounded />
                <Figure id="about-warehouse-02" ratio="3/2" rounded />
                <Figure id="about-warehouse-03" ratio="16/9" rounded />
                <Figure id="about-storefront-01" ratio="16/9" rounded />
              </div>
            </RevealItem>
            <RevealItem>
              <p className="text-[14px] text-[var(--ink-muted)]">
                现在的库房 5000 余平米，不同品牌、不同规格的成品水分区码放，叉车每天在货架间穿行。
              </p>
            </RevealItem>
          </Reveal>
        </section>

        {/* 创始人 */}
        <section className="bg-[var(--bg-alt)]">
          <div className="container-wide section-y">
            <Reveal className="grid gap-10 sm:gap-14 lg:grid-cols-12 lg:gap-20">
              <RevealItem className="lg:col-span-5">
                <Figure id="about-founder" ratio="1/1" rounded />
              </RevealItem>
              <RevealItem className="lg:col-span-7 flex flex-col gap-6">
                <span className="eyebrow">创始人</span>
                <h2 className="display-sub text-[var(--ink)]">
                  老老实实做人，
                  <br />
                  踏踏实实做事。
                </h2>
                <p className="body-lg text-[var(--ink-soft)]">
                  美好水业创始人、总经理尤宝来，土生土长的廊坊人。二十余年前接手一间水站，从一天卖不出几桶水开始，把「美好水业」做成了廊坊人熟悉的名字。
                </p>
                <p className="text-[15px] leading-relaxed text-[var(--ink-soft)]">
                  曾有人拿着一张 20 年前美好水业发行的水票来问还能不能换。她没有犹豫：能，只要我在，就能换。
                </p>
                <p className="text-[15px] leading-relaxed text-[var(--ink-soft)]">
                  办公室墙上挂着一幅字——「传家有道惟忠厚，处事无奇但率真」。她说，想让廊坊人喝上更健康的饮用水。
                </p>
              </RevealItem>
            </Reveal>
            <Reveal className="mt-10 sm:mt-14">
              <RevealItem>
                <Figure id="about-office" ratio="4/3" ratioSm="16/9" rounded />
              </RevealItem>
            </Reveal>
          </div>
        </section>

        {/* 价值主张 */}
        <section className="bg-[var(--bg)]">
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

        {/* 公益 */}
        <section className="bg-[var(--bg-alt)]">
          <div className="container-wide section-y">
            <Reveal className="flex flex-col gap-10 sm:gap-14">
              <RevealItem>
                <span className="eyebrow">公益</span>
              </RevealItem>
              <RevealItem>
                <h2 className="display-section text-[var(--ink)]">
                  每卖一桶水，
                  <br />
                  捐出一毛钱。
                </h2>
              </RevealItem>
              <RevealItem>
                <p className="body-lg max-w-3xl text-[var(--ink-soft)]">
                  疫情期间，美好水业为廊坊市区 30 多个疫情防控点、80% 的方舱医院供水，并向医院与社区防疫点陆续捐赠物资十万余元。库房办公室的墙上，挂着一块「疫情防控爱心企业」的牌子——问起来，只说「就是捐了点水和物资」。
                </p>
              </RevealItem>
              <RevealItem>
                <p className="max-w-3xl text-[15px] leading-relaxed text-[var(--ink-soft)]">
                  2008 到 2014 年，尤宝来以个人名义发起公益组织「爱心互助会」，赴保定易县、涞水走访评估，确定帮扶家庭和困难学生，定期送去生活物资与奖学金；善款来自「每卖一桶水，捐出一毛钱」。
                </p>
              </RevealItem>
              <RevealItem>
                <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                  <Figure id="about-csr-01" ratio="16/9" rounded />
                  <Figure id="about-csr-02" ratio="4/3" rounded />
                  <Figure id="about-csr-03" ratio="4/3" rounded />
                  <Figure id="about-csr-04" ratio="3/2" rounded />
                </div>
              </RevealItem>
            </Reveal>
          </div>
        </section>

        {/* 荣誉 */}
        <section className="bg-[var(--bg)]">
          <div className="container-wide section-y">
            <Reveal className="flex flex-col gap-10 sm:gap-14">
              <RevealItem>
                <span className="eyebrow">荣誉</span>
              </RevealItem>
              <RevealItem>
                <h2 className="display-sub text-[var(--ink)]">
                  牌子挂在墙上，水还在送。
                </h2>
              </RevealItem>
              <RevealItem>
                <ul className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
                  {honours.map((h) => (
                    <li key={h.id} className="flex flex-col gap-4">
                      <Figure id={h.id} ratio="4/3" rounded />
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[15px] font-medium leading-snug tracking-tight text-[var(--ink)]">
                          {h.label}
                        </span>
                        {h.by ? (
                          <span className="text-[13px] leading-relaxed text-[var(--ink-muted)]">
                            {h.by}
                          </span>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </RevealItem>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
