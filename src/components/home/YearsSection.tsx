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
        <div className="grid gap-10 sm:gap-14 lg:grid-cols-12 lg:gap-20">
          {/* 左：超大数字 + 副文 */}
          <Reveal className="lg:col-span-7 flex flex-col gap-6 sm:gap-8">
            <RevealItem>
              <span className="eyebrow !text-[var(--on-dark-soft)]">
                {company.yearsPhrase}
              </span>
            </RevealItem>

            {/*
              移动端字号下限 60px：375px 屏上 4 字 = 240px < 可用 335px，不溢出。
              原 clamp(120px,…) 在 375px 屏取 120px，4 字 480px 会横向溢出。
            */}
            <RevealItem
              as="h2"
              id="years-title"
              className="text-[clamp(60px,15.5vw,220px)] font-medium leading-[0.95] tracking-[-0.045em] tabular-nums text-[var(--on-dark)]"
            >
              {company.yearsCopy}
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

          {/* 右：三图并排（占位）—— 移动端 3 列图片带，桌面同构，不做脆弱的 row-span 拼贴 */}
          <RevealOne className="lg:col-span-5">
            <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
              <YearFigure id="years-01" ratio="3/4" />
              <YearFigure id="years-02" ratio="3/4" />
              <YearFigure id="years-03" ratio="3/4" />
            </div>
          </RevealOne>
        </div>

        {/* 关键词线 */}
        <Reveal className="mt-20 flex flex-col gap-6 sm:mt-32 sm:gap-8 lg:mt-40">
          <RevealItem>
            <hr className="h-px w-full border-0 bg-[var(--on-dark-soft)]/15" />
          </RevealItem>
          <RevealItem>
            <ul className="flex flex-wrap items-baseline gap-x-6 gap-y-3 text-[var(--on-dark-soft)] sm:gap-x-10 sm:gap-y-4 lg:gap-x-14">
              {keywords.map((k, i) => (
                <li
                  key={k}
                  className="flex items-baseline gap-2 text-[14px] sm:gap-3 sm:text-[17px]"
                >
                  <span className="tabular-nums text-[10px] tracking-[0.2em] text-[var(--on-dark-soft)]/60 sm:text-[11px] sm:tracking-[0.24em]">
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

/**
 * 占位图：移动端 3 列时单张仅约 106px 宽，
 * 因此占位文案极简化（仅 TODO + 编号），避免文字溢出小容器。
 */
function YearFigure({
  id,
  ratio,
}: {
  id: string;
  ratio: `${number}/${number}`;
}) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-xl bg-[var(--on-dark-soft)]/10 sm:rounded-2xl"
      style={{ aspectRatio: ratio.replace("/", " / ") }}
      data-placeholder="TODO: REPLACE_WITH_REAL_IMAGE"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 p-1 text-center text-[var(--on-dark-soft)]">
        <span className="text-[9px] uppercase tracking-[0.16em] opacity-70">
          TODO
        </span>
        <span className="text-[10px] tabular-nums opacity-50">
          {id.replace("years-", "")}
        </span>
      </div>
    </div>
  );
}
