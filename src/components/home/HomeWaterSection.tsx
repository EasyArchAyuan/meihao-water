import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Figure } from "@/components/ui/Figure";
import { primaryPhone } from "@/data/company";

export function HomeWaterSection() {
  return (
    <section
      aria-labelledby="home-water-title"
      className="bg-[var(--bg-alt)]"
    >
      <div className="container-wide section-y">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
          {/* 文左 */}
          <Reveal className="lg:col-span-5 flex flex-col gap-8">
            <RevealItem>
              <span className="eyebrow">家庭饮水</span>
            </RevealItem>
            <RevealItem as="h2">
              <h2
                id="home-water-title"
                className="display-section text-[var(--ink)]"
              >
                每个家，
                <br />
                都应该有一桶
                <br />
                放心的水。
              </h2>
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

          {/* 图右 */}
          <RevealItem as="div" className="lg:col-span-7">
            <Figure id="home-life" ratio="4/5" rounded />
          </RevealItem>
        </div>
      </div>
    </section>
  );
}
