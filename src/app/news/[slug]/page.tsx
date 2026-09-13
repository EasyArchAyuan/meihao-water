import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { getArticle, listArticles, relatedArticles } from "@/lib/content";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { TelLink } from "@/components/ui/TelLink";
import { company, primaryPhone } from "@/data/company";

type Params = { slug: string };

/** 静态导出：构建期枚举全部文章 */
export async function generateStaticParams(): Promise<Params[]> {
  return (await listArticles()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "文章不存在" };
  return buildMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/news/${article.slug}/`,
    keywords: article.tags.length > 0 ? article.tags : undefined,
    type: "article",
    publishedTime: article.date,
    ...(article.cover ? { ogImage: article.cover } : {}),
  });
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const related = await relatedArticles(slug, 3);

  return (
    <>
      <Navbar />
      <main id="main" className="bg-[var(--bg)] pt-16 sm:pt-[72px]">
        {/* 文章头 */}
        <article className="container-site section-y-sm">
          <Reveal className="max-w-3xl">
            <RevealItem as="span" className="eyebrow">
              行业资讯
            </RevealItem>
            <RevealItem as="h1" className="display-sub mt-6 text-[var(--ink)]">
              {article.title}
            </RevealItem>
            <RevealItem>
              <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] tracking-[0.16em] text-[var(--ink-muted)]">
                <time dateTime={article.date} className="tabular-nums">
                  {article.date}
                </time>
                {article.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
                <span>约 {article.wordCount} 字</span>
              </p>
            </RevealItem>
            {article.excerpt ? (
              <RevealItem>
                <p className="body-lg mt-8 text-[var(--ink-soft)]">{article.excerpt}</p>
              </RevealItem>
            ) : null}
          </Reveal>

          {/* 正文：Markdown 在构建期渲染为 HTML（内容由我们自己产出，已转义） */}
          <div
            className="article-body mt-12 max-w-2xl sm:mt-16"
            dangerouslySetInnerHTML={{ __html: article.html }}
          />

          {/* 文末 CTA */}
          <div className="mt-14 flex flex-col gap-6 border-t border-[var(--hairline-strong)] pt-10 sm:mt-20 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-3">
              <span className="eyebrow">{company.brandName}</span>
              <p className="max-w-md text-[15px] leading-relaxed text-[var(--ink-soft)]">
                廊坊本地饮水服务品牌，自 {company.establishedYear} 年起在廊坊经营。订水、开票、退桶，都可以先打电话问清楚。
              </p>
            </div>
            <TelLink phone={primaryPhone} prominent />
          </div>
        </article>

        {/* 相关文章（内链，形成主题簇） */}
        {related.length > 0 ? (
          <section aria-labelledby="related-title" className="bg-[var(--bg-alt)]">
            <div className="container-wide section-y">
              <Reveal className="flex flex-col gap-8">
                <RevealItem>
                  <h2 id="related-title" className="display-sub text-[var(--ink)]">
                    接着看
                  </h2>
                </RevealItem>
                <RevealItem>
                  <ul className="grid gap-6 sm:grid-cols-3 sm:gap-10">
                    {related.map((r) => (
                      <li key={r.slug} className="flex flex-col gap-2.5">
                        <Link
                          href={`/news/${r.slug}/`}
                          className="text-[17px] font-medium leading-snug tracking-tight text-[var(--ink)] underline-offset-4 transition-colors hover:underline"
                        >
                          {r.title}
                        </Link>
                        <span className="tabular-nums text-[12px] tracking-[0.16em] text-[var(--ink-muted)]">
                          {r.date}
                        </span>
                      </li>
                    ))}
                  </ul>
                </RevealItem>
                <RevealItem>
                  <Link
                    href="/news/"
                    className="inline-flex min-h-11 items-center gap-2 text-[16px] font-medium text-[var(--ink)] underline-offset-4 transition-colors hover:underline"
                  >
                    全部资讯
                    <span aria-hidden>→</span>
                  </Link>
                </RevealItem>
              </Reveal>
            </div>
          </section>
        ) : null}
      </main>
      <Footer />

      {/* 结构化数据：BlogPosting + Breadcrumb（必须原生 script 内联） */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: articleJsonLd(article) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbJsonLd([
            { name: "首页", path: "/" },
            { name: "行业资讯", path: "/news/" },
            { name: article.title, path: `/news/${article.slug}/` },
          ]),
        }}
      />
    </>
  );
}
