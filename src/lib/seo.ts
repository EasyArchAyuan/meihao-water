/**
 * SEO 元数据构建工具。
 *
 * 设计原则：
 * - 每页 `title` 后缀统一为"｜廊坊本地饮水服务品牌"
 * - 不在 title / description 堆砌关键词
 * - canonical 强制 https + 站点 url
 */

import type { Metadata } from "next";
import { site } from "@/data/site";

type BuildOptions = {
  title: string;
  description?: string;
  path?: string;
  /** 覆盖默认 keywords（一般不必） */
  keywords?: string[];
  /** 不收录（预留页 / service 占位） */
  noindex?: boolean;
};

const SITE_SUFFIX = "｜廊坊本地饮水服务品牌";

export function buildMetadata({
  title,
  description,
  path = "/",
  keywords,
  noindex,
}: BuildOptions): Metadata {
  const fullTitle = title.includes("美好水业") || title.includes(site.name) ? title : `${title}${SITE_SUFFIX}`;
  const desc = description ?? site.description;
  const url = new URL(path, site.url).toString();
  return {
    title: fullTitle,
    description: desc,
    keywords: keywords ?? site.keywords,
    metadataBase: new URL(site.url),
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: site.ogLocale,
      url,
      siteName: site.name,
      title: fullTitle,
      description: desc,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
    },
  };
}
