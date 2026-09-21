import Link from "next/link";
import { Figure } from "@/components/ui/Figure";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { company, isTodo } from "@/data/company";

const linkClass =
  "mt-2 inline-flex min-h-11 items-center gap-2 text-[15px] font-medium text-[var(--accent-text)] underline-offset-4 transition-colors hover:underline";

/**
 * 旗下品牌「水邻居」。
 *
 * 改动：
 * 1. 用 `company.shuineighbor.facts`（水源 / 认证 / 微量元素 / 上市年份）替换
 *    原来的抒情句「订水更简单，喝水这件小事也更轻松」—— 前者是美好水业
 *    自己的一手事实，后者是任何品牌都能写的句子。
 * 2. 修掉一个死链：独立域名仍为 TODO 时，原实现回退成 `href="#"`（点了跳页首）。
 *    站内本就有 /shuineighbor 页面，未定域名时应指向它。
 */
export function ShuiNeighborSection() {
  const { shuineighbor } = company;
  const isDomainKnown = !isTodo(shuineighbor.domain);

  return (
    <section
      aria-labelledby="shuineighbor-title"
      className="bg-[var(--accent-tint)]"
    >
      <div className="container-wide section-y">
        <div className="grid items-center gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-20">
          {/* 文字：桌面在左 */}
          <Reveal className="lg:col-span-6 lg:order-1 flex flex-col gap-6 sm:gap-8">
            <RevealItem>
              <span className="eyebrow !text-[var(--accent-text)]">
                旗下品牌
              </span>
            </RevealItem>
            <RevealItem
              as="h2"
              id="shuineighbor-title"
              className="display-section text-[var(--accent-text)]"
            >
              {shuineighbor.name}
            </RevealItem>
            <RevealItem>
              <p className="display-sub text-[var(--ink)]">
                {shuineighbor.tagline}
              </p>
            </RevealItem>

            <RevealItem>
              <ul className="flex flex-col gap-2.5 border-l-2 border-[var(--accent)] pl-4 sm:pl-5">
                {shuineighbor.facts.map((fact) => (
                  <li
                    key={fact}
                    className="text-[14px] leading-relaxed text-[var(--ink-soft)] sm:text-[15px]"
                  >
                    {fact}
                  </li>
                ))}
              </ul>
            </RevealItem>

            <RevealItem>
              {isDomainKnown ? (
                <a
                  href={shuineighbor.domain}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  了解水邻居
                  <span aria-hidden>→</span>
                </a>
              ) : (
                <Link href="/shuineighbor/" className={linkClass}>
                  了解水邻居
                  <span aria-hidden>→</span>
                </Link>
              )}
            </RevealItem>
          </Reveal>

          {/* 图片：桌面在右，移动端在下 */}
          <RevealItem as="div" className="lg:col-span-6 lg:order-2">
            <Figure id="shuineighbor" ratio="4/5" rounded />
          </RevealItem>
        </div>
      </div>
    </section>
  );
}
