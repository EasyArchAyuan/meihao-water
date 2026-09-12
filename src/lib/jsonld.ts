/**
 * JSON-LD 结构化数据。
 * 关键原则：**仅输出真实字段**；未知字段整段省略，不填假值。
 *
 * 详见 docs/phase1-design-system.md §K。
 */

import { site } from "@/data/site";
import { company, primaryPhone, isTodo } from "@/data/company";

/** Organization —— 站点身份 */
export function organizationJsonLd(): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.legalName,
    alternateName: company.brandName,
    url: site.url,
    logo: new URL("/brand/logo.jpg", site.url).toString(),
    slogan: company.slogan,
  };
  return JSON.stringify(data);
}

/** LocalBusiness —— 本地商家（仅当地址/电话等真实字段存在时输出） */
export function localBusinessJsonLd(): string {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Organization"],
    "@id": new URL("/#local-business", site.url).toString(),
    name: company.legalName,
    alternateName: company.brandName,
    url: site.url,
    priceRange: "¥¥",
  };
  // 真实电话才输出（schema.org telephone 用 E.164，不带 tel: 前缀）
  if (primaryPhone?.tel) {
    data.telephone = primaryPhone.tel.replace(/^tel:/, "");
  }
  // 真实地址才输出
  if (company.address && !isTodo(company.address)) {
    data.address = {
      "@type": "PostalAddress",
      streetAddress: company.address,
      addressLocality: "廊坊市",
      addressRegion: "河北省",
      addressCountry: "CN",
    };
  }
  // 成立年份（已确认）
  if (company.establishedYear) {
    data.foundingDate = String(company.establishedYear);
  }
  return JSON.stringify(data);
}
