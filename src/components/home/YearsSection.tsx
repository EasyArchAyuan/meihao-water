import { Reveal, RevealItem, RevealOne } from "@/components/ui/Reveal";
import { company } from "@/data/company";

const keywords = ["廊坊", "家庭", "社区", "企业", "城市生活"];

export function YearsSection() {
  return (
    <section
      aria-labelledby="years-title"
      className="bg-[var(--brand-deep)] text-[var(--on-dark)]"
    >
      <div className="container-wide section-y">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          {/* 左：超大数字 + 副文 */}
          <Reveal className="lg:col-span-7 flex flex-col gap-8">
            <RevealItem>
              <span className="eyebrow !text-[var(--on-dark-soft)]">
                {company.yearsPhrase}
              </span>
            </RevealItem>

            <RevealItem as="h2">
              <span
                id="years-title"
                className="block text-[clamp(120px,18vw,260px)] font-medium leading-[0.95] tracking-[-0.04em] tabular-nums text-[var(--on-dark)]"
              >
                {company.yearsCopy}
              </span>
            </RevealItem>

            <RevealItem>
              <p className="display-sub text-[var(--on-dark)]">
                从一桶水开始，
                <br />
                我们一直在廊坊。
              </p>
            </RevealItem>

            <RevealItem>
              <p className="body-lg max-w-xl text-[var(--on-dark-soft)]">
                二十余年，一桶桶水送进廊坊的家庭、办公室与街巷。我们熟悉这座城，也被这座城熟悉。
              </p>
            </RevealItem>
          </Reveal>

          {/* 右：三图拼贴（占位） */}
          <RevealOne className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="col-span-1 row-span-2">
                <YearFigure id="years-01" ratio="3/4" tall />
              </div>
              <div className="col-span-1">
                <YearFigure id="years-02" ratio="3/4" />
              </div>
              <div className="col-span-1">
                <YearFigure id="years-03" ratio="3/4" />
              </div>
            </div>
          </RevealOne>
        </div>

        {/* 关键词线 */}
        <Reveal className="mt-24 sm:mt-32 flex flex-col gap-8 sm:mt-40">
          <RevealItem>
            <hr className="h-px w-full border-0 bg-[var(--on-dark-soft)]/15" />
          </RevealItem>
          <RevealItem>
            <ul className="flex flex-wrap items-baseline gap-x-8 gap-y-4 text-[var(--on-dark-soft)] sm:gap-x-14">
              {keywords.map((k, i) => (
                <li
                  key={k}
                  className="flex items-baseline gap-3 text-[15px] sm:text-[17px]"
                >
                  <span className="tabular-nums text-[11px] tracking-[0.24em] text-[var(--on-dark-soft)]/60">
                    0{i + 1}
                  </span>
                  <span>{k}</span>
                </li>
              ))}
            </ul>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}

function YearFigure({
  id,
  ratio,
  tall,
}: {
  id: string;
  ratio: `${number}/${number}`;
  tall?: boolean;
}) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-[var(--on-dark-soft)]/10"
      style={{ aspectRatio: ratio.replace("/", " / ") }}
      data-placeholder="TODO: REPLACE_WITH_REAL_IMAGE"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-4 text-center text-[var(--on-dark-soft)]">
        <span className="text-[10px] uppercase tracking-[0.24em]">
          figure-placeholder
        </span>
        <span className="text-[11px]">{id}</span>
        <span className="text-[10px] tabular-nums opacity-60">{ratio}</span>
        {tall ? <span className="text-[10px] opacity-60">tall</span> : null}
      </div>
    </div>
  );
}
