import Link from "next/link";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import {
  agencyBrandCount,
  agencyBrandsByCategory,
  brandAuthorizations,
} from "@/data/brands";

/**
 * 首页「代理品牌」区块（新增）。
 *
 * 为什么值得占首页一块位置：代理多品牌是美好水业**最不容易被模仿的差异点** ——
 * 单品牌水站不可能同时配送十余个牌子。原版本把它压缩成 DisposableSection
 * 底部一句「以下品牌的桶装水与瓶装水，我们都在送」，等于把最强的信任状藏了起来。
 *
 * 合规：只出现品牌中文名称（事实陈述），不出现任何品牌 logo / 商标图，
 * 不暗示与品牌方存在代理 / 经销之外的关联。
 */
export function BrandsSection() {
  const authorizedNames = brandAuthorizations.map((a) => a.brand).join("、");

  return (
    <section
      aria-labelledby="brands-title"
      className="bg-[var(--brand-deep)] text-[var(--on-dark)]"
    >
      <div className="container-wide section-y">
        <Reveal className="flex flex-col items-center gap-5 text-center sm:gap-6">
          <RevealItem>
            <span className="eyebrow !text-[var(--on-dark-soft)]">
              代理品牌
            </span>
          </RevealItem>
          <RevealItem
            as="h2"
            id="brands-title"
            className="display-section text-[var(--on-dark)]"
          >
            常喝的牌子，
            <br />
            我们车上都有。
          </RevealItem>
          <RevealItem>
            <p className="body-lg max-w-xl text-[var(--on-dark-soft)]">
              {agencyBrandCount} 个品牌的桶装水与瓶装水，在廊坊本地都能送到。
            </p>
          </RevealItem>
        </Reveal>

        {/* 按品类分组：比 /products 的一行平铺多一层信息（哪些是水、哪些是饮料） */}
        <Reveal className="mt-12 sm:mt-20">
          <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
            {agencyBrandsByCategory.map(({ category, names }, i) => (
              <RevealItem
                as="div"
                key={category}
                className="flex flex-col gap-4 sm:gap-5"
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="text-[15px] font-medium text-[var(--on-dark)]">
                    {category}
                  </h3>
                  <span className="tabular-nums text-[11px] tracking-[0.24em] text-[var(--on-dark-soft)]">
                    0{i + 1}
                  </span>
                </div>
                <hr className="h-px w-full border-0 bg-[var(--on-dark-soft)]/20" />
                <ul className="flex flex-wrap items-baseline gap-x-5 gap-y-2.5 sm:gap-x-6">
                  {names.map((n) => (
                    <li
                      key={n}
                      className="text-[17px] tracking-tight text-[var(--on-dark)] sm:text-[19px]"
                    >
                      {n}
                    </li>
                  ))}
                </ul>
              </RevealItem>
            ))}
          </div>
        </Reveal>

        {/* 信任状收尾：书面授权是可查验的，比「我们代理很多品牌」有力得多 */}
        <Reveal className="mt-12 flex flex-col items-center gap-4 text-center sm:mt-20">
          <RevealItem>
            <p className="max-w-2xl text-[14px] leading-relaxed text-[var(--on-dark-soft)]">
              其中{authorizedNames}持有品牌方或区域总代理出具的书面授权，可查验。
            </p>
          </RevealItem>
          <RevealItem>
            <Link
              href="/brands/"
              className="inline-flex min-h-11 items-center gap-2 text-[14px] font-medium text-[var(--on-dark)] underline-offset-4 transition-colors hover:underline"
            >
              查看全部品牌与授权证明
              <span aria-hidden>→</span>
            </Link>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
