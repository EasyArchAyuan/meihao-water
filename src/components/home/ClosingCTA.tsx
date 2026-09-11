import { Figure } from "@/components/ui/Figure";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { TelLink } from "@/components/ui/TelLink";
import { primaryPhone, company } from "@/data/company";

const entries = [
  { title: "家庭订水", desc: "日常一桶水，准时到家。" },
  { title: "企业用水", desc: "办公室里的稳定补给。" },
  { title: "商务合作", desc: "会议、接待、门店与社区。" },
];

export function ClosingCTA() {
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
            className="display-hero text-[var(--ink)]"
          >
            好水，
            <br />
            在身边。
          </RevealItem>

          {/* 移动端：带分隔线的三行清单（左标题 / 右描述），比纵向居中堆叠更易扫读 */}
          <RevealItem as="div" className="w-full">
            <ul className="mx-auto mt-2 flex w-full max-w-md flex-col divide-y divide-[var(--hairline)] text-left sm:max-w-none sm:flex-row sm:justify-center sm:gap-10 sm:divide-y-0 sm:text-center">
              {entries.map((e) => (
                <li
                  key={e.title}
                  className="flex items-baseline justify-between gap-4 py-3.5 first:pt-0 last:pb-0 sm:flex-col sm:items-center sm:gap-1 sm:py-0"
                >
                  <span className="text-[15px] font-medium text-[var(--ink)]">
                    {e.title}
                  </span>
                  <span className="text-[13px] text-[var(--ink-muted)]">
                    {e.desc}
                  </span>
                </li>
              ))}
            </ul>
          </RevealItem>

          <RevealItem as="div" className="w-full">
            <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <ButtonLink href={primaryPhone.tel} size="lg" fullWidthMobile>
                立即订水
              </ButtonLink>
              <ButtonLink
                href="/contact"
                variant="secondary"
                size="lg"
                fullWidthMobile
              >
                联系我们
              </ButtonLink>
            </div>
          </RevealItem>

          {/* 透出电话 + 二维码 */}
          <RevealItem as="div" className="w-full">
            <div className="mt-12 grid w-full max-w-3xl gap-10 border-t border-[var(--hairline)] pt-10 sm:mt-20 sm:grid-cols-2 sm:gap-10 sm:pt-14">
              <div className="flex flex-col items-center gap-3 sm:items-start sm:gap-4">
                <span className="eyebrow">订水热线</span>
                <TelLink phone={primaryPhone} prominent />
                <p className="text-[13px] text-[var(--ink-muted)]">
                  廊坊本地 · {company.yearsCopy}
                </p>
              </div>
              <div className="flex flex-col items-center gap-3 sm:items-end sm:gap-4">
                <span className="eyebrow">微信服务号</span>
                {/* 宽度必须由外层容器约束：Figure 基类含 w-full，且 cn() 不做冲突消解 */}
                <div className="w-32 sm:w-36">
                  <Figure id="wechat-qr" ratio="1/1" rounded />
                </div>
                <p className="text-[12px] text-[var(--ink-muted)]">
                  扫码加微信 · 二维码待替换
                </p>
              </div>
            </div>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
