import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Figure } from "@/components/ui/Figure";
import { primaryPhone } from "@/data/company";

export function HomeWaterSection() {
  return (
    <section aria-labelledby="home-water-title" className="bg-[var(--bg-alt)]">
      <div className="container-wide section-y">
        <div className="grid items-center gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-20">
          {/* 图片：移动端排在文字上方（DOM 顺序即视觉顺序） */}
          <RevealItem as="div" className="lg:col-span-7 lg:order-2">
            <Figure id="home-life" ratio="4/5" rounded />
          </RevealItem>

          {/* 文字 */}
          <Reveal className="lg:col-span-5 lg:order-1 flex flex-col gap-6 sm:gap-8">
            <RevealItem>
              <span className="eyebrow">家庭饮水</span>
            </RevealItem>
            <RevealItem
              as="h2"
              id="home-water-title"
              className="display-section text-[var(--ink)]"
            >
              每个家，都应该有一桶放心的水。
            </RevealItem>
            <RevealItem>
              <p className="body-lg max-w-md text-[var(--ink-soft)]">
                从厨房到客厅，从清晨的第一杯到深夜的一杯温水。我们负责把水送到门口，你只管生活。
              </p>
            </RevealItem>
            <RevealItem>
              <ButtonLink href={primaryPhone.tel} variant="secondary" size="md">
                立即订水
              </ButtonLink>
            </RevealItem>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
