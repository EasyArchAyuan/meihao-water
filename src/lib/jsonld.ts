/**
 * JSON-LD 结构化数据。
 *
 * 关键原则：
 * 1. **仅输出真实字段**；未知字段整段省略，不填假值（`isTodo` 判断）。
 * 2. 品牌名与法律主体分离：`name` 用品牌名，`legalName` 用营业执照名称。
 *    旧名「廊坊美好水业有限公司」作为 `alternateName` 保留，帮助搜索引擎 / AI
 *    把旧站旧名与新站主体归并为同一实体（解决 GEO 诊断中的「名称漂移」）。
 * 3. 页面级 Schema（FAQPage / Product）由对应页面注入，不放全局。
 *
 * 详见 docs/phase1-design-system.md §K 与「官网GEO待办」文档。
 */

import { site } from "@/data/site";
import { company, primaryPhone, isTodo } from "@/data/company";
import { faqItems } from "@/data/faq";
import type { ArticleMeta } from "@/lib/content";

/** E.164 电话（schema.org telephone 不带 tel: 前缀） */
const e164 = (tel: string) => tel.replace(/^tel:/, "");

/** 结构化地址（schema.org PostalAddress） */
function postalAddress() {
  const p = company.addressParts;
  return {
    "@type": "PostalAddress",
    streetAddress: p.street,
    addressLocality: p.district,
    addressRegion: `${p.region}${p.city}`,
    addressCountry: p.country,
  };
}

/** Organization —— 站点主体身份（全站注入） */
export function organizationJsonLd(): string {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": new URL("/#organization", site.url).toString(),
    name: company.brandName,
    legalName: company.legalName,
    alternateName: ["廊坊美好水业", "廊坊美好水业有限公司（原名）"],
    url: site.url,
    logo: new URL("/brand/logo.jpg", site.url).toString(),
    slogan: company.slogan,
    description: site.description,
    foundingDate: String(company.establishedYear),
    telephone: company.phones.map((p) => e164(p.tel)),
    address: postalAddress(),
    areaServed: {
      "@type": "AdministrativeArea",
      name: "廊坊市",
    },
    contactPoint: company.phones.map((p) => ({
      "@type": "ContactPoint",
      telephone: e164(p.tel),
      contactType: p.primary ? "customer service" : "sales",
      areaServed: "廊坊市",
      availableLanguage: ["zh-CN"],
    })),
  };

  // 已认证的第三方主页才输出 sameAs
  if (company.sameAs.length > 0) {
    data.sameAs = [...company.sameAs];
  }

  // 关联主体（天津分公司等）：以 subOrganization 声明归属，
  // 帮助 AI / 搜索引擎把企查查上的同名主体归并到本站，而不是当成无关公司。
  if (company.relatedOrganizations.length > 0) {
    data.subOrganization = company.relatedOrganizations.map((o) => ({
      "@type": "Organization",
      name: o.name,
      description: `${company.brandName}${o.relation}`,
    }));
  }

  return JSON.stringify(data);
}

/** LocalBusiness —— 本地商家（全站注入） */
export function localBusinessJsonLd(): string {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Organization"],
    "@id": new URL("/#local-business", site.url).toString(),
    name: company.brandName,
    legalName: company.legalName,
    url: site.url,
    priceRange: "¥¥",
    telephone: e164(primaryPhone.tel),
    address: postalAddress(),
    areaServed: {
      "@type": "AdministrativeArea",
      name: "廊坊市",
    },
  };
  if (company.establishedYear) {
    data.foundingDate = String(company.establishedYear);
  }
  return JSON.stringify(data);
}

/** FAQPage —— 负信号覆盖（仅 /faq 注入） */
export function faqPageJsonLd(): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": new URL("/faq#faq", site.url).toString(),
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer.join(" "),
      },
    })),
  };
  return JSON.stringify(data);
}

/**
 * BlogPosting —— 每篇资讯（仅 /news/[slug] 注入）。
 * 作者与发布者统一挂 Organization：本地商家的文章署名主体，便于实体归并。
 */
export function articleJsonLd(article: ArticleMeta): string {
  const url = new URL(`/news/${article.slug}/`, site.url).toString();
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    dateModified: article.date,
    inLanguage: "zh-CN",
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: {
      "@type": "Organization",
      name: company.brandName,
      legalName: company.legalName,
      url: site.url,
    },
    publisher: {
      "@type": "Organization",
      name: company.brandName,
      legalName: company.legalName,
      url: site.url,
      logo: { "@type": "ImageObject", url: new URL("/brand/logo.jpg", site.url).toString() },
    },
    keywords: article.tags.join(", "),
  };
  if (article.cover) {
    data.image = new URL(article.cover, site.url).toString();
  }
  return JSON.stringify(data);
}

/** BreadcrumbList —— 面包屑（文章页 / 落地页注入，帮助 AI 理解层级） */
export function breadcrumbJsonLd(items: { name: string; path: string }[]): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: new URL(it.path, site.url).toString(),
    })),
  };
  return JSON.stringify(data);
}

/**
 * Product —— 水邻居（仅 /shuineighbor 注入）。
 * 不写价格 / 库存：尚未确认，宁可留空也不填假值。
 */
export function shuineighborProductJsonLd(): string {
  const { shuineighbor } = company;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": new URL("/shuineighbor#product", site.url).toString(),
    name: shuineighbor.fullName,
    alternateName: shuineighbor.name,
    category: shuineighbor.category,
    description: `${shuineighbor.fullName}，${company.brandName}旗下饮用水品牌。水源${shuineighbor.source}。${shuineighbor.facts.join("；")}。`,
    brand: {
      "@type": "Brand",
      name: shuineighbor.name,
      parentOrganization: {
        "@type": "Organization",
        name: company.brandName,
        legalName: company.legalName,
      },
    },
    manufacturer: {
      "@type": "Organization",
      name: company.legalName,
      url: site.url,
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "水源地", value: shuineighbor.source },
      { "@type": "PropertyValue", name: "认证", value: "国家级绿色食品认证" },
    ],
  };
  // 域名确认后才输出独立官网链接
  if (!isTodo(shuineighbor.domain)) {
    data.url = shuineighbor.domain;
  }
  return JSON.stringify(data);
}
