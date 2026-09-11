import { Reveal, RevealItem } from "@/components/ui/Reveal";

const steps = ["下单", "接单", "配送", "送达", "持续服务"];
const values = ["本地", "及时", "长期", "可靠"];

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
            你负责生活，
            <br />
            我们负责送水。
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

        {/* 关键词 */}
        <Reveal className="mt-14 flex flex-col items-center gap-6 sm:mt-24">
          <RevealItem>
            <hr className="h-px w-16 border-0 bg-[var(--hairline-strong)]" />
          </RevealItem>
          <RevealItem>
            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-10">
              {values.map((v) => (
                <li
                  key={v}
                  className="text-[15px] tracking-wide text-[var(--ink-soft)]"
                >
                  {v}
                </li>
              ))}
            </ul>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
