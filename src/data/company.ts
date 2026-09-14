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
  /**
   * 结构化地址（GEO 实体锚点）。
   * `address` 为展示用完整地址，此处拆分为 schema.org PostalAddress 各字段。
   */
  addressParts: {
    country: "CN",
    region: "河北省",
    city: "廊坊市",
    district: "广阳区",
    street: "北凤道399号",
  },
  /**
   * 配送服务事实（`TODO:` 表示尚未确认，渲染层降级为中性表述，绝不编造）。
   * 确认后只改这里，FAQ / 落地页 / JSON-LD 全站生效。
   */
  delivery: {
    /** 覆盖区域口径 */
    areas: "TODO: REAL_DELIVERY_AREAS",
    /** 送达时效口径 */
    leadTime: "TODO: REAL_LEAD_TIME",
    /** 已确认的服务场景 */
    scenes: ["家庭", "公司", "社区", "门店", "会议"],
    /** 已确认的经营品类 */
    categories: ["桶装水", "一次性桶装水", "瓶装水", "饮水机"],
  },
  /**
   * 实体关联说明：企查查等平台存在「美好水业（天津）有限公司」。
   * 该主体是我方在天津地区的业务关联公司，与廊坊总部同属美好水业品牌体系 ——
   * 需在官网明确这一归属，避免 AI / 搜索引擎把它当成无关的同名公司而混淆实体。
   * （注：不写「分公司」—— 注册名以「有限公司」结尾者为独立法人，
   *   工商口径的「分公司」不具独立法人资格、名称形如「XX有限公司天津分公司」。）
   */
  disambiguation:
    "美好水业是廊坊本地的饮用水服务品牌，隶属于廊坊市美好商贸有限公司，自 1998 年起在廊坊经营桶装水配送业务。工商登记中的「美好水业（天津）有限公司」是我方在天津地区的业务关联公司，与廊坊总部同属美好水业品牌体系。",
  /**
   * 关联主体：工商登记中存在这些同名/近名实体，它们是**同一品牌体系的成员**，
   * 不是无关的同名公司。会以 `Organization.subOrganization` 输出，
   * 让 AI / 搜索引擎把企查查上的这些主体与本站归并为同一实体。
   * 留空数组则不输出该字段。
   */
  relatedOrganizations: [
    { name: "美好水业（天津）有限公司", relation: "天津地区业务关联公司" },
  ] as readonly { name: string; relation: string }[],
  /**
   * 已认证的第三方主页链接（抖音 / 58 同城 / 公众号图文等）。
   * 用于 JSON-LD `sameAs`，帮助搜索引擎与 AI 做实体归并。
   * 只填**已认证且可公开访问**的主页；为空时不输出该字段。
   */
  sameAs: [] as readonly string[],
  shuineighbor: {
    name: "水邻居",
    tagline: "新一代饮水生活品牌。",
    domain: "TODO: REAL_SHUINEIGHBOR_DOMAIN",
    /** 全名（用于 Product Schema 与实体消歧） */
    fullName: "水邻居天然矿泉水",
    /** 品类 */
    category: "天然矿泉水",
    /** 水源地 */
    source: "河北固安（中国十大矿泉水之乡）",
    /** 已确认的品质事实 */
    facts: [
      "水源取自河北固安地下深层，天然矿泉水",
      "国家级绿色食品认证",
      "富含锶、偏硅酸等微量元素",
      "2020 年由美好水业自主研发上市",
    ] as readonly string[],
  },
} as const;

export type Company = typeof company;
export type Phone = (typeof company.phones)[number];

/** 判断字符串是否为 TODO 占位（用于渲染时跳过字段） */
export const isTodo = (v: string | undefined | null): boolean =>
  typeof v === "string" && v.startsWith("TODO:");

/** 取主订水电话 */
export const primaryPhone: Phone = company.phones.find((p) => p.primary) ?? company.phones[0];
