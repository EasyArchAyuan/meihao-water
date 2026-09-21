import { Reveal, RevealItem, RevealOne } from "@/components/ui/Reveal";
import { Figure } from "@/components/ui/Figure";
import { brandSpan, company } from "@/data/company";
import { agencyBrandCount } from "@/data/brands";

/**
 * 品牌坐标（右侧事实索引）。
 * 每一项都是美好水业**独有、可核对**的事实。原来的「廊坊 / 家庭 / 社区 /
 * 企业 / 城市生活」关键词线与 CitySection 一字不差，是首页最明显的模板痕迹，
 * 已删除 —— 任何本地水站都能套用的词，一律不出现。
 */
const coordinates = [
  { value: "4 家", label: "分店：光明西道 · 燕青宾馆 · 花园楼市场 · 朝阳市场" },
  { value: "5000 余平米", label: "库房，不同品牌与规格分区码放" },
  { value: `${agencyBrandCount} 个`, label: "桶装水与瓶装水品牌，本地都能送" },
  { value: "30 吨", label: "北京盒马鲜生仓配一体化，日吞吐量" },
];

/**
 * 品牌跨度 —— 全站核心视觉之一。
 *
 * 设计意图：把「1997—2026」做成一个可识别的图形资产，而不是一句话。
 * - 它比「近三十年」更硬：具体年份无法被同行复制；
 * - 数字形态（tabular-nums + 极紧字距）天然具备标识般的可记忆性；
 * - 因改为整行独占的超大字，宽度不再受侧栏挤压，故可安全取到 200px。
 *
 * ⚠️ 数据全部来自 `brandSpan`，页面里不出现字面量「1997—2026」或「29」。
 */
export function YearsSection() {
  return (
    <section
      aria-labelledby="years-title"
      className="bg-[var(--brand-deep)] text-[var(--on-dark)]"
    >
      <div className="container-wide section-y">
        {/* 核心视觉：年份跨度巨字（整行独占） */}
        <Reveal className="flex flex-col gap-5 sm:gap-6">
          <RevealItem>
            <span className="eyebrow !text-[var(--on-dark-soft)]">
              {company.yearsPhrase}
            </span>
          </RevealItem>

          {/*
            字号下限 52px：375px 屏可用宽 335px，本行约 5.5em ≈ 286px，不溢出。
            上限 200px：1600px 容器可用 1472px，200 × 5.5 = 1100px，留足余白。
          */}
          <RevealItem
            as="h2"
            id="years-title"
            className="text-[clamp(52px,13vw,200px)] font-medium leading-[1] tracking-[-0.045em] tabular-nums text-[var(--on-dark)]"
          >
            {brandSpan.label}
          </RevealItem>

          <RevealItem>
            <p className="display-sub text-[var(--on-dark)]">
              {brandSpan.years} 年，
              <br />
              从一间水站开始，一直在廊坊。
            </p>
          </RevealItem>
        </Reveal>

        {/* 纪实三图 + 品牌坐标 */}
        <div className="mt-14 grid gap-10 sm:mt-20 lg:grid-cols-12 lg:gap-20">
          <RevealOne className="lg:col-span-7">
            <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
              <Figure
                id="years-01"
                ratio="3/4"
                rounded
                sizes="(max-width: 640px) 30vw, (max-width: 1024px) 28vw, 15vw"
              />
              <Figure
                id="years-02"
                ratio="3/4"
                rounded
                sizes="(max-width: 640px) 30vw, (max-width: 1024px) 28vw, 15vw"
              />
              <Figure
                id="years-03"
                ratio="3/4"
                rounded
                sizes="(max-width: 640px) 30vw, (max-width: 1024px) 28vw, 15vw"
              />
            </div>
          </RevealOne>

          <RevealOne className="lg:col-span-5">
            <dl className="flex flex-col">
              {coordinates.map((c) => (
                <div
                  key={c.label}
                  className="flex flex-col gap-1.5 border-b border-[var(--on-dark-soft)]/15 py-4 first:pt-0 last:border-b-0 last:pb-0"
                >
                  <dt className="text-[clamp(20px,2.2vw,28px)] font-medium leading-tight tracking-tight tabular-nums text-[var(--on-dark)]">
                    {c.value}
                  </dt>
                  <dd className="text-[13px] leading-relaxed text-[var(--on-dark-soft)]">
                    {c.label}
                  </dd>
                </div>
              ))}
            </dl>
          </RevealOne>
        </div>
      </div>
    </section>
  );
}
