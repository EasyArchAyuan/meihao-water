/**
 * 站点级常量。所有可变的"站点身份"信息统一在此。
 * 注意：未知字段不要编造，使用 `TODO:` 占位字符串并通过渲染逻辑判断是否输出。
 */

export const site = {
  name: "美好水业",
  legalName: "廊坊市美好商贸有限公司",
  domain: "meihaoshuiye.cn",
  url: "https://meihaoshuiye.cn",
  locale: "zh-CN",
  ogLocale: "zh_CN",
  description:
    "美好水业，廊坊本地饮水服务品牌。二十余年，为家庭、企业与商务场景提供桶装水、一次性桶装水、瓶装水及饮水配送服务。",
  shortDescription: "廊坊本地饮水服务品牌",
  keywords: [
    "廊坊桶装水",
    "廊坊送水",
    "廊坊饮用水",
    "廊坊桶装水配送",
    "廊坊瓶装水",
    "美好水业",
    "水邻居",
  ] as string[],
  themeColor: "#0A2540",
} as const;

export type Site = typeof site;
