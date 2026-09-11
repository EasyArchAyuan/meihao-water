import Link from "next/link";
import { Figure } from "@/components/ui/Figure";
import { Reveal, RevealItem, RevealOne } from "@/components/ui/Reveal";
import { brandsIntro } from "@/data/brands";

export function DisposableSection() {
  return (
    <section
      aria-labelledby="disposable-title"
      className="bg-[var(--brand-deep)] text-[var(--on-dark)]"
    >
      <div className="container-wide section-y">
        <Reveal className="flex flex-col items-center gap-5 text-center sm:gap-6">
          <RevealItem>
            <span className="eyebrow !text-[var(--on-dark-soft)]">
              一次性桶装水
            </span>
          </RevealItem>
          <RevealItem
            as="h2"
            id="disposable-title"
            className="display-section text-[var(--on-dark)]"
          >
            更轻，
            <br />
            更现代。
          </RevealItem>
          <RevealItem>
            <p className="body-lg max-w-xl text-[var(--on-dark-soft)]">
              面向企业、会议、商务及现代办公场景的一次性桶装水解决方案。
            </p>
          </RevealItem>
        </Reveal>

        <RevealOne className="mt-12 sm:mt-20">
          <div className="container-site">
            <Figure id="disposable-hero" ratio="4/3" ratioSm="16/9" rounded />
          </div>
        </RevealOne>

        {/* 极简代理品牌文字提及（不展示品牌 logo，规避版权） */}
        <Reveal className="mt-12 flex flex-col items-center gap-4 text-center sm:mt-20">
          <RevealItem>
            <span className="eyebrow !text-[var(--on-dark-soft)]">
              我们同时为廊坊家庭提供
            </span>
          </RevealItem>
          <RevealItem>
            <p className="max-w-2xl text-[15px] leading-relaxed text-[var(--on-dark-soft)] sm:text-[16px]">
              {brandsIntro}
            </p>
          </RevealItem>
          <RevealItem>
            <Link
              href="/brands"
              className="mt-2 inline-flex min-h-11 items-center gap-2 text-[14px] font-medium text-[var(--on-dark)] underline-offset-4 transition-colors hover:underline"
            >
              查看全部代理品牌
              <span aria-hidden>→</span>
            </Link>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
