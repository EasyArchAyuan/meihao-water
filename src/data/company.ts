/**
 * 公司真实信息。未知字段使用 `TODO: REAL_*` 占位字符串，
 * 渲染层（Footer / JSON-LD）需要判断 `value.startsWith("TODO:")` 决定是否输出。
 *
 * 真实数据来源：用户 2026-09-10 确认；2026-09-11 法定名称变更
 *   法定名称：廊坊市美好商贸有限公司（原"廊坊美好水业有限公司"）
 *   成立时间：1998 年
 *   地址：廊坊市北凤道399号（标准化为"河北省廊坊市广阳区北凤道399号"）
 *   订水电话：13393067179（主号） / 2805599 / 2232111
 *   公众号：廊坊桶装水
 */

export const company = {
  legalName: "廊坊市美好商贸有限公司",
  brandName: "美好水业",
  slogan: "好水，在身边。",
  establishedYear: 1998,
  yearsCopy: "二十余年",
  yearsPhrase: "自 1998 年起",
  city: "廊坊",
  /** 标准化后的地址：河北省廊坊市广阳区北凤道399号 */
  address: "河北省廊坊市广阳区北凤道399号",
  /** 原始地址（用户原话），保留备查 */
  rawAddress: "廊坊市北凤道399号",
  phones: [
    {
      label: "手机号",
      number: "13393067179",
      display: "133 9306 7179",
      tel: "tel:+8613393067179",
      primary: true,
    },
    {
      label: "订水热线",
      number: "2805599",
      display: "2805599",
      tel: "tel:+8631642805599",
      primary: false,
    },
    {
      label: "订水热线",
      number: "2232111",
      display: "2232111",
      tel: "tel:+8631642232111",
      primary: false,
    },
  ] as const,
  wechatPublicName: "廊坊桶装水",
  wechatService: "TODO: REAL_WECHAT_ID",
  douyin: "TODO: REAL_DOUYIN_ACCOUNT",
  icp: "TODO: ICP备案完成后填写",
  copyrightYear: 2026,
  shuineighbor: {
    name: "水邻居",
    tagline: "新一代饮水生活品牌。",
    domain: "TODO: REAL_SHUINEIGHBOR_DOMAIN",
  },
} as const;

export type Company = typeof company;
export type Phone = (typeof company.phones)[number];

/** 判断字符串是否为 TODO 占位（用于渲染时跳过字段） */
export const isTodo = (v: string | undefined | null): boolean =>
  typeof v === "string" && v.startsWith("TODO:");

/** 取主订水电话 */
export const primaryPhone: Phone = company.phones.find((p) => p.primary) ?? company.phones[0];
