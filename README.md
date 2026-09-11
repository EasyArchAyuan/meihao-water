# 美好水业官网 2.0

> 廊坊本地饮水服务品牌官网。Next.js 16 + TypeScript + Tailwind CSS 4 + Motion。

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com)

## 快速开始

```bash
# 安装依赖（首次）
npm install

# 开发模式（热重载，默认端口 3000）
npm run dev

# 生产构建
npm run build

# 启动生产服务器
npm start

# 代码风格检查
npm run lint
```

打开 [http://localhost:3000](http://localhost:3000) 即可访问。

## 目录

```
src/
├── app/                # App Router 路由
│   ├── page.tsx        # 首页（11 Section）
│   ├── about/          # 关于我们
│   ├── products/       # 产品与服务
│   ├── shuineighbor/   # 水邻居
│   ├── contact/        # 联系我们
│   ├── brands/         # 代理品牌
│   ├── service/        # 配送服务（占位，noindex）
│   ├── robots.ts       # robots.txt
│   ├── sitemap.ts      # sitemap.xml
│   ├── icon.svg        # favicon
│   ├── opengraph-image.tsx  # 动态 OG 图
│   └── layout.tsx      # 根布局：字体、metadata、JSON-LD、skip-link
├── components/
│   ├── layout/         # Navbar / MobileMenu / Footer / Logo
│   ├── ui/             # Reveal / Figure / SectionHeading / ButtonLink / TelLink / Hairline
│   └── home/           # 首页 10 个 Section
├── data/               # 所有可变数据 + 媒体清单
│   ├── site.ts
│   ├── company.ts      # 公司真实信息（电话/地址/1998/水邻居）
│   ├── products.ts     # 自营 5 类
│   ├── brands.ts       # 代理 10 个品牌
│   ├── navigation.ts   # 主导航
│   └── media.ts        # 图片清单（占位用 TODO 标记）
└── lib/                # cn / motion / seo / jsonld
```

## 数据更新

所有可变的业务信息集中在 `src/data/`：

| 文件 | 改什么 |
|---|---|
| `company.ts` | 公司名 / 地址 / 电话 / 公众号 / 抖音 / ICP / 水邻居域名 |
| `products.ts` | 自营产品名 / 规格 / 描述 |
| `brands.ts` | 代理品牌列表 |
| `media.ts` | 图片：把 `src: null` 改为真实路径，组件无需改 |

未知字段统一用 `TODO: REAL_*` 占位字符串，渲染层用 `isTodo()` 判断是否输出（如 Footer 抖音/ICP 行）。

## 图片替换

所有图片通过 `<Figure id="..." />` 引用。`src: null` 时显示占位 + `data-placeholder="TODO: REPLACE_WITH_REAL_IMAGE"`。替换时：

1. 把真实图片放到 `public/`
2. 改 `src/media.ts` 中对应 id 的 `src` 字段
3. 组件无需改动

## 设计文档

- `docs/phase1-design-system.md` — 设计系统、首页 IA、Token、组件树
- `docs/phase2-implementation.md` — 实现记录、版本号、踩坑、TODO 清单

## 部署

```bash
npm run build
npm start
```

推荐 Vercel（一键部署）。如需自托管，构建产物在 `.next/` 目录。

## License

© 2026 廊坊市美好商贸有限公司 · 保留所有权利
