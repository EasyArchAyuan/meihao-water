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
  { name: "水邻居天然矿泉水", category: ["桶装水"] },
  { name: "水立方",     category: ["桶装水", "瓶装水"] },
  { name: "冰露",       category: ["瓶装水"] },
  { name: "百事可乐",   category: ["饮料"] },
] as const;

export type AgencyBrand = (typeof agencyBrands)[number];

/** 一句话简述（用于 /products 页底 strip 与首页提及） */
export const brandsIntro = "以下品牌的桶装水与瓶装水，我们都在送。";
