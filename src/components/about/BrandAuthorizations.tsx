import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Figure } from "@/components/ui/Figure";
import { brandAuthorizations } from "@/data/brands";

/**
 * 品牌授权资质展示。
 *
 * 用于 /about（公司资质）与 /brands（代理品牌授权证明）。
 * 以 3/2 统一容器 + object-contain 展示授权书全貌，避免裁剪文字/印章。
 */
export function BrandAuthorizations({
  eyebrow = "授权资质",
  title = "品牌方给的授权书，\n不是谁都能挂的牌子。",
  subtitle = "在廊坊销售这些品牌，我们有书面授权。",
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-[var(--bg)]">
      <div className="container-wide section-y">
        <Reveal className="flex flex-col gap-10 sm:gap-14">
          <RevealItem>
            <span className="eyebrow">{eyebrow}</span>
          </RevealItem>
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-16">
            <RevealItem>
              <h2 className="display-sub whitespace-pre-line text-[var(--ink)]">
                {title}
              </h2>
            </RevealItem>
            <RevealItem className="lg:flex lg:items-end">
              <p className="body-lg max-w-2xl text-[var(--ink-soft)] lg:max-w-none">
                {subtitle}
              </p>
            </RevealItem>
          </div>
          <RevealItem>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {brandAuthorizations.map((item) => (
                <li
                  key={item.id}
                  className="group flex flex-col gap-4 rounded-2xl border border-[var(--hairline)] bg-[var(--bg)] p-3 sm:p-4"
                >
                  <Figure
                    id={item.mediaId}
                    ratio="3/2"
                    fit="contain"
                    rounded
                    className="bg-[var(--bg-alt)]"
                  />
                  <div className="flex flex-col gap-1 px-1 pb-1">
                    <span className="text-[16px] font-medium tracking-tight text-[var(--ink)]">
                      {item.brand}
                    </span>
                    <span className="text-[13px] leading-relaxed text-[var(--ink-muted)]">
                      {item.label}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
