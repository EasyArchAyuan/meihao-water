import { Reveal, RevealItem } from "@/components/ui/Reveal";

const steps = ["下单", "接单", "配送", "送达", "持续服务"];
const values = ["本地", "及时", "长期", "可靠"];

export function DeliveryFlow() {
  return (
    <section
      aria-labelledby="delivery-title"
      className="bg-[var(--bg)]"
    >
      <div className="container-wide section-y">
        <Reveal className="flex flex-col items-center gap-6 text-center">
          <RevealItem>
            <span className="eyebrow">配送服务</span>
          </RevealItem>
          <RevealItem as="h2">
            <h2
              id="delivery-title"
              className="display-section text-[var(--ink)]"
            >
              你负责生活，
              <br />
              我们负责送水。
            </h2>
          </RevealItem>
        </Reveal>

        {/* 桌面横排 / 移动竖排 */}
        <Reveal className="mt-20 sm:mt-24">
          <ol
            className="
              relative grid grid-cols-1 gap-10
              sm:grid-cols-5 sm:gap-4
            "
          >
            {/* 桌面横线 */}
            <span
              aria-hidden
              className="absolute left-0 right-0 top-[18px] hidden h-px bg-[var(--hairline)] sm:block"
            />
            {steps.map((s, i) => (
              <li
                key={s}
                className="relative flex flex-row items-start gap-5 sm:flex-col sm:items-center sm:gap-4 sm:text-center"
              >
                {/* 节点 + 序号 */}
                <div className="flex items-center gap-3 sm:flex-col sm:gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--hairline-strong)] bg-[var(--bg)] text-[12px] tabular-nums text-[var(--ink-soft)]">
                    0{i + 1}
                  </span>
                  {/* 移动竖线 */}
                  {i < steps.length - 1 ? (
                    <span
                      aria-hidden
                      className="block h-12 w-px bg-[var(--hairline)] sm:hidden"
                    />
                  ) : null}
                </div>
                <span className="text-[15px] font-medium text-[var(--ink)]">
                  {s}
                </span>
              </li>
            ))}
          </ol>
        </Reveal>

        {/* 关键词 */}
        <Reveal className="mt-20 sm:mt-24 flex flex-col items-center gap-6">
          <RevealItem>
            <hr className="h-px w-16 border-0 bg-[var(--hairline-strong)]" />
          </RevealItem>
          <RevealItem>
            <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
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
