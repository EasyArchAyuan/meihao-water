import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { site } from "@/data/site";
import { localBusinessJsonLd, organizationJsonLd } from "@/lib/jsonld";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

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
    <html lang="zh-CN" className={inter.variable}>
      <body className="min-h-dvh bg-[var(--bg)] text-[var(--ink)]">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[var(--ink)] focus:px-5 focus:py-2 focus:text-[var(--bg)]"
        >
          跳到主要内容
        </a>
        {children}
        {/* 结构化数据：仅输出真实字段 */}
        <Script
          id="ld-organization"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {organizationJsonLd()}
        </Script>
        <Script
          id="ld-local-business"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {localBusinessJsonLd()}
        </Script>
      </body>
    </html>
  );
}
