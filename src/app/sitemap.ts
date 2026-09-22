import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { listArticles } from "@/lib/content";
import { districts } from "@/data/districts";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  // 站点 trailingSlash: true —— 实际页面 URL 一律以 / 结尾。
  // sitemap 必须与之一致，否则百度每抓一条都要多走一次 308 跳转，白白浪费抓取配额。
  const abs = (path: string) => `${site.url}${path}/`;

  // 注意：/service 为 noindex 占位页，不进 sitemap
  const routes = [
    { path: "", priority: 1 },
    { path: "/langfang", priority: 0.9 },
    { path: "/products", priority: 0.8 },
    { path: "/shuineighbor", priority: 0.8 },
    { path: "/about", priority: 0.7 },
    { path: "/faq", priority: 0.7 },
    { path: "/contact", priority: 0.7 },
    { path: "/news", priority: 0.7 },
    { path: "/brands", priority: 0.6 },
  ].map((r) => ({
    url: abs(r.path),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: r.priority,
  }));

  // 区县落地页矩阵
  const districtRoutes = districts.map((d) => ({
    url: abs(`/langfang/${d.slug}`),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // 资讯文章（来自接口 / 快照，lastModified 用文章日期）
  const articleRoutes = (await listArticles()).map((a) => ({
    url: abs(`/news/${a.slug}`),
    lastModified: new Date(a.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...routes, ...districtRoutes, ...articleRoutes];
}
