import Link from "next/link";
import { Figure } from "@/components/ui/Figure";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { TelLink } from "@/components/ui/TelLink";
import { primaryPhone, company } from "@/data/company";
import { deliveryAreas } from "@/data/faq";

/**
 * 收尾转化区。
 *
 * 改动（「重复 CTA」治理的落点）：
 * 1. 原本直接把 Hero 的巨字 slogan「好水，在身边。」与按钮「立即订水」原样复刻一遍
 *    —— 首屏刚点过的主按钮，滚到页尾又出现一次，属于重复而非强化。
 *    现在 Hero 是唯一的主按钮位，这里改用行业真实转化路径：打电话。
 * 2. 删掉「家庭订水 / 企业用水 / 商务合作」三入口清单 —— 与 WhatWeDo 的四项
 *    内容重叠，且都不带链接，只是装饰性文字。
 * 3. 「二十余年」改为从数据源派生的「自 1997 年起」。
 */
export function ClosingCTA() {
  const otherPhones = company.phones.filter((p) => !p.primary);

  return (
    <section aria-labelledby="closing-title" className="bg-[var(--bg)]">
      <div className="container-site section-y text-center">
        <Reveal className="flex flex-col items-center gap-8 sm:gap-10">
          <RevealItem>
            <span className="eyebrow">开始订水</span>
          </RevealItem>

          <RevealItem
            as="h2"
            id="closing-title"
            className="display-section text-[var(--ink)]"
          >
            现在要水，
            <br />
            打个电话最快。
          </RevealItem>

          <RevealItem>
            <p className="body-lg max-w-md text-[var(--ink-soft)]">
              覆盖{deliveryAreas}。家庭按周、公司按月，急用与批量用水电话里说一声。
            </p>
          </RevealItem>

          <RevealItem as="div" className="w-full">
            <div className="mt-12 grid w-full max-w-3xl gap-10 border-t border-[var(--hairline)] pt-10 text-left sm:mt-20 sm:grid-cols-2 sm:gap-10 sm:pt-14">
              <div className="flex flex-col items-center gap-3 sm:items-start sm:gap-4">
                <span className="eyebrow">订水热线</span>
                <TelLink phone={primaryPhone} prominent />
                <p className="text-[13px] text-[var(--ink-muted)]">
                  廊坊本地 · {company.yearsPhrase}
                </p>
                <p className="text-[13px] tabular-nums text-[var(--ink-muted)]">
                  另有 {otherPhones.map((p) => p.display).join(" / ")}
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 sm:items-end sm:gap-4">
                <span className="eyebrow">微信服务号</span>
                {/* 宽度必须由外层容器约束：Figure 基类含 w-full，且 cn() 不做冲突消解 */}
                <div className="w-48 sm:w-56">
                  <Figure
                    src="/images/wechat-service-card.jpg"
                    alt="微信搜一搜「廊坊桶装水」，关注美好水业服务号"
                    ratio="3/1"
                    fit="contain"
                    rounded
                    sizes="(max-width: 640px) 60vw, 240px"
                  />
                </div>
                <p className="text-[12px] text-[var(--ink-muted)]">
                  微信搜一搜「廊坊桶装水」
                </p>
              </div>
            </div>
          </RevealItem>

          <RevealItem>
            <Link
              href="/faq/"
              className="inline-flex min-h-11 items-center gap-2 text-[14px] font-medium text-[var(--ink-soft)] underline-offset-4 transition-colors hover:underline"
            >
              第一次订水？先看看常见问题
              <span aria-hidden>→</span>
            </Link>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
