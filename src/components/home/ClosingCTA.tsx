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
    <section
      aria-labelledby="closing-title"
      className="bg-[var(--bg)]"
    >
      <div className="container-site section-y text-center">
        <Reveal className="flex flex-col items-center gap-10">
          <RevealItem>
            <span className="eyebrow">开始订水</span>
          </RevealItem>

          <RevealItem as="h2">
            <h2
              id="closing-title"
              className="display-hero text-[var(--ink)]"
            >
              好水，
              <br />
              在身边。
            </h2>
          </RevealItem>

          <RevealItem>
            <ul className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:gap-10">
              {entries.map((e) => (
                <li
                  key={e.title}
                  className="flex flex-col items-center gap-1 sm:items-start"
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

          <RevealItem>
            <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
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
          <RevealItem>
            <div className="mt-16 grid w-full max-w-3xl gap-12 sm:mt-20 sm:grid-cols-2 sm:gap-10">
              <div className="flex flex-col items-center gap-4 sm:items-start">
                <span className="eyebrow">订水热线</span>
                <TelLink phone={primaryPhone} prominent />
                <p className="text-[13px] text-[var(--ink-muted)]">
                  廊坊本地 · {company.yearsCopy}
                </p>
              </div>
              <div className="flex flex-col items-center gap-4 sm:items-end">
                <span className="eyebrow">微信服务号</span>
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
