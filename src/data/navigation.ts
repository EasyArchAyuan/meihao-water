/**
 * 顶部主导航。注意：未实装页面（如 /service）不挂出。
 * /langfang 为本地服务落地页，从首页 CTA 与页脚进入，不占主导航位置。
 */

export type NavItem = {
  label: string;
  href: string;
  /** 是否外链（用于决定 target / rel） */
  external?: boolean;
};

export const primaryNav: readonly NavItem[] = [
  { label: "关于我们", href: "/about" },
  { label: "产品与服务", href: "/products" },
  { label: "水邻居", href: "/shuineighbor" },
  { label: "常见问题", href: "/faq" },
  { label: "联系我们", href: "/contact" },
] as const;

/** 页脚补充入口（主导航未覆盖但需被收录的页面） */
export const footerNav: readonly NavItem[] = [
  { label: "行业资讯", href: "/news" },
  { label: "廊坊桶装水配送", href: "/langfang" },
  { label: "代理品牌", href: "/brands" },
] as const;
