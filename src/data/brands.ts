/**
 * 代理品牌：廊坊美好水业为以下品牌提供廊坊区域代理 / 配送服务。
 *
 * ⚠️ 合规约束：
 * 1. 仅出现品牌中文名称（合理使用 / 事实陈述）。
 * 2. 严禁使用任何品牌 logo / 商标图，避免未经授权使用。
 * 3. 严禁暗示与品牌方存在除代理 / 经销之外的关联。
 * 4. 数据来源：用户 2026-09-10 确认；2026-09-12 据廊商库《VIP 人物专访——尤宝来》
 *    补充「雀巢 / 景田 / 甘露」。自有品牌「水邻居」「美好水一族」不列在此（非代理）。
 */

export const agencyBrands = [
  { name: "农夫山泉",   category: ["桶装水", "瓶装水"] },
  { name: "怡宝",       category: ["桶装水", "瓶装水"] },
  { name: "娃哈哈",     category: ["桶装水", "瓶装水"] },
  { name: "雀巢",       category: ["桶装水", "瓶装水"] },
  { name: "景田",       category: ["桶装水", "瓶装水"] },
  { name: "甘露",       category: ["桶装水", "瓶装水"] },
  { name: "恒大冰泉",   category: ["桶装水", "瓶装水"] },
  { name: "昆仑山",     category: ["桶装水", "瓶装水"] },
  { name: "汇源",       category: ["桶装水", "瓶装水"] },
  { name: "水邻居饮用天然水", category: ["桶装水"] },
  { name: "水立方",     category: ["桶装水", "瓶装水"] },
  { name: "冰露",       category: ["瓶装水"] },
  { name: "百事可乐",   category: ["饮料"] },
] as const;

export type AgencyBrand = (typeof agencyBrands)[number];

/** 一句话简述（用于 /products 页底 strip 与首页提及） */
export const brandsIntro = "以下品牌的桶装水与瓶装水，我们都在送。";

/**
 * 自有品牌（不属于「代理」口径），统计代理条数时必须排除。
 * 注意：`agencyBrands` 目前仍把「水邻居饮用天然水」列在其中，与文件顶部
 * 注释「自有品牌不列在此」不一致 —— 该清单的取舍待确认，暂不改动，
 * 但对外数字一律用下面的 `agencyBrandCount` 派生，避免把自有品牌算成代理。
 */
const OWN_BRAND_NAMES = ["水邻居", "美好水一族"];

/** 可按对外口径宣称的「代理品牌」条数（已排除自有品牌） */
export const agencyBrandCount = agencyBrands.filter(
  (b) => !OWN_BRAND_NAMES.some((own) => b.name.startsWith(own)),
).length;

/** 品类展示顺序：桶装水 → 瓶装水 → 饮料 */
export const brandCategoryOrder = ["桶装水", "瓶装水", "饮料"] as const;

/** 按品类分组后的品牌名（/brands 与首页共用，保证两处口径一致） */
export const agencyBrandsByCategory: readonly {
  category: string;
  names: readonly string[];
}[] = brandCategoryOrder.map((category) => ({
  category,
  names: agencyBrands
    .filter((b) => (b.category as readonly string[]).includes(category))
    .map((b) => b.name),
}));

/**
 * 品牌授权资质展示。
 * 仅放用户已提供书面授权书 / 经销证明书的品牌；无授权书的品牌不列。
 */
export const brandAuthorizations = [
  {
    id: "auth-hengda",
    brand: "恒大冰泉",
    mediaId: "certificate-hengda",
    label: "特许直销商授权书",
  },
  {
    id: "auth-wahaha",
    brand: "娃哈哈",
    mediaId: "certificate-wahaha",
    label: "桶装水特许经销商授权书",
  },
  {
    id: "auth-yibao",
    brand: "怡宝",
    mediaId: "certificate-yibao",
    label: "廊坊地区销售证明书",
  },
] as const;
