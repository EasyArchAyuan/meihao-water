/**
 * 常见问题（FAQ）——单一数据源。
 *
 * 用途：
 * 1. 渲染 /faq 页面；
 * 2. 生成 `FAQPage` JSON-LD（AI 搜索与搜索引擎引用负信号覆盖的主要抓手）。
 *
 * 内容纪律（务必遵守）：
 * - 只写**已确认**的事实；未确认的口径（时效 / 覆盖区域）从 company.delivery 读，
 *   为 TODO 时降级为中性表述，绝不编造数字。
 * - 不使用「最便宜 / 第一 / 全网最低」等绝对化用语（广告法合规）。
 * - 不点名竞品，不做「原价→现价」对比。
 */

import { company, isTodo, primaryPhone } from "./company";

/** 覆盖区域：未确认时降级 */
export const deliveryAreas = isTodo(company.delivery.areas)
  ? "廊坊市区及周边"
  : company.delivery.areas;

/** 送达时效：未确认时降级 */
export const deliveryLeadTime = isTodo(company.delivery.leadTime)
  ? "以订水时电话确认为准"
  : company.delivery.leadTime;

export type FaqItem = {
  /** 锚点 id，便于站内跳转 */
  id: string;
  /** 分组（用于页面分区） */
  group: "正品与资质" | "卫生与安全" | "配送与时效" | "价格与结算";
  question: string;
  /** 答案：支持多段 */
  answer: string[];
};

export const faqItems: readonly FaqItem[] = [
  {
    id: "authentic",
    group: "正品与资质",
    question: "美好水业送的水是正品吗？",
    answer: [
      "是正规渠道供货。美好水业是廊坊本地的饮用水服务商，代理多个知名品牌的桶装水与瓶装水，均从厂家或授权渠道进货，可提供相应票据。",
      `自有品牌「${company.shuineighbor.name}」天然矿泉水于 2020 年上市，水源来自河北固安，具国家级绿色食品认证，并非代工贴牌的产品线。`,
    ],
  },
  {
    id: "entity",
    group: "正品与资质",
    question: "美好水业是廊坊本地公司吗？和天津的同名公司有关系吗？",
    answer: [
      company.disambiguation,
      `对外品牌名为「${company.brandName}」，在法律文件、票据与备案信息中使用的主体名称为「${company.legalName}」，二者是同一家廊坊本地企业。`,
    ],
  },
  {
    id: "qualification",
    group: "正品与资质",
    question: "公司订水可以开发票吗？有哪些资质？",
    answer: [
      "可以为企业客户提供正规发票，开票信息与纳税主体一致，订水时说明即可。",
      "公司自 1998 年起在廊坊经营，库房 5000 余平米，曾承接河北省辖区内高速公路服务区供水、廊坊开发区部分外企用水，以及北京盒马鲜生的饮用水仓配一体化服务。",
    ],
  },
  {
    id: "sanitation",
    group: "卫生与安全",
    question: "水桶干净吗？怎么清洗消毒的？",
    answer: [
      "循环使用的水桶统一回收后集中处理：清洗、消毒、冲洗、检验后再进入灌装和配送环节，破损或超期使用的桶直接淘汰，不再流入客户家中。",
      "一次性桶装水则是一次性封装、不回收、不重复使用，适合会议、活动等对卫生要求更高的场景。",
    ],
  },
  {
    id: "deposit",
    group: "卫生与安全",
    question: "空桶怎么退？押金能退吗？",
    answer: [
      "空桶由配送员在送水时回收，不需要客户自行处理，也不需要额外预约。",
      "押金与退桶规则以订水时签订的协议或票据为准；订水前可以先电话确认，交付时请保留好票据或电子记录，便于后续核对。",
      `如对押金或退桶有疑问，直接拨打 ${primaryPhone.display}，我们会按票据记录核实处理。`,
    ],
  },
  {
    id: "water-quality",
    group: "卫生与安全",
    question: "桶装水的水质怎么样？开封后能放多久？",
    answer: [
      "所配送的桶装水为正规厂家生产，出厂前有检验流程，桶身标注生产日期与保质期，配送时不拆封、不换桶。",
      "开封后建议尽快饮用，并尽量避免阳光直射与高温环境；饮水机也应定期清洗，具体频次可电话咨询。",
    ],
  },
  {
    id: "lead-time",
    group: "配送与时效",
    question: "下单后多久能送到？",
    answer: [
      `送达时效：${deliveryLeadTime}。`,
      `覆盖区域：${deliveryAreas}。`,
      `急用或批量用水（会议、活动）建议提前电话 ${primaryPhone.display} 说明，便于安排车辆与人员。`,
    ],
  },
  {
    id: "scenes",
    group: "配送与时效",
    question: "家庭和公司都能送吗？",
    answer: [
      `都可以。服务场景包括：${company.delivery.scenes.join("、")}。`,
      `经营品类包括：${company.delivery.categories.join("、")}。公司、门店可按周或按月约定固定配送频次，减少临时缺水的麻烦。`,
    ],
  },
  {
    id: "payment",
    group: "价格与结算",
    question: "怎么计费？有最低起订量吗？",
    answer: [
      "价格按品牌、规格与数量确定，长期合作与批量用水的价格可另行商议；起订量与配送频次在订水时说明即可。",
      `具体报价以电话确认为准：${company.phones.map((p) => p.display).join(" / ")}。`,
    ],
  },
] as const;

/** 分组顺序（页面按此顺序分区） */
export const faqGroups = [
  "正品与资质",
  "卫生与安全",
  "配送与时效",
  "价格与结算",
] as const;
