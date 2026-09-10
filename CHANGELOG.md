# 变更日志

本项目所有值得注意的变更都会记录在本文档。

格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

---

## [1.0.0] — 2026-09-10

美好水业官网 2.0 第一个正式版本。品牌官网 MVP，覆盖品牌叙事、产品服务、
子品牌展示、本地城市服务与联系方式。

### 新增

#### 页面（6 个可用 + 1 个占位）

| 路由 | 说明 |
|---|---|
| `/` | 首页 · 品牌故事型长页面（11 个 Section） |
| `/about` | 关于美好水业（时间线 + 价值主张） |
| `/products` | 产品与服务（自营 5 类 + 代理品牌 strip） |
| `/shuineighbor` | 水邻居子品牌 |
| `/contact` | 联系我们（真实地址 + 3 个电话 + 二维码） |
| `/brands` | 代理品牌（10 个，纯文字列表） |
| `/service` | 配送服务占位页（`noindex`，后续实装） |

#### 首页 11 个 Section

- **Hero** — 「好水，在身边。」居中大标题 + 近满幅大图
- **二十余年** — 深色 Section，`clamp(120px,18vw,260px)` 巨字 + 关键词线
- **我们做什么** — 4 行大行距列表 + hover 大图淡入（非四宫格）
- **家庭饮水** — 文左图右（移动图上文下）
- **企业与商务** — 与上一屏镜像
- **一次性桶装水** — 深色 + 极简代理品牌文字提及
- **水邻居** — 独立蓝绿色系（`--accent-tint` 浅底）
- **配送服务** — 5 步细线流程（桌面横排 / 移动竖排）
- **廊坊城市** — 抽象城市线条 SVG + 关键词列
- **结尾 CTA** — 大留白 + 电话 + 微信服务号二维码
- **Footer** — 深色，TODO 字段整行不输出

#### 设计系统

- 色彩 token（Tailwind 4 `@theme`）：1 主色 `#0D47A1` + 1 辅助色 `#63C9C1` + 黑白灰
- 字号全 `clamp()`：Hero `clamp(42,7.4vw,96)` / Section `clamp(36,5.2vw,72)`
- 间距 `--space-section: clamp(88px,11vw,200px)`
- 动效仅 fade / translateY / scale≤1.04 / navbar blur / hover，统一 `<Reveal>`
- `prefers-reduced-motion` 全局降级

#### 工程

- Next.js 16.3.4（App Router + RSC）+ React 19.2.8 + TypeScript 5（strict）
- Tailwind CSS 4（CSS-first `@theme`）
- Motion 12 + lucide-react
- 数据层 `src/data/`（site / company / products / brands / navigation / media）
- SEO：per-page metadata、canonical、OG（动态生成 1200×630）、robots.txt、sitemap.xml
- 结构化数据：`Organization` + `LocalBusiness`（**仅输出真实字段**）
- 无障碍：skip-link、语义 HTML、`focus-visible` 品牌色描边、全部图片 `alt`

### 真实数据（用户提供，2026-09-10）

- 法定名称：廊坊美好水业有限公司
- 成立时间：1998 年（文案用「二十余年 / 自 1998 年起」，不标具体年份节点）
- 地址：河北省廊坊市广阳区北凤道 399 号
- 订水电话：2805599 / 2232111 / 13393067179（全部 `tel:` 链接）
- 微信公众号：水邻居饮用水
- 代理品牌 10 个：农夫山泉、怡宝、娃哈哈、恒大冰泉、昆仑山、汇源、水邻居天然矿泉水、水立方、冰露、百事可乐

### 合规说明

- 未编造任何电话 / 地址 / 资质 / 荣誉 / 客户数 / 媒体报道
- 代理品牌**仅出现中文名称**，不使用任何品牌商标图（规避版权）
- 未生成 AI 历史照片冒充真实企业历史；11 张图片全部为占位
- 未知字段统一 `TODO: REAL_*`，渲染层跳过输出

### 已知限制

- 11 张业务图片为占位（Hero / 20年×3 / 我们做什么×4 / 家庭 / 企业 / 一次性 / 水邻居 / 城市 / 二维码 / 地图）
- 微信服务号二维码未上传
- ICP 备案号、抖音号未填
- 水邻居独立域名未配置（CTA 暂指向 `#`）
- 4 类自营产品规格未公示（`TODO: REAL_SPEC`）
- `/service` 为占位页
- 未接入任何第三方统计（百度 / GA / Meta Pixel）

---

## 链接

- 设计系统：`docs/phase1-design-system.md`
- 实现记录：`docs/phase2-implementation.md`
- 待办清单：`docs/phase2-implementation.md` §6
