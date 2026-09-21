import Link from "next/link";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { deliveryAreas } from "@/data/faq";

const steps = ["下单", "接单", "配送", "送达", "持续服务"];

/**
 * 配送服务。
 *
 * 改动：
 * 1. 底部原本是「本地 / 及时 / 长期 / 可靠」四个词 —— 与 CitySection 的关键词线
 *    同属「任何行业都能用的形容词」，没有信息量。换成真实配送口径
 *    （覆盖区域从 company.delivery 派生，未确认时自动降级），并补上 /langfang 内链
 *    —— 原 CitySection 承担的本地下沉入口，随该区块一并移交到这里。
 * 2. 标题从「你负责生活，我们负责送水」这类抒情句，改为对下方五步流程的
 *    直接承诺（说清每一步），标题与内容重新建立了逻辑关系。
 */
export function DeliveryFlow() {
  return (
    <section aria-labelledby="delivery-title" className="bg-[var(--bg)]">
      <div className="container-wide section-y">
        <Reveal className="flex flex-col items-center gap-5 text-center sm:gap-6">
          <RevealItem>
            <span className="eyebrow">配送服务</span>
          </RevealItem>
          <RevealItem
            as="h2"
            id="delivery-title"
            className="display-section text-[var(--ink)]"
          >
            送水这件事，
            <br />
            我们能说清每一步。
          </RevealItem>
        </Reveal>

        {/* 移动端竖排时间线 / 桌面横排 */}
        <Reveal className="mt-14 sm:mt-24">
          <ol className="relative flex flex-col sm:grid sm:grid-cols-5 sm:gap-4">
            {/* 桌面横线：穿过节点中心 */}
            <span
              aria-hidden
              className="absolute left-0 right-0 top-[18px] hidden h-px bg-[var(--hairline)] sm:block"
            />
            {steps.map((s, i) => (
              <li
                key={s}
                className="relative flex items-start gap-4 pb-8 last:pb-0 sm:flex-col sm:items-center sm:gap-4 sm:pb-0 sm:text-center"
              >
                {/* 移动端竖线：自节点底部贯穿至下一节点，形成连续时间线 */}
                {i < steps.length - 1 ? (
                  <span
                    aria-hidden
                    className="absolute bottom-0 left-[17px] top-9 w-px bg-[var(--hairline)] sm:hidden"
                  />
                ) : null}
                <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--hairline-strong)] bg-[var(--bg)] text-[12px] tabular-nums text-[var(--ink-soft)]">
                  0{i + 1}
                </span>
                <span className="pt-2 text-[15px] font-medium text-[var(--ink)] sm:pt-0">
                  {s}
                </span>
              </li>
            ))}
          </ol>
        </Reveal>

        {/* 配送口径 + 本地下沉入口 */}
        <Reveal className="mt-14 flex flex-col items-center gap-6 sm:mt-24">
          <RevealItem>
            <hr className="h-px w-16 border-0 bg-[var(--hairline-strong)]" />
          </RevealItem>
          <RevealItem>
            <p className="max-w-xl text-center text-[15px] leading-relaxed text-[var(--ink-soft)] sm:text-[16px]">
              覆盖{deliveryAreas}。家庭按周、公司按月，都可以约定固定频次；
              急用与批量用水，提前电话说明即可安排。
            </p>
          </RevealItem>
          <RevealItem>
            <Link
              href="/langfang/"
              className="inline-flex min-h-11 items-center gap-2 text-[14px] font-medium text-[var(--brand)] underline-offset-4 transition-colors hover:underline"
            >
              查看廊坊配送覆盖
              <span aria-hidden>→</span>
            </Link>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
