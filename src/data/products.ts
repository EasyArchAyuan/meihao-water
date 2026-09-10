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
    longDesc: "从厨房到客厅，从清晨的第一杯到深夜的一杯温水。",
  },
  {
    id: "office-bucket",
    name: "企业桶装水",
    volume: "TODO: REAL_SPEC",
    category: "office" as ProductCategory,
    desc: "办公室里的水，不该成为要操心的事。",
    longDesc: "面向企业、办公室、商务空间、门店与社区，定期配送，稳定补给。",
  },
  {
    id: "business-water",
    name: "商务用水",
    volume: "TODO: REAL_SPEC",
    category: "business" as ProductCategory,
    desc: "会议、接待、门店，体面地准备好。",
    longDesc: "面向会议、接待与商务场景，提供稳定、体面的饮水补给。",
  },
  {
    id: "disposable",
    name: "一次性桶装水",
    volume: "18L / 19L",
    category: "disposable" as ProductCategory,
    desc: "更轻，更现代的一次性解决方案。",
    longDesc: "面向企业、会议、商务及现代办公场景的一次性桶装水解决方案。",
  },
  {
    id: "bottled",
    name: "瓶装水",
    volume: "TODO: REAL_SPEC",
    category: "bottled" as ProductCategory,
    desc: "随身携带，方便即饮。",
    longDesc: "便携包装，会议、差旅、户外皆宜。",
  },
] as const;

export type Product = (typeof products)[number];
