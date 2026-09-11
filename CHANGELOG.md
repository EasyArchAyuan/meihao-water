# 变更日志

本项目所有值得注意的变更都会记录在本文档。

格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

---

## [1.0.1] — 2026-09-11

移动端专项：布局重排、信息层级优化、触控目标与无障碍修正。无新功能、无新页面。

### 修复

- **`/` 结尾 CTA 二维码尺寸** — `w-32 sm:w-36` 原被写入 `Figure` 的 `className`，而 `Figure` 基类含 `w-full` 且 `cn()` 不做冲突消解（编译后 `.w-full` 位于 `.w-32` 之后，同层同优先级后者胜出），导致 <640px 时二维码被撑成整列宽。改为外层容器约束宽度，与 `/contact` 保持一致。
- **`/` 二十年 Section 横向溢出（P0）** — 巨字 `clamp(120px,18vw,260px)` 的下限 120px 在 375px 屏上使 4 字标题达 480px，超出可用宽度 335px 约 145px，触发页面横向滚动。下限下调为 60px：`clamp(60px,15.5vw,220px)`。
- **全站标题嵌套（14 处）** — `RevealItem as="h1"` / `as="h2"` 内部又套同名标签，形成 `<h1><h1>` / `<h2><h2>` 非法结构，破坏文档大纲与无障碍。为 `RevealItem` 增加 `id` 透传，标题改为单层渲染。
- **`/` 我们做什么 · 移动端描述不跟随** — 描述依赖 `onMouseEnter` 更新的 `active` 状态，触摸设备无 hover 导致恒定显示第 1 项描述。改为移动端每行始终渲染自身描述，桌面保留 hover 联动大图。
- **Logo 白色版在深色底不可见** — SVG 经 `<img>` 加载时 `currentColor` 解析为黑色（无法继承父级颜色），且 `viewBox` 为 220:64 却被按 40×40 正方形渲染（被压扁）。改为硬编码白色 + 按实际比例计算宽度，并去掉与 SVG 内置文字重复的额外品牌名。
- **Footer 移动端网格错位** — 3 个栏目放入 `grid-cols-2` 导致「联系」独占第二行左侧、右侧留空。调整为移动端「网站 + 联系」两列，并把「订水电话」独立为移动端优先区块。
- **配送流程移动端断线** — 竖线原为固定 `h-12` 且位于节点右侧，与 `gap-10` 之间断开。改为绝对定位竖线自节点底部贯穿至下一节点。

### 变更

- **移动端信息层级重排**
  - `Hero` 大图由固定 16/9（375px 屏仅约 190px 高）改为移动端 4/5、≥640px 16/9。
  - `Figure` 新增 `ratioSm` 支持响应式比例；`/` 一次性桶装水、`/shuineighbor`、`/contact` 地图等大幅图移动端改为 4/3。
  - `Figure` 占位内容改用容器查询（`@container` + `@max-[200px]`）自适应，小容器（二维码等）只保留单行文案，不再溢出。
  - `Footer` 移动端把「订水电话」提到品牌区之后并以大字号呈现（可点击 `tel:`），「网站 / 联系」并为两列。
  - `Navbar` 移动端新增一键拨号按钮（手机端最高频动作），无需展开菜单。
  - `我们做什么` Section 由「2 列 + `row-span-2` 拼贴」改为 3 列等宽竖图，消除高度错位。
  - 多处移动端间距降级（`gap-16` → `gap-10 sm:gap-16` 等），修正 `sm:mt-32 sm:mt-40` 重复断点。
- **触控目标统一 ≥44px** — Navbar logo / 移动拨号 / 汉堡 / 桌面导航 / 桌面订水按钮、Footer logo / 导航链接 / 电话链接、`/products`「查看全部品牌」、`/brands` 与 `/service` 电话链接。
- **`TelLink`** 非 prominent 字号改 `text-[19px] sm:text-[16px]`（移动端更易读易点）。
- **`/contact`** 电话列表移动端改为带分隔线的纵向排列。
- **`/` 廊坊城市** — 城市线条装饰在移动端隐藏（窄屏会穿过正文且 slice 放大后线条变粗），仅 ≥640px 显示；线条加 `vector-effect: non-scaling-stroke` 使粗细不随缩放变化。

### 移除

- `src/components/ui/SectionHeading.tsx` — 全站零引用，删除。
- `Figure` 中永不生效的兜底 `ASPECT_BASE[ratio] ?? "aspect-[16/9]"`。

### 验证

- `npm run lint` → 0 error 0 warning
- `npm run build` → 14 路由全部静态生成
- 7 个页面 `h1` 唯一、无标题嵌套（编译后 HTML 校验）
- 编译 CSS 含 `min-h-11` / `h-11` / `aspect-[4/5]` / `sm:aspect-[16/9]` / `aspect-square` / `\@container` / `@container not (min-width:200px)` 全部命中
- 320 / 375 / 390 / 414 / 768 五档视口 × 7 页：`documentElement.scrollWidth === clientWidth`，零横向滚动（真实 Chrome via CDP）
- 备注：本轮收尾后的浏览器复验受环境限制（headless Chrome 在本会话不可用），改用编译产物 + 渲染 HTML 静态校验；改动均为宽度中性或收窄，不影响既有溢出结论。

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
- **二十余年** — 深色 Section，巨字（1.0.0 为 `clamp(120px,18vw,260px)`，1.0.1 已下调为 `clamp(60px,15.5vw,220px)`）+ 关键词线
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
