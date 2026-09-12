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

  // Hero / 02 二十年
  "hero-city-water": {
    id: "hero-city-water",
    src: null,
    alt: "城市与水的生活场景（待替换）",
    ratio: "4/5",
    note: "Hero 大图：水的通透感 + 城市生活感，安静干净。移动端 4/5，>=640px 由调用方传 ratioSm=16/9。",
    todo: true,
  },
  "years-01": {
    id: "years-01",
    src: null,
    alt: "老水站历史照片（待替换）",
    ratio: "3/4",
    note: "20 年 Section 三图拼贴之一：水站 / 配送 / 廊坊街巷（真实纪实）。",
    todo: true,
  },
  "years-02": {
    id: "years-02",
    src: null,
    alt: "配送服务照片（待替换）",
    ratio: "3/4",
    note: "20 年 Section 三图拼贴之二：配送员 / 桶装水。",
    todo: true,
  },
  "years-03": {
    id: "years-03",
    src: null,
    alt: "廊坊街巷（待替换）",
    ratio: "3/4",
    note: "20 年 Section 三图拼贴之三：廊坊本地。",
    todo: true,
  },

  // 03 我们做什么 hover 图
  "whatwedo-01": {
    id: "whatwedo-01",
    src: null,
    alt: "家庭饮水场景（待替换）",
    ratio: "4/3",
    note: "我们做什么 · 家庭饮水。",
    todo: true,
  },
  "whatwedo-02": {
    id: "whatwedo-02",
    src: null,
    alt: "办公室饮水场景（待替换）",
    ratio: "4/3",
    note: "我们做什么 · 企业饮水。",
    todo: true,
  },
  "whatwedo-03": {
    id: "whatwedo-03",
    src: null,
    alt: "商务会议场景（待替换）",
    ratio: "4/3",
    note: "我们做什么 · 商务用水。",
    todo: true,
  },
  "whatwedo-04": {
    id: "whatwedo-04",
    src: null,
    alt: "一次性桶装水特写（待替换）",
    ratio: "4/3",
    note: "我们做什么 · 一次性桶装水。",
    todo: true,
  },

  // 04 家庭
  "home-life": {
    id: "home-life",
    src: null,
    alt: "家庭厨房 / 客厅饮水场景（待替换）",
    ratio: "4/5",
    note: "家庭饮水 Section 主图：厨房 / 客厅 / 饮水机，暖光。",
    todo: true,
  },

  // 05 企业
  "office-space": {
    id: "office-space",
    src: null,
    alt: "办公 / 商务空间（待替换）",
    ratio: "3/2",
    note: "企业与商务 Section 主图：城市商务感，非欧美素材。",
    todo: true,
  },

  // 06 一次性
  "disposable-hero": {
    id: "disposable-hero",
    src: null,
    alt: "一次性桶装水产品主图（待替换）",
    ratio: "16/9",
    note: "一次性桶装水 Section 主视觉：产品单品，纯背景 + 强留白。",
    todo: true,
  },

  // 07 水邻居
  "shuineighbor": {
    id: "shuineighbor",
    src: null,
    alt: "水邻居品牌场景（待替换）",
    ratio: "4/5",
    note: "水邻居 Section 主图：年轻 / 轻盈 / 低饱和蓝绿氛围。",
    todo: true,
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

  // 微信服务号二维码
  "wechat-qr": {
    id: "wechat-qr",
    src: null,
    alt: "微信服务号二维码（待替换）",
    ratio: "1/1",
    note: "结尾 CTA 与 /contact 共用：扫码加微信。",
    todo: true,
  },
};

export const getMedia = (id: string): MediaItem | undefined => media[id];
