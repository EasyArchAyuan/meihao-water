import Link from "next/link";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { listArticles } from "@/lib/content";

/**
 * 首页「最新资讯」区块。
 * 作用：给首页注入更新信号（新文章一发布，首页内容即变化），
 * 并把首页权重导向文章页，形成 首页 → 列表 → 详情 的内链闭环。
 */
export async function NewsTeaser({ limit = 3 }: { limit?: number }) {
  const articles = (await listArticles()).slice(0, limit);
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby="news-teaser-title" className="bg-[var(--bg-alt)]">
      <div className="container-wide section-y">
        <Reveal className="flex flex-col gap-10 sm:gap-14">
          <RevealItem className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4">
              <span className="eyebrow">行业资讯</span>
              <h2 id="news-teaser-title" className="display-section text-[var(--ink)]">
                选水这件事，
                <br />
                我们写过。
              </h2>
            </div>
            <Link
              href="/news/"
              className="inline-flex min-h-11 items-center gap-2 text-[16px] font-medium text-[var(--ink)] underline-offset-4 transition-colors hover:underline"
            >
              全部资讯
              <span aria-hidden>→</span>
            </Link>
          </RevealItem>

          <RevealItem>
            <ul className="grid gap-8 sm:grid-cols-3 sm:gap-10">
              {articles.map((a) => (
                <li key={a.slug} className="flex flex-col gap-3">
                  <time
                    dateTime={a.date}
                    className="tabular-nums text-[12px] tracking-[0.2em] text-[var(--ink-muted)]"
                  >
                    {a.date}
                  </time>
                  <Link
                    href={`/news/${a.slug}/`}
                    className="text-[18px] font-medium leading-snug tracking-tight text-[var(--ink)] underline-offset-4 transition-colors hover:underline sm:text-[20px]"
                  >
                    {a.title}
                  </Link>
                  {a.excerpt ? (
                    <p className="line-clamp-3 text-[14px] leading-relaxed text-[var(--ink-soft)]">
                      {a.excerpt}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
