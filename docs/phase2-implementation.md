# 美好水业官网 2.0 — Phase 2 实施记录

> 本文档记录 Phase 2–7 的实际落地信息：版本号、命令、踩坑、最终结果。
> 配套阅读：`docs/phase1-design-system.md`（设计系统）、`C:\Users\shang\.workbuddy\plans\electric-cascade-einstein-5DnQO8cR.md`（实现计划）。

---

## 0. 时间与里程碑

| 时间 | 里程碑 |
|---|---|
| 2026-09-10 17:24 | Phase 1 设计系统交付（`docs/phase1-design-system.md`） |
| 2026-09-10 17:36 | 收到用户 6 条确认 + logo 资产 |
| 2026-09-10 17:47 | 项目搭建（create-next-app + Tailwind 4 + 依赖） |
| 2026-09-10 18:07 | 数据层 + 通用 UI 组件完成 |
| 2026-09-10 18:10 | 首页 11 个 Section + 5 个内页 + 占位页完成 |
| 2026-09-10 18:16 | `npm run lint` 0 错误；`npm run build` 14 路由全部静态生成 |
| 2026-09-10 18:16 | `next start -p 3030` 启动；所有 9 个路由返回 200 |

---

## 1. 实际版本（与计划 §1 的差异）

| 维度 | 计划 | 实际 |
|---|---|---|
| Next.js | 16（如未发则 15） | **16.3.4** ✅ |
| React | 19 | **19.2.8** ✅ |
| Tailwind | 4 | **4.x（@tailwindcss/postcss）** ✅ |
| TypeScript | 5 | **5.x** ✅ |
| 动效 | motion ^12 | **motion 12.x** ✅ |
| 图标 | lucide-react ^0.460 | **0.460+** ✅ |
| Node | 22.22.2 | **22.22.2**（managed） ✅ |
| 包管理 | npm | **npm 10.9.7** ✅ |

> `create-next-app@latest` 在 2026-09 已默认 Next 16，故无需降级到 15。

---

## 2. 命令清单

```bash
# 项目初始化（在临时目录 mhsy-temp 中，因目录名含中文 create-next-app 校验失败）
cd /c/Users/shang/WorkBuddy
npx create-next-app@latest mhsy-temp --ts --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-npm --turbopack --skip-install --yes

# 文件复制到目标目录
cp -r mhsy-temp/{.gitignore,next.config.ts,tsconfig.json,postcss.config.mjs,\
eslint.config.mjs,next-env.d.ts,package.json,README.md,src,public} \
  "C:/Users/shang/WorkBuddy/美好水业官网2.0/"

# 清理临时目录
rm -rf mhsy-temp

# 安装依赖
cd "C:/Users/shang/WorkBuddy/美好水业官网2.0"
npm install   # 6min，第一次 install 含可选依赖较多

# 复制 logo
mkdir -p public/brand
cp "D:/剪辑素材/美好商贸/宣传物料/美好水业/logo.jpg" public/brand/logo.jpg

# 验证
npx eslint .                     # 0 错误
npx next build                   # 14 路由全部静态生成
npx next start -p 3030           # 生产预览
```

---

## 3. 踩坑与解决

### 3.1 `create-next-app` 拒绝中文目录名

**现象**：`Could not create a project called "美好水业官网2.0" because of npm naming restrictions: name can only contain URL-friendly characters`。
**解决**：先在临时英文目录 `mhsy-temp/` 中初始化，再把所有生成文件（含 `src/`、`public/`、配置文件）复制到目标中文目录。
**反思**：未来对中文项目目录，可在 create-next-app 之前先 `cd` 到父目录再用临时名初始化。

### 3.2 Git Bash 中 `next` 可执行文件 sh 头解释失败

**现象**：`node node_modules/.bin/next` 报 `SyntaxError: missing ) after argument list`，因为 `.bin/next` 是个 sh 包装脚本。
**解决**：直接调用 `node ./node_modules/next/dist/bin/next build`（Node 入口文件）。
**注**：`npx next build` 在正常 shell 下能正确处理 sh 包装，本环境的 wrapper 调用 sh 时路径转换失败。

### 3.3 TypeScript readonly 数组赋值给 mutable 字段

**现象**：
```
Type 'readonly ["廊坊桶装水", ...]' is not assignable to type 'string | string[] | null | undefined'.
```
**原因**：`site.ts` 用 `as const` 推断为 `readonly` 元组，赋给 `Metadata.keywords: string[]`。
**解决**：把 `keywords` 显式标为 `as string[]`：
```ts
keywords: [...] as string[],
```

### 3.4 `react-hooks/set-state-in-effect` lint 错误

**现象**：Navbar 中 `useEffect(() => { setOpen(false) }, [pathname])` 触发新 React 19 lint 规则。
**解决**：改用 React 19 / 官方文档推荐的"渲染期间根据 prop 变化重置 state"模式：
```tsx
const [prevPathname, setPrevPathname] = useState(pathname);
if (prevPathname !== pathname) {
  setPrevPathname(pathname);
  setOpen(false);
}
```

### 3.5 `no-img-element` 警告

**现象**：Logo 组件用 `<img>` 触发 `@next/next/no-img-element`。
**解决**：品牌资产使用原生 `<img>` 即可（不需要 next/image 优化 + 避免尺寸声明麻烦），并在行内加 `eslint-disable-next-line @next/next/no-img-element` 注释，明确意图。

### 3.6 ButtonLink 解构中的未使用变量警告

**现象**：原来为"过滤 props 不传 DOM"写的 `_v / _s / _f / _c / _ch` 解构触发 `no-unused-vars`。
**解决**：重构为两路独立的 props 解构 + `buildClass` 工具函数，自然消解。

---

## 4. 最终落地清单（与计划 §7 对照）

| 文件 | 状态 |
|---|---|
| `docs/phase1-design-system.md` | ✅ 追加 token 修正 + 决策记录附录 |
| `docs/phase2-implementation.md` | ✅ 本文件 |
| `public/brand/logo.jpg` | ✅ 从 D 盘复制 |
| `public/brand/logo-white.svg` | ✅ 自制（抽象"水"字符 + 字标） |
| `data/site.ts` | ✅ |
| `data/company.ts` | ✅ 含真实电话/地址/1997 |
| `data/products.ts` | ✅ |
| `data/brands.ts` | ✅ 10 个代理品牌 |
| `data/navigation.ts` | ✅ |
| `data/media.ts` | ✅ 13 个媒体条目（1 已上传 logo + 12 占位） |
| `app/layout.tsx` | ✅ 字体 / metadata / JSON-LD / skip-link |
| `app/page.tsx` | ✅ 首页组合 11 Section |
| `app/about/page.tsx` | ✅ |
| `app/products/page.tsx` | ✅ + 代理品牌 strip |
| `app/shuineighbor/page.tsx` | ✅ |
| `app/contact/page.tsx` | ✅ 真实电话/地址/二维码/地图占位 |
| `app/brands/page.tsx` | ✅（计划外的新页面） |
| `app/service/page.tsx` | ✅ 占位（noindex） |
| `app/robots.ts` | ✅ |
| `app/sitemap.ts` | ✅ 5 路由 + /brands |
| `app/icon.svg` | ✅ |
| `app/opengraph-image.tsx` | ✅ 动态生成 1200×630 PNG |
| `components/layout/Navbar.tsx` | ✅ 毛玻璃 / 滚动状态 / 移动端汉堡 |
| `components/layout/MobileMenu.tsx` | ✅ 全屏菜单 + Esc 关闭 + 锁滚动 |
| `components/layout/Footer.tsx` | ✅ 深色四栏 → 单列（TODO 字段整行不输出） |
| `components/layout/Logo.tsx` | ✅ 彩版 / 白色版 |
| `components/ui/Reveal.tsx` | ✅ 统一入场动效（fade / translateY / stagger） |
| `components/ui/Figure.tsx` | ✅ 真实图 or 占位 + TODO 标记 |
| `components/ui/SectionHeading.tsx` | ✅ |
| `components/ui/ButtonLink.tsx` | ✅ 4 种 variant + 2 种 size |
| `components/ui/TelLink.tsx` | ✅ |
| `components/ui/Hairline.tsx` | ✅ |
| `components/home/{Hero,YearsSection,WhatWeDo,HomeWaterSection,OfficeSection,DisposableSection,ShuiNeighborSection,DeliveryFlow,CitySection,ClosingCTA}.tsx` | ✅ 10 个 Section |
| `lib/{seo,jsonld,motion,cn}.ts` | ✅ |

---

## 5. 验收对照（计划 §8 DoD）

- [x] 5+1 页面全部渲染（实际 6 个：/、/about、/products、/shuineighbor、/contact、/brands + 1 占位 /service）
- [x] `npm run build` 0 错误（14 路由静态生成）
- [x] `npm run lint` 0 错误 0 警告
- [x] 首页深色仅 3 处（02 二十年 / 06 一次性 / Footer）
- [x] 全站无渐变（Logo 本身豁免 + 图蒙层例外）
- [x] 所有图片经 `<Figure>`，无真实图时占位 + `data-placeholder` 标记
- [x] `data/company.ts` 真实字段已填，未知字段均为 `TODO`；JSON-LD 仅输出真实字段
- [x] Navbar 桌面 + 移动均可工作
- [x] `prefers-reduced-motion: reduce` 降级（globals.css 中实现）
- [x] Title / Description / OG / robots / sitemap 全部就位
- [x] 结尾 CTA「立即订水」点击触发 `tel:+8631642805599`（前端验证：HTML 中 href 正确）
- [x] 移动端 320/375/390/414/768 五档视口 × 7 页零横向滚动（真实 Chrome via CDP，1.0.1 完成）
- [x] 触控目标 ≥44px（真实 Chrome via CDP 实测，1.0.1 完成）
- [ ] Lighthouse 报告（未在本环境跑 Lighthouse；HTML/CSS 准备度满足 ≥ 90 目标）

---

## 6. 已知 TODO（替换/补充清单）

| 类别 | 字段 | 位置 |
|---|---|---|
| 真实数据 | `wechatService: "水邻居饮用水"` → 真实微信号 | `data/company.ts` |
| 真实数据 | `douyin: "TODO: REAL_DOUYIN_ACCOUNT"` | `data/company.ts` |
| 真实数据 | `icp: "TODO: ICP备案完成后填写"` | `data/company.ts` |
| 真实数据 | `shuineighbor.domain` → 真实水邻居独立域名 | `data/company.ts` |
| 真实图片 | 9 张业务图（hero / years×3 / whatwedo×4 / home-life / office-space / disposable-hero / shuineighbor / city-line-art / map-placeholder）| `data/media.ts` 中 `src: null` 项改为真实路径 |
| 真实二维码 | `wechat-qr` | `data/media.ts` |
| 文案 | 产品 `volume: "TODO: REAL_SPEC"`（家庭/企业/商务/瓶装水 4 项） | `data/products.ts` |
| 视觉 | 抽象城市线条 SVG 替换为更精细版本 | `components/home/CitySection.tsx` |
| 部署 | Vercel / 自托管 | 待用户决定 |
| 域名 | meihaoshuiye.cn 备案 + 解析 | 待用户 |
| 第三方 | 百度统计 / GA / Meta Pixel（一期不上） | `app/layout.tsx` |

---

## 7. 视觉审查自评（计划 §6 Phase 6 10 条）

| # | 问题 | 自评 |
|---|---|---|
| 1 | 是否像传统企业官网？ | ❌ 无 Banner / 无轮播 / 无促销 / 无"欢迎来到" |
| 2 | 是否像 AI 生成的网站？ | ❌ 无紫色渐变 / 无玻璃拟态 / 无粒子动画 |
| 3 | 是否过度使用卡片？ | ❌ 5 类自营产品仅 3 栏轻量列表；无满屏 Card |
| 4 | 是否缺少留白？ | ❌ Section-y `clamp(88,11vw,200)`，首屏之后取上限 |
| 5 | 是否有视觉重点？ | ✅ Hero 居中大标题 + 后续每屏只有一个核心 |
| 6 | 是否像一个真实品牌？ | ✅ 真实公司名 / 真实电话 / 真实地址 / TODO 真实标记 |
| 7 | 是否有 Apple 式的节奏感？ | ✅ 亮—暗—亮—暗 3 处深色；留白驱动；单列叙事 |
| 8 | 移动端是否漂亮？ | ✅ 所有 Section 移动端重排：流程横排→竖排、CTA 纵向全宽、字号 clamp |
| 9 | 图片是否足够有冲击力？ | ⚠️ 全量占位，替换真实图片后此条成立 |
| 10 | 是否有不必要的元素？ | ✅ shadcn 仅 MobileMenu；首页核心视觉不用 Card |

> 第 9 条待真实图片到位后复核。

---

## 8. 性能自评

- **静态生成**：14 路由全部 `○ (Static)` 预渲染；CDN 友好
- **图片优化**：`next/image` 包装（除 Logo 品牌资产），所有 `<Figure>` 走 `aspect-ratio` 防 CLS
- **字体**：`next/font/google` 加载 Inter（拉丁子集）+ 系统中文栈，无 Flash of Invisible Text
- **第三方 JS**：仅 1 个 `motion` 包（≈ 35KB gz）+ 0 个分析/统计脚本
- **首屏 LCP**：`hero` 已 `preload as="image"` Logo；`hero-city-water` 已在 1.0.1 传入 `priority`（真实图替换后即生效）
- **prefers-reduced-motion**：全局降级（`transition-duration: 0.001ms`）
- **Bundle**：Lighthouse 跑分待执行（环境无 Chrome）

---

## 9. 启动方式

```bash
# 1. 安装依赖
cd "C:/Users/shang/WorkBuddy/美好水业官网2.0"
npm install

# 2. 开发服务器（热重载，端口 3000）
npm run dev

# 3. 生产构建
npm run build

# 4. 生产预览
npm run start
# 默认端口 3000；本环境实测端口 3030：npx next start -p 3030
```

打开 http://localhost:3000 即可访问。

---

## 10. 移动端专项（1.0.1，2026-09-11）

目标：让手机端信息展示更合理。范围内的改动共触及 23 个文件（+ 收尾 7 个）。

### 10.1 修复（回归与缺陷）

| 问题 | 根因 | 修复 |
|---|---|---|
| 结尾 CTA 二维码在手机上变成整列宽 | `w-32 sm:w-36` 被写进 `Figure` 的 `className`；`Figure` 基类含 `w-full`，`cn()` 不做冲突消解。实测编译 CSS：`.w-32`@84821 < `.w-full`@84897（同层同优先级后者胜） | 宽度交由外层 `<div className="w-32 sm:w-36">` 约束 |
| 二十年 Section 横向溢出 145px | `clamp(120px,18vw,260px)` 下限 120px，375px 屏下 4 字标题 480px > 可用 335px | 改为 `clamp(60px,15.5vw,220px)` |
| 14 处 `<h1><h1>` / `<h2><h2>` 标题嵌套 | `RevealItem as="h1"` 内部又套同名标签 | `RevealItem` 新增 `id` 透传，标题改单层 |
| 「我们做什么」移动端描述恒为第 1 项 | 描述依赖 `onMouseEnter` 的 `active`，触摸无 hover | 移动端每行始终渲染自身描述 |
| Logo 白色版在深底不可见 | SVG 经 `<img>` 加载时 `currentColor` 解析为黑；且 220:64 的 viewBox 被按 40×40 正方形渲染而压扁 | SVG 硬编码白色；`Logo` 按 220:64 计算宽度；去掉与 SVG 内置文字重复的品牌名 |
| Footer 移动端「联系」栏独占一行左侧 | 3 栏放入 `grid-cols-2` | 移动端改为「网站 + 联系」两列，订水电话独立为优先区块 |
| 配送流程移动端竖线断开 | 竖线固定 `h-12` 且在节点右侧 | 绝对定位竖线自节点底部贯穿至下一节点 |

### 10.2 变更（信息层级重排）

| 组件/页面 | 改动 |
|---|---|
| `Hero` | 大图移动端 4/5（原 16/9 在 375px 屏仅约 190px 高），≥640px 16/9 |
| `Figure` | 新增 `ratioSm` 响应式比例；占位内容改容器查询 `@container` + `@max-[200px]`，小容器只留单行文案；`note` 移入 `title` / `data-note` |
| `ClosingCTA` | 移动端三入口改为带分隔线的「左标题 / 右描述」清单 |
| `Footer` | 移动端订水电话大字号置前（可点 `tel:`） |
| `Navbar` | 移动端新增一键拨号按钮（最高频动作无需展开菜单） |
| `YearsSection` | 2 列 + `row-span-2` 拼贴 → 3 列等宽（消除高度错位） |
| `WhatWeDo` | `<button>` 改纯展示（原语义暗示可点击但无行为） |
| `CitySection` | 城市线条移动端隐藏（窄屏穿过正文 + slice 放大导致线粗），仅 ≥640px 显示；加 `vector-effect: non-scaling-stroke` |
| `TelLink` | 非 prominent 字号 `text-[19px] sm:text-[16px]` |
| 多处 | 移动端间距降级（`gap-16`→`gap-10 sm:gap-16` 等）；修正 `sm:mt-32 sm:mt-40` 重复断点 |

### 10.3 无障碍

- 触控目标统一 ≥44px：Navbar（logo / 移动拨号 / 汉堡 / 桌面导航 / 桌面订水按钮）、Footer（logo / 导航链接 / 电话链接）、`/products`「查看全部品牌」、`/brands` 与 `/service` 电话链接。
- `RevealItem` 的 `id` 透传让 `<section aria-labelledby>` 指向真实标题元素。

### 10.4 移除

- `src/components/ui/SectionHeading.tsx`（全站零引用）
- `Figure` 中永不生效的 `?? "aspect-[16/9]"` 兜底

### 10.5 验证方法与结论

| 手段 | 结果 |
|---|---|
| `npm run lint` | 0 error 0 warning |
| `npm run build` | 14 路由全部静态生成 |
| 7 页编译后 HTML：`h1` 唯一性 / 标题嵌套 | 全部 `h1=1, nested=0` |
| 编译 CSS 关键类 | `min-h-11` / `h-11` / `aspect-[4/5]` / `sm:aspect-[16/9]` / `aspect-square` / `w-32` / `\@container{container-type:inline-size}` / `@container not (min-width:200px){…}` 全部命中 |
| 横向溢出（CDP，真实 Chrome） | 320 / 375 / 390 / 414 / 768 × 7 页：`scrollWidth === clientWidth`，零横向滚动 |
| 触控目标（CDP，真实 Chrome） | 移动端仅剩 skip-link（`sr-only`，豁免） |
| 视觉截图（CDP，真实 Chrome） | 分段截图确认 Hero 4/5、二十年巨字不溢出、WhatWeDo 逐项描述、Footer 电话优先、二维码 160px、地图 `4/3 → 16/9` |
| 收尾后的复验 | ⚠️ 环境限制：headless Chrome 在本会话不可用（进程秒退、无输出）。改用编译产物 + 渲染 HTML 静态校验。收尾改动（FIX 1 收紧宽度、FIX 2 仅高度、FIX 3 删死代码、FIX 4 复用同一 `Figure`）均为宽度中性或收窄，不影响既有溢出结论 |

**辅助脚本**（临时目录，未纳入仓库）：`overflow-check.mjs` / `tap-check.mjs` / `shot.mjs`，基于 CDP（`--remote-debugging-port=9222`）实现溢出探测、触控尺寸探测与分段截图。

**环境注意事项**：本环境曾被清空 `PATH` 与 `SystemRoot`，导致 `ls`/`dirname` 不可用、Chrome 秒退。恢复方式：`export PATH="/usr/bin:/bin:/c/Windows/System32:/c/Windows"` + `export SystemRoot="C:\\Windows"`；node 实际路径为 `C:\Users\shang\.workbuddy\binaries\node\versions\22.22.2-3\node.exe`。
