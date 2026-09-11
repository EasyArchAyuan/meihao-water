import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Figure } from "@/components/ui/Figure";
import { primaryPhone } from "@/data/company";

export function OfficeSection() {
  return (
    <section aria-labelledby="office-title" className="bg-[var(--bg)]">
      <div className="container-wide section-y">
        <div className="grid items-center gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-20">
          {/* 图片：桌面在左，移动端统一图在上 */}
          <RevealItem as="div" className="lg:col-span-7 lg:order-1">
            <Figure id="office-space" ratio="3/2" rounded />
          </RevealItem>

          {/* 文字：桌面在右 */}
          <Reveal className="lg:col-span-5 lg:order-2 flex flex-col gap-6 sm:gap-8">
            <RevealItem>
              <span className="eyebrow">企业与商务</span>
            </RevealItem>
            <RevealItem
              as="h2"
              id="office-title"
              className="display-section text-[var(--ink)]"
            >
              好的饮水，也是办公空间的一部分。
            </RevealItem>
            <RevealItem>
              <p className="body-lg max-w-md text-[var(--ink-soft)]">
                面向企业、办公室、商务空间、门店与社区。定期配送，稳定补给，让饮水这件事从待办清单里消失。
              </p>
            </RevealItem>
            <RevealItem>
              <ButtonLink href={primaryPhone.tel} variant="secondary" size="md">
                商务合作
              </ButtonLink>
            </RevealItem>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
