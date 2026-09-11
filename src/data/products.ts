/**
 * 自营产品。规格 / 价格 / 图片等未确认字段一律 `TODO: REAL_*`。
 * 真实数据补充时只改本文件，不动页面。
 */

export type ProductCategory =
  | "home"
  | "office"
  | "business"
  | "disposable"
  | "bottled";

export const products = [
  {
    id: "home-bucket",
    name: "家庭桶装水",
    volume: "TODO: REAL_SPEC",
    category: "home" as ProductCategory,
    desc: "日常的一桶水，准时到家。",
    longDesc: "家里常喝的那一桶，按时送到。",
  },
  {
    id: "office-bucket",
    name: "企业桶装水",
    volume: "TODO: REAL_SPEC",
    category: "office" as ProductCategory,
    desc: "办公室里的水，不该成为要操心的事。",
    longDesc: "办公室、门店、社区都合用。定期配送，不用惦记。",
  },
  {
    id: "business-water",
    name: "商务用水",
    volume: "TODO: REAL_SPEC",
    category: "business" as ProductCategory,
    desc: "会议、接待、门店的常备水。",
    longDesc: "会议、接待、门店。有客人在，水要先备好。",
  },
  {
    id: "disposable",
    name: "一次性桶装水",
    volume: "18L / 19L",
    category: "disposable" as ProductCategory,
    desc: "更轻，更现代。",
    longDesc: "不用回收，也不用清洗。会议和活动里最省事的一种。",
  },
  {
    id: "bottled",
    name: "瓶装水",
    volume: "TODO: REAL_SPEC",
    category: "bottled" as ProductCategory,
    desc: "随身携带，方便即饮。",
    longDesc: "随身带走。会议、差旅、户外都合用。",
  },
] as const;

export type Product = (typeof products)[number];
