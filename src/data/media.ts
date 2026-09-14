/**
 * 媒体清单（图片 / 视频）。
 *
 * 重要约定：
 * - 真实图片未到位时，`src: null`，由 `<Figure>` 渲染中性占位块，
 *   并在 DOM 上标记 `data-placeholder="TODO: REPLACE_WITH_REAL_IMAGE"`。
 * - 替换时只改 `src` 字段，组件无需改动。
 * - `alt` 必须填写；无障碍要求。
 * - `ratio` 形如 "16/9" | "4/5" | "3/2" | "1/1" | "3/4"，用于 `aspect-ratio` CSS。
 */

export type MediaItem = {
  id: string;
  src: string | null;
  alt: string;
  ratio: `${number}/${number}`;
  /** 简短说明，用于设计师 / 替换者理解这张图的作用 */
  note: string;
  /** 替换为真实资源后改 false */
  todo: boolean;
};

export const media: Record<string, MediaItem> = {
  // 品牌资产
  "logo-light": {
    id: "logo-light",
    src: "/brand/logo.jpg",
    alt: "美好水业 logo",
    ratio: "1/1",
    note: "彩版 logo，用于浅底（米白 / 辅助底）。来自用户提供 logo.jpg。",
    todo: false,
  },
  "logo-white": {
    id: "logo-white",
    src: "/brand/logo-white.svg",
    alt: "美好水业（白色版）",
    ratio: "1/1",
    note: "白底反白版 logo，用于深色 Section / Footer / favicon。",
    todo: false,
  },

  // 公司实拍（来源：廊商库《VIP 人物专访——尤宝来》，2023-08）
  "about-founder": {
    id: "about-founder",
    src: "/company/founder.jpg",
    alt: "美好水业创始人、总经理尤宝来",
    ratio: "1/1",
    note: "创始人肖像。/about 创始人 Section 主图。",
    todo: false,
  },
  "about-office": {
    id: "about-office",
    src: "/company/office-calligraphy.jpg",
    alt: "美好水业办公室内「传家有道惟忠厚，处事无奇但率真」书法",
    ratio: "4/3",
    note: "办公室字画，对应企业理念。/about 创始人 Section。",
    todo: false,
  },
  "about-warehouse-01": {
    id: "about-warehouse-01",
    src: "/company/warehouse-01.jpg",
    alt: "美好水业库房内整齐码放的桶装水",
    ratio: "3/2",
    note: "库房实景，用于仓储/配送内容。",
    todo: false,
  },
  "about-warehouse-02": {
    id: "about-warehouse-02",
    src: "/company/warehouse-02.jpg",
    alt: "美好水业库房货架与不同品牌的成品水",
    ratio: "3/2",
    note: "库房实景，用于仓储/配送内容。",
    todo: false,
  },
  "about-warehouse-03": {
    id: "about-warehouse-03",
    src: "/company/warehouse-03.jpg",
    alt: "叉车在美好水业库房装卸桶装水",
    ratio: "16/9",
    note: "装卸/配送实景。",
    todo: false,
  },
  "about-storefront-01": {
    id: "about-storefront-01",
    src: "/company/storefront-01.jpg",
    alt: "美好水业门店外景（红色招牌）",
    ratio: "16/9",
    note: "门店实景。",
    todo: false,
  },
  "source-gu-an": {
    id: "source-gu-an",
    src: "/company/source-gu-an.jpg",
    alt: "中国矿泉水之乡——河北固安，矿泉水水源宣传图",
    ratio: "3/2",
    note: "水源地宣传图。/shuineighbor 与 /about 水源内容共用。",
    todo: false,
  },
  "about-csr-01": {
    id: "about-csr-01",
    src: "/company/csr-01.jpg",
    alt: "美好水业「疫情不停 捐赠不止」捐赠现场",
    ratio: "16/9",
    note: "公益 Section：抗疫捐赠。",
    todo: false,
  },
  "about-csr-02": {
    id: "about-csr-02",
    src: "/company/csr-02.jpg",
    alt: "美好水业向疫情防控一线工作者致敬捐赠",
    ratio: "4/3",
    note: "公益 Section：抗疫捐赠。",
    todo: false,
  },
  "about-csr-03": {
    id: "about-csr-03",
    src: "/company/csr-03.jpg",
    alt: "美好水业「风雨同舟 共渡难关」爱心捐赠物资",
    ratio: "4/3",
    note: "公益 Section：爱心捐赠。",
    todo: false,
  },
  "about-csr-04": {
    id: "about-csr-04",
    src: "/company/csr-04.jpg",
    alt: "美好水业向环卫工人爱心捐赠",
    ratio: "3/2",
    note: "公益 Section：向环卫工人捐赠。",
    todo: false,
  },
  "about-honor-01": {
    id: "about-honor-01",
    src: "/company/honor-01.jpg",
    alt: "廊坊市小微企业协会授予的「疫情防控爱心企业」奖牌（2022）",
    ratio: "4/3",
    note: "荣誉墙奖牌。",
    todo: false,
  },
  "about-honor-02": {
    id: "about-honor-02",
    src: "/company/honor-02.jpg",
    alt: "3·15 国际消费者权益日重点推荐品牌牌匾",
    ratio: "4/3",
    note: "荣誉墙奖牌。",
    todo: false,
  },
  "about-honor-03": {
    id: "about-honor-03",
    src: "/company/honor-03.jpg",
    alt: "「守合同 重信用 消费者推荐单位」荣誉证书",
    ratio: "4/3",
    note: "荣誉墙证书。",
    todo: false,
  },
  "about-honor-04": {
    id: "about-honor-04",
    src: "/company/honor-04.jpg",
    alt: "2015 年度「消费者满意示范单位」奖牌",
    ratio: "4/3",
    note: "荣誉墙奖牌。",
    todo: false,
  },
  "about-honor-05": {
    id: "about-honor-05",
    src: "/company/honor-05.jpg",
    alt: "廊坊市「放心消费创建示范单位」与河北省消费者协会「消费者满意示范单位」奖牌",
    ratio: "4/3",
    note: "荣誉墙奖牌。",
    todo: false,
  },
  "about-honor-06": {
    id: "about-honor-06",
    src: "/company/honor-06.jpg",
    alt: "河北省 AAA 级信用优秀单位奖牌",
    ratio: "4/3",
    note: "荣誉墙奖牌。",
    todo: false,
  },

  // 品牌授权资质（官方授权书 / 经销证明）
  "certificate-hengda": {
    id: "certificate-hengda",
    src: "/company/certificates/hengda-bingquan.jpg",
    alt: "恒大冰泉特许直销商授权书（廊坊市美好商贸有限公司）",
    ratio: "3/2",
    note: "/about 与 /brands 品牌授权资质展示：恒大冰泉。",
    todo: false,
  },
  "certificate-wahaha": {
    id: "certificate-wahaha",
    src: "/company/certificates/wahaha.jpg",
    alt: "娃哈哈桶装水特许经销商授权书（廊坊市美好商贸有限公司）",
    ratio: "3/2",
    note: "/about 与 /brands 品牌授权资质展示：娃哈哈。",
    todo: false,
  },
  "certificate-yibao": {
    id: "certificate-yibao",
    src: "/company/certificates/yibao.png",
    alt: "怡宝纯净水廊坊地区销售证明书（廊坊市美好商贸有限公司）",
    ratio: "3/2",
    note: "/about 与 /brands 品牌授权资质展示：怡宝。",
    todo: false,
  },

  // Hero / 02 二十年
  "hero-city-water": {
    id: "hero-city-water",
    src: "/hero/city-water.jpg",
    alt: "清晨的城市社区街景，前方一杯清水，路边停着载满桶装水的配送车",
    ratio: "4/5",
    note: "Hero 大图：水的通透感 + 城市生活感，安静干净。移动端 4/5，>=640px 由调用方传 ratioSm=16/9。",
    todo: false,
  },
  "years-01": {
    id: "years-01",
    src: "/hero/years-01.jpg",
    alt: "早期的桶装水店面，门口整齐码放的桶装水与送水三轮车",
    ratio: "3/4",
    note: "20 年 Section 三图拼贴之一：水站 / 配送 / 廊坊街巷（真实纪实）。",
    todo: false,
  },
  "years-02": {
    id: "years-02",
    src: "/hero/years-02.jpg",
    alt: "美好水业配送员双手抱着桶装水走出楼道",
    ratio: "3/4",
    note: "20 年 Section 三图拼贴之二：配送员 / 桶装水。",
    todo: false,
  },
  "years-03": {
    id: "years-03",
    src: "/hero/years-03.jpg",
    alt: "清晨的廊坊街巷，沿街店铺与远处居民楼",
    ratio: "3/4",
    note: "20 年 Section 三图拼贴之三：廊坊本地。",
    todo: false,
  },

  // 03 我们做什么 hover 图
  "whatwedo-01": {
    id: "whatwedo-01",
    src: "/home/whatwedo-01.jpg",
    alt: "家庭厨房里的饮水机与桶装水，晨光洒在台面上",
    ratio: "4/3",
    note: "我们做什么 · 家庭饮水。",
    todo: false,
  },
  "whatwedo-02": {
    id: "whatwedo-02",
    src: "/home/whatwedo-02.jpg",
    alt: "办公室茶水间的饮水机与整齐摆放的白色水杯",
    ratio: "4/3",
    note: "我们做什么 · 企业饮水。",
    todo: false,
  },
  "whatwedo-03": {
    id: "whatwedo-03",
    src: "/home/whatwedo-03.jpg",
    alt: "商务会议室中为每位与会者备好的饮用水",
    ratio: "4/3",
    note: "我们做什么 · 商务用水。",
    todo: false,
  },
  "whatwedo-04": {
    id: "whatwedo-04",
    src: "/home/whatwedo-04.jpg",
    alt: "整桶塑封的一次性桶装水特写",
    ratio: "4/3",
    note: "我们做什么 · 一次性桶装水。",
    todo: false,
  },

  // 04 家庭
  "home-life": {
    id: "home-life",
    src: "/home/home-life.jpg",
    alt: "家中客厅一角，饮水机旁的小桌上放着水杯与书",
    ratio: "4/5",
    note: "家庭饮水 Section 主图：厨房 / 客厅 / 饮水机，暖光。",
    todo: false,
  },

  // 05 企业
  "office-space": {
    id: "office-space",
    src: "/home/office-space.jpg",
    alt: "可俯瞰城市天际线的现代办公空间与茶水区",
    ratio: "3/2",
    note: "企业与商务 Section 主图：城市商务感，非欧美素材。",
    todo: false,
  },

  // 06 一次性
  "disposable-hero": {
    id: "disposable-hero",
    src: "/home/disposable-hero.jpg",
    alt: "浅色渐变背景上的桶装水产品，四周大量留白",
    ratio: "16/9",
    note: "一次性桶装水 Section 主视觉：产品单品，纯背景 + 强留白。",
    todo: false,
  },

  // 07 水邻居
  "shuineighbor": {
    id: "shuineighbor",
    src: "/home/shuineighbor.jpg",
    alt: "浅薄荷绿色的随身水壶置于明亮台面，旁有绿植与毛巾",
    ratio: "4/5",
    note: "水邻居 Section 主图：年轻 / 轻盈 / 低饱和蓝绿氛围。",
    todo: false,
  },

  // 09 城市
  "city-line-art": {
    id: "city-line-art",
    src: null,
    alt: "廊坊城市抽象线条示意（待替换为更精细版本）",
    ratio: "16/9",
    note: "廊坊城市 Section 背景：抽象 SVG 线条，明确为示意。",
    todo: true,
  },

  // /contact 地图占位
  "map-placeholder": {
    id: "map-placeholder",
    src: null,
    alt: "廊坊市北凤道 399 号位置示意（待替换为真实地图）",
    ratio: "16/9",
    note: "/contact 页面地图占位。",
    todo: true,
  },

};

export const getMedia = (id: string): MediaItem | undefined => media[id];
