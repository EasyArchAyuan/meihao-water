# 美好水业官网 2.0 — Phase 1：设计系统与首页信息架构

> 本阶段只输出设计决策，不写业务代码。确认后再进入 Phase 2（项目搭建）。
> 原则：品牌表达优先于信息密度；真实性优先于页面完整；未知数据一律 `TODO`。

---

## A. 首页完整信息架构

```
/ 首页（品牌故事型长页面，单列叙事，10 个 Section）

00  Navbar          固定顶部，滚动后毛玻璃；移动端汉堡菜单
01  Hero            好水，在身边。            （米白 #F7F8F5）
02  20年            约20年 · 从一桶水开始     （深色 #0B1F2A）
03  我们做什么       一桶水，连接每一天的生活   （米白）
04  家庭饮水         每个家，都该有一桶放心的水 （辅助底 #EEF3F1）
05  企业与商务       好的饮水，也是办公的一部分 （米白）
06  一次性桶装水     更轻，更现代。            （深色 #0B1F2A）
07  水邻居           让订水更简单。            （水邻居浅底 #EDF7F5）
08  配送服务         你负责生活，我们负责送水   （米白）
09  廊坊城市         我们熟悉这座城。          （辅助底 #EEF3F1）
10  结尾 CTA         好水，在身边。            （米白，超大留白）
11  Footer           深色，极简四栏 → 两栏 → 单列
```

节奏说明：深色只出现 **3 次**（02 二十年 / 06 一次性 / Footer），形成「亮—暗—亮—暗」的呼吸感，避免到处深色。
每个 Section **只讲一件事**，Section 之间用「大留白 + 一条发丝线或直接空场」过渡，不做分割装饰。

---

## B. 每个 Section 的视觉构图

| # | Section | 构图 | 背景 |
|---|---|---|---|
| 01 | Hero | 居中大标题 → 副标题 → 辅助文字 → 双按钮；下方一张**近满幅**大图裁切至首屏底部（露出一截，诱导下滑），轻微 parallax | 米白 |
| 02 | 20年 | 左：超大数字「20年」（clamp 到 160–260px）+ 一句副文；右：三张竖图错落拼贴；下方一条贯穿全宽的细线，线上等距排列 5 个关键词 | 深色，文字浅色 |
| 03 | 我们做什么 | 大行距列表：4 行「标题 + 一句话」，行间发丝线；hover（桌面）右侧淡入一张小图。不是四宫格 | 米白 |
| 04 | 家庭饮水 | 左文右图（桌面）/ 上图下文（移动）；图片 4:5，右下方一块米白文字卡片轻微叠压图片 | 辅助底 |
| 05 | 企业与商务 | 与 04 镜像：左图右文，图片 3:2 偏城市商务感；文案块窄，留白更大 | 米白 |
| 06 | 一次性桶装水 | 居中：小标签 → 大标题「更轻，更现代。」→ 一句副文 → 一张产品主视觉（16:9，留白充足） | 深色 |
| 07 | 水邻居 | 居中偏左：品牌名 + 定位句；右侧一张清爽场景图 + 手写感短句；底部一个文字型 CTA（带下划线动效） | 水邻居浅底 |
| 08 | 配送服务 | 横向 5 步流程：一条细线 + 5 个节点，桌面横排、移动竖排；节点仅「文字 + 小圆点」，无图标 | 米白 |
| 09 | 廊坊城市 | 抽象城市线条 SVG 作为背景层（极低对比），前景左文右关键词列 | 辅助底 |
| 10 | CTA | 纯文字：巨大留白 → 主标题两行 → 三个入口（家庭订水 / 企业用水 / 商务合作）→ 双按钮 | 米白 |
| 11 | Footer | 品牌行 + 导航行 + 联系行 + 版权行，四行结构，无装饰 | 深色 |

---

## C. 每个 Section 的标题与正文

**01 Hero**
- 眉标：廊坊 · 本地饮水服务
- H1：好水，在身边。
- 副标题：廊坊本地饮水服务品牌
- 辅助：扎根廊坊约 20 年，从一桶水开始，为家庭、企业与城市生活提供持续、可靠的饮水服务。
- 按钮：立即订水（主）／了解美好水业（次）

**02 20年**
- H2：20年
- 副文：从一桶水开始，我们一直在廊坊。
- 关键词线：廊坊 · 家庭 · 社区 · 企业 · 城市生活
- 注：**不标注具体年份**（如 2006/2026），成立年份在 `data/company.ts` 中留 `TODO: REAL_ESTABLISHED_YEAR`，有真实数据后再决定是否显示年份节点。

**03 我们做什么**
- H2：一桶水，<br/>连接的是每一天的生活。
- 四个条目：
  - 家庭饮水 — 日常的一桶水，准时到家。
  - 企业饮水 — 办公室里的水，不该成为要操心的事。
  - 商务用水 — 会议、接待、门店，体面地准备好。
  - 一次性桶装水 — 更轻，更现代的一次性解决方案。

**04 家庭饮水**
- H2：每个家，<br/>都应该有一桶放心的水。
- 正文：从厨房到客厅，从清晨的第一杯到深夜的一杯温水。我们负责把水送到门口，你只管生活。
- CTA：了解家庭用水 →

**05 企业与商务**
- H2：好的饮水，<br/>也是办公空间的一部分。
- 正文：面向企业、办公室、商务空间、门店与社区。定期配送，稳定补给，让饮水这件事从待办清单里消失。

**06 一次性桶装水**
- 眉标：一次性桶装水
- H2：更轻，更现代。
- 副文：面向企业、会议、商务及现代办公场景的一次性桶装水解决方案。
- 规格：**不写死在页面**，从 `data/products.ts` 读取，未确认字段显示 `TODO: REAL_SPEC`。

**07 水邻居**
- 品牌名：水邻居
- 定位句：新一代饮水生活品牌。
- 文案：让订水更简单，让喝水这件小事，变得更轻松。
- CTA：了解水邻居 →

**08 配送服务**
- H2：你负责生活，<br/>我们负责送水。
- 流程：下单 → 接单 → 配送 → 送达 → 持续服务
- 关键词：本地 · 及时 · 长期 · 可靠（以小字排列在流程下方，不做数字统计）

**09 廊坊城市**
- H2：我们熟悉这座城。
- 副文：20 年，我们把一桶桶水送进廊坊的家庭、办公室和街巷。
- 关键词：廊坊 · 家庭 · 社区 · 企业 · 城市生活
- 注：第一版使用**抽象城市线条**视觉，明确标注为抽象示意，不做行政地图。

**10 结尾 CTA**
- H2：好水，<br/>在身边。
- 入口：家庭订水 / 企业用水 / 商务合作
- 按钮：立即订水（主）／联系我们（次）

**11 Footer**
- 美好水业 · 好水，在身边。
- 导航：关于我们 / 产品与服务 / 水邻居 / 联系我们
- 客服电话：`TODO: REAL_PHONE`｜地址：`TODO: REAL_ADDRESS`
- 微信公众号：廊坊桶装水｜抖音：`TODO: REAL_DOUYIN_ACCOUNT`
- © 2026 美好水业｜备案号：`TODO: ICP备案完成后填写`

---

## D. Color System

```
/* 主色 —— 美好水业 深海蓝 */
--brand:            #0B3C4E;
--brand-deep:       #0B1F2A;   /* 深色 Section / Footer */

/* 辅助品牌色 —— 水邻居 低饱和蓝绿 */
--accent:           #63C9C1;   /* 仅用于图形、细线、水邻居区块 */
--accent-text:      #17786F;   /* 浅底上的可读文字版本 */
--accent-tint:      #EDF7F5;   /* 水邻居区块底色 */

/* 中性 */
--bg:               #F7F8F5;   /* 主背景 暖白/米白 */
--bg-alt:           #EEF3F1;   /* 辅助背景 */
--ink:              #12181C;   /* 主文字，对比度 ≈ 15:1 */
--ink-soft:         #4A545A;   /* 正文次级 */
--ink-muted:        #8A9298;   /* 眉标、说明（仅非关键文字） */
--hairline:         rgba(18,24,28,0.10);
--on-dark:          #F2F5F4;
--on-dark-soft:     rgba(242,245,244,0.66);
```

规则：
1. 全站只有 **1 主色 + 1 辅助色 + 黑白灰**，不引入第三色相。
2. 辅助色 `#63C9C1` **不作为浅底正文色**（对比度不足），仅用于图形/装饰/深色底文字；浅底需文字时用 `#17786F`。
3. 深色区块不超过 3 处，且不与大面积图片叠压文字。
4. 不使用渐变（唯一例外：图片上方的极低透明度保护蒙层 `linear-gradient(rgba(11,31,42,0) 60%, rgba(11,31,42,0.45))` 用于保证文字可读性）。
5. 不使用彩色阴影；阴影仅用于悬浮态按钮/卡片，`0 1px 2px rgba(18,24,28,.04), 0 8px 24px rgba(18,24,28,.06)`。

---

## E. Typography System

字体栈（中文优先系统字，不加载花哨字体；Inter 仅用于英文/数字，通过 `next/font` 子集化）：

```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text",
  "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif;
```

| Token | 规则 | 行高 | 字距 |
|---|---|---|---|
| `display-hero` | `clamp(42px, 7.4vw, 96px)` | 1.04 | -0.03em |
| `display-section` | `clamp(36px, 5.2vw, 72px)` | 1.12 | -0.02em |
| `display-sub` | `clamp(26px, 3.2vw, 44px)` | 1.22 | -0.01em |
| `title` | `clamp(20px, 1.9vw, 28px)` | 1.4 | -0.01em |
| `body-lg` | `clamp(17px, 1.25vw, 21px)` | 1.75 | 0 |
| `body` | `clamp(16px, 1.05vw, 18px)` | 1.75 | 0 |
| `eyebrow` | `12px` | 1.4 | 0.24em |

- 中文大标题做**轻微负字距**，避免松散；小字号眉标做**正字距**，制造高级感。
- 段落宽度上限 `68ch` / `640px`，正文行高 1.7–1.8。
- 数字（20年、18L）使用与正文同一字体族的等宽数字特性 `font-variant-numeric: tabular-nums`。
- 禁止：字重超过 700 的中文黑体粗体堆砌、艺术字体、全大写英文装饰。

---

## F. Spacing System

```
--space-section:  clamp(88px, 11vw, 200px);  /* Section 上下留白 */
--space-block:    clamp(48px, 6vw, 112px);   /* Section 内块间距 */
--space-element:  clamp(20px, 2.4vw, 40px);  /* 元素间距 */
--gutter:         clamp(20px, 4.5vw, 64px);  /* 左右安全边距 */
--container:      1240px;                    /* 内容容器 */
--container-wide: 1600px;                    /* 满幅媒体 */
--text-col:       640px;                     /* 阅读列宽 */
```

- 桌面 Section padding：120–200px；移动：80–120px。**不为缩短页面而压缩留白**。
- 首屏之后第一个 Section 顶部留白取上限，形成「开场呼吸」。
- 栅格：桌面 12 列 / 平板 8 列 / 移动 4 列，但首页以「单列叙事 + 少量左右分栏」为主，不暴露栅格感。

---

## G. Responsive Strategy

断点：`sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536`（Tailwind 默认，不额外造断点）

| 维度 | 移动 375–414 | 平板 768 | 桌面 ≥1024 |
|---|---|---|---|
| 导航 | Logo + 汉堡，全屏菜单 | Logo + 汉堡 | 横排导航 + 右侧「立即订水」 |
| Hero 标题 | 42–46px | 56px | 72–96px |
| 图片比例 | 4:5 / 1:1（竖构图） | 4:3 | 3:2 / 16:9，Hero 图近满幅 |
| 分栏 | 全部单列，图上文下 | 部分 2 栏 | 左右分栏（04 文左图右 / 05 图左文右） |
| Section 间距 | 88–112px | 120px | 160–200px |
| CTA 按钮 | 纵向全宽 | 横向 | 横向 |
| 动效 | 关闭 parallax，仅 fade | 轻量 | 完整 |
| 触控目标 | ≥44px | ≥44px | — |

移动端不是桌面缩小：重排图片比例、重排流程方向（横向流程 → 竖向时间线）、加大点击区域、导航重构。

---

## H. Animation Strategy

**允许**：fade in、translateY、scale（≤1.04）、图片轻微 parallax（≤40px 位移）、navbar blur、hover。
**禁止**：无限旋转、弹跳、粒子、3D、鼠标跟随、满屏同时动、loading 动画。

```
--ease-out: cubic-bezier(0.22, 1, 0.36, 1);
--dur-fast: 400ms;   /* hover */
--dur-base: 600ms;   /* 文字/元素入场 */
--dur-slow: 900ms;   /* 大图 reveal / 视差 */
```

- 统一由 `<Reveal>` 组件驱动：`IntersectionObserver`（Motion `whileInView`，`once: true`，`amount: 0.25`），子元素可做 60–80ms 的 stagger。
- 入场：`opacity 0→1` + `translateY 24px→0`（大图为 `scale 1.04→1`）。
- Hero 首屏内容**不做 whileInView**，直接入场（避免 LCP 元素被延迟）。
- 全局尊重 `prefers-reduced-motion: reduce`：所有位移/缩放归零，仅保留 opacity 或不播放。
- 移动端与低端设备（`navigator.hardwareConcurrency <= 4`）关闭 parallax。

---

## I. Component Tree

```
app/
  layout.tsx                 # 字体、metadata、JSON-LD、skip-link
  page.tsx                   # 首页（Server Component，按 Section 组装）
  about|products|shuineighbor|contact/page.tsx   # Phase 3 后续
  robots.ts
  sitemap.ts
  icon.svg / opengraph-image (占位 TODO)

components/
  layout/
    Navbar.tsx               # client：滚动毛玻璃
    MobileMenu.tsx           # client：全屏菜单 + 焦点锁定
    Footer.tsx               # server
  ui/
    Reveal.tsx               # 统一入场动效（含 id 透传，用于 aria-labelledby）
    ButtonLink.tsx           # 主/次/文字型三种，统一 focus ring
    Figure.tsx               # 唯一图片出口：真实图 or 占位（带 TODO 标记）
    Hairline.tsx             # 发丝线（可选）
  home/
    Hero.tsx
    YearsSection.tsx
    WhatWeDo.tsx
    HomeWaterSection.tsx
    OfficeSection.tsx
    DisposableSection.tsx
    ShuiNeighborSection.tsx
    DeliveryFlow.tsx
    CitySection.tsx
    ClosingCTA.tsx

data/
  site.ts        # 站点名、URL、导航、SEO 默认值
  company.ts     # name / description / phone / address / wechat / douyin / establishedYear
  products.ts    # name / volume / category / description / image
  media.ts       # 图片清单：id / src(可空) / alt / ratio / note / todo

lib/
  seo.ts         # buildMetadata()
  jsonld.ts      # Organization + LocalBusiness（仅真实字段）
```

约束：
- 首页核心视觉**不使用 shadcn Card 堆叠**；shadcn 仅用于确有需要的基础件（如 MobileMenu 的 Sheet），不形成组件库拼装感。
- 组件保持单一职责，不建 `UniversalMegaSectionRenderer` 之类抽象。
- 所有可变文案/数据从 `data/*` 读取，页面不写死业务信息。

---

## J. 图片需求清单

全部走 `data/media.ts`，未拿到真实图时由 `<Figure>` 渲染中性占位块，并在 DOM 上标记 `data-placeholder="TODO: REPLACE_WITH_REAL_IMAGE"`。

| id | 用途 | 比例 | 风格要求 |
|---|---|---|---|
| `hero-city-water` | Hero 大图 | 16:9（桌面）/ 4:5（移动） | 大面积留白、自然光、水的通透感 + 城市生活感，安静干净 |
| `years-01/02/03` | 20年 三图拼贴 | 3:4 ×3 | 老水站 / 配送 / 廊坊街巷，真实纪实感，暖光低饱和 |
| `whatwedo-01~04` | 我们做什么 hover 图 | 4:3 ×4 | 家庭、办公室、会议、一次性桶特写 |
| `home-life` | 家庭饮水主图 | 4:5 | 真实家庭场景：厨房/客厅/饮水机，暖光 |
| `office-space` | 企业与商务主图 | 3:2 | 城市商务办公/门店，非廉价素材、非欧美脸孔素材 |
| `disposable-hero` | 一次性桶装水主视觉 | 16:9 | 产品单品，纯背景、强留白、硬光质感 |
| `shuineighbor` | 水邻居场景 | 4:5 | 年轻清爽、轻盈、低饱和蓝绿氛围 |
| `city-line-art` | 廊坊城市抽象线条 | — | **SVG 抽象线条**，明确标注为示意，非行政地图 |
| `og-image` | Open Graph | 1200×630 | 米白底 + 品牌字，最小装饰 |

图片规则：自然、高级、克制、真实、暖光、低饱和；禁止 AI 水滴图、廉价图库、欧美办公场景、虚假企业现场。统一由 `next/image` 输出 WebP/AVIF，Hero 图 `priority`，其余 `loading="lazy"`，全部显式 `width/height` 或 `fill + aspect-ratio` 防 CLS。

---

## K. SEO 基础方案

- `metadataBase` = `https://meihaoshuiye.cn`，每页 `title / description / alternates.canonical / openGraph / twitter`。
- 首页 Title：`美好水业｜廊坊本地饮水服务品牌`
- 首页 Description：`美好水业，扎根廊坊本地约20年，为家庭、企业及商务场景提供桶装水、一次性桶装水及饮水配送服务。`
- 关键词自然分布于 H1/H2、首段与 alt：廊坊桶装水、廊坊送水、廊坊饮用水、廊坊桶装水配送、美好水业、水邻居。**不堆砌**。
- `app/robots.ts` + `app/sitemap.ts`（含 5 个页面，`/service` 预留但不列入）。
- `opengraph-image` 占位 1200×630（`TODO: REPLACE_WITH_REAL_IMAGE`）。
- 结构化数据：`Organization` + `LocalBusiness`（`@type: ["Organization","LocalBusiness"]`），**仅输出真实字段**；`telephone / address / foundingDate` 未确认时**整个字段省略**，不填假值。
- 语义化：`header / nav / main / section / footer` + 单页唯一 `h1` + 层级化 `h2/h3`；全部图片 `alt`；Skip link；focus-visible 2px 品牌色描边。
- 不接入任何第三方统计脚本（百度/GA/Pixel 一期全部不做）。

---

## 待确认（确认后再进入 Phase 2）

1. 真实信息：客服电话、公司地址、成立年份、抖音号、ICP 备案号（可后续填，但会影响 Footer 与 JSON-LD 的字段是否输出）。
2. 真实照片：是否已有一批水站/配送/产品实拍？若没有，Phase 2 先全量占位。
3. 「立即订水」入口一期指向哪里：电话拨号 / 微信二维码 / 小程序（占位链接）？
4. 水邻居是否使用独立域名或独立视觉域名（影响后续路由与 OG）。
5. 是否确认 Next.js 16 + Tailwind 4 的当前可用版本（Phase 2 搭建时以官方最新为准）。

---

## 附录（2026-09-10 用户确认后追加）

### A. 真实数据已落地

```ts
// data/company.ts 关键值
legalName:        "廊坊市美好商贸有限公司"   // 2026-09-11 法定名称变更（原"廊坊美好水业有限公司"）
establishedYear:  1997        // → 2026 实际 28 年，文案改用 "二十余年 / 自 1997 年起"
address:          "河北省廊坊市广阳区北凤道399号"  // 用户原始："廊坊市北凤道399号"
phones:           ["13393067179"(主号), "2805599", "2232111"]  // 全部真实订水电话；主号 2026-09-12 改为手机号
wechatPublic:     "廊坊桶装水"   // 2026-09-12 更名（原"水邻居饮用水"）
shuineighbor:     { name: "水邻居", domain: "TODO: REAL_DOMAIN" }
```

### B. 代理品牌（已确认 10 个）

`data/brands.ts` 已落地：**农夫山泉 / 怡宝 / 娃哈哈 / 恒大冰泉 / 昆仑山 / 汇源 / 水邻居饮用天然水 / 水立方 / 冰露 / 百事可乐**。
新增 `/brands` 页面（极简纯文字列表，无品牌 logo 图，规避版权）；`/products` 底部加品牌 strip；首页 06 一次性桶装水 Section 文末极简文字提及。

### C. Token 修正（3 处微调）

| Token | Phase 1 旧值 | Phase 2 实际值 | 说明 |
|---|---|---|---|
| `--brand` | `#0B3C4E` | **`#0D47A1`** | 取自 logo.jpg 下半的深海军蓝 |
| `--brand-bright` | — | **`#1E88E5`** | 取自 logo.jpg 上半的亮蓝；仅 logo / favicon / 极小装饰 |
| `--brand-deep` | `#0B1F2A` | **`#0A2540`** | 深色 Section / Footer 底色，与新主色协调 |
| `--ink` | `#12181C` | **`#0A1A2A`** | 与新主色协调 |
| `--accent` / `--accent-tint` / `--accent-text` | 不变 | 不变 | 水邻居色系 |
| `--bg` / `--bg-alt` | 不变 | 不变 | 米白 / 辅助底 |

### D. Logo 渐变豁免

`logo.jpg` 本身（亮蓝 → 深蓝渐变 + 书法"美好水业" + 白底"水"字符）作为品牌资产保留原貌。
深色 Section / Footer 使用自制的 `public/brand/logo-white.svg`（抽象"水"字符 + 字标文字）。
**注意**：该 SVG 经 `<img>` 引用，内部 `currentColor` 无法继承父元素颜色（会解析为黑色），因此颜色**硬编码为白色**，不要改回 `currentColor`。
全站 CSS 仍**严格禁止**渐变（唯一例外是图片保护蒙层）。

### E. 决策记录

- **CTA "立即订水"** 全部指向 `tel:+8631642805599`（主号码），3 个电话均以 `tel:` 链接渲染。
- **结尾 CTA / contact 页面** 透出电话 + 微信服务号二维码（占位，TODO 替换）。
- **水邻居域名** 暂用 `#`，待用户提供；届时改 `data.company.shuineighbor.domain` 即可。
- **图片** 一律全量占位（9 张业务图 + 1 个微信二维码 + 1 个地图），统一走 `<Figure>` 组件 + `data-placeholder="TODO: REPLACE_WITH_REAL_IMAGE"` 标记。
- **代理品牌** 严格仅出现品牌中文名，**不使用任何品牌商标 / logo 图**。
- **真实 1997 年** ⇒ 02 Section 改用「二十余年 / 自 1997 年起」，不标注具体年份节点，避免与实际 28 年产生不一致。
- **Phase 2 实现** 详见 `docs/phase2-implementation.md`。

---

## 附录 2（v1.0.1 修订，2026-09-11）

移动端专项对本文档中若干设计规定的落地方式做了调整，**设计原则未变**，此处记录偏差以便后续维护。

### A. 02 二十年的巨字下限

| | 值 |
|---|---|
| 原设计（Phase 1 / v1.0.0） | `clamp(120px, 18vw, 260px)` |
| 现设计（v1.0.1） | `clamp(60px, 15.5vw, 220px)` |

原因：原下限 120px 在 375px 屏上使 4 字标题宽 480px，超出可用 335px，触发横向滚动。
现下限 60px 在 375px 屏下 4 字约 232px，保留视觉冲击力的同时不溢出。

### B. 移动端图片比例（原为单一 16:9）

Phase 1 约定"移动端 4:5 / 1:1"但未在 `Figure` 层实现，v1.0.1 补上 `ratioSm` 机制：

| 用途 | 移动端 | ≥640px |
|---|---|---|
| Hero 大图 | `4/5` | `16/9` |
| 一次性桶装水 / 水邻居页主图 / 地图 | `4/3` | `16/9` |
| 家庭饮水 / 水邻居 Section | `4/5` | `4/5` |
| 二十年三图 | `3/4` × 3 列 | `3/4` × 3 列 |

### C. 移动端装饰策略（新增原则）

窄屏下若装饰元素（如 09 廊坊城市的抽象线条）会穿过正文、或因 `preserveAspectRatio="slice"` 放大而变粗，则**移动端隐藏**，仅 ≥640px 显示。优先保证文字可读性，不为了"有视觉"而牺牲阅读。

### D. 移动端信息优先级（新增原则）

手机端把最高频动作前置并放大：

- `Navbar` 增加一键拨号按钮（无需展开菜单）。
- `Footer` 把「订水电话」提到品牌区之后，用 `clamp(22px,6.4vw,28px)` 大字号呈现。
- `/contact` 电话列表改为带分隔线的纵向排列，非 prominent 字号提到 19px。

### E. 组件增删

- **新增能力**：`RevealItem` 支持 `id` 透传（用于 `<section aria-labelledby>` 指向真实标题）；`Figure` 支持 `ratioSm` + 容器查询占位；`Figure` 的 `note` 不再直接显示（移入 `title` / `data-note`）。
- **移除**：`ui/SectionHeading.tsx`（全站零引用）。
- **约定**：`Figure` 的 `className` **不要用于控制宽度** —— 基类含 `w-full` 且 `cn()` 不做冲突消解，宽度须由外层容器约束。若未来确需允许覆盖，应引入 tailwind-merge。

### F. 触控目标基线（新增原则）

移动端可点击元素统一 `min-h-11`（44px）。`sr-only` 的 skip-link 豁免。

