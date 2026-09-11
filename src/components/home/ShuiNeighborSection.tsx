import { Figure } from "@/components/ui/Figure";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { company, isTodo } from "@/data/company";

export function ShuiNeighborSection() {
  const { shuineighbor } = company;
  const domain = shuineighbor.domain;
  const isDomainKnown = !isTodo(domain);
  const linkProps = isDomainKnown
    ? { href: domain, target: "_blank", rel: "noopener noreferrer" }
    : { href: "#" };

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
              <p className="body-lg max-w-md text-[var(--ink-soft)]">
                订水更简单，喝水这件小事也更轻松。
              </p>
            </RevealItem>
            <RevealItem>
              <a
                {...linkProps}
                className="mt-2 inline-flex min-h-11 items-center gap-2 text-[15px] font-medium text-[var(--accent-text)] underline-offset-4 transition-colors hover:underline"
              >
                了解水邻居
                <span aria-hidden>→</span>
              </a>
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
