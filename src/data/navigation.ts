/**
 * 顶部主导航。注意：未实装页面（如 /service）不挂出。
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
  { label: "联系我们", href: "/contact" },
] as const;
