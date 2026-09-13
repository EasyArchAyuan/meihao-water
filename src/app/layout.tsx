import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/data/site";
import { localBusinessJsonLd, organizationJsonLd } from "@/lib/jsonld";

/*
 * 字体：只使用系统字栈（见 globals.css 的 --font-sans），不引入 web font。
 * 原因：
 *  1. 目标用户在中国大陆，Google Fonts 访问慢且不稳定；
 *  2. 避免构建期依赖外网请求（next/font/google 会在 build 时拉取字体）；
 *  3. 系统字栈已覆盖 macOS/iOS/Windows/Android 的中英文渲染，且零网络开销。
 */

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}｜廊坊本地饮水服务品牌`,
    template: `%s｜${site.name}`,
  },
  description: site.description,
  keywords: site.keywords,
  applicationName: site.name,
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  publisher: site.legalName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.ogLocale,
    siteName: site.name,
    title: `${site.name}｜廊坊本地饮水服务品牌`,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}｜廊坊本地饮水服务品牌`,
    description: site.description,
  },
  icons: {
    icon: [{ url: "/brand/logo.jpg", type: "image/jpeg" }],
    apple: [{ url: "/brand/logo.jpg" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: site.themeColor,
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-dvh bg-[var(--bg)] text-[var(--ink)]">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[var(--ink)] focus:px-5 focus:py-2 focus:text-[var(--bg)]"
        >
          跳到主要内容
        </a>
        {children}
        {/*
          结构化数据：仅输出真实字段。
          必须用原生 <script> 内联，不能用 next/script（afterInteractive 只在运行时注入，
          静态 HTML 里没有内容，搜索引擎与 AI 抓取不到，GEO 会失效）。
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: organizationJsonLd() }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: localBusinessJsonLd() }}
        />
      </body>
    </html>
  );
}
