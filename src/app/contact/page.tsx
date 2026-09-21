import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Figure } from "@/components/ui/Figure";
import { TelLink } from "@/components/ui/TelLink";
import { company } from "@/data/company";
import { geo, hasStaticMap } from "@/data/geo.generated";

export const metadata: Metadata = buildMetadata({
  title: "联系我们",
  description: `美好水业（${company.legalName}）联系方式：订水热线 ${company.phones.map((p) => p.number).join(" / ")}，地址 ${company.address}。`,
  path: "/contact",
});

/**
 * 一键导航走高德 URI API（https://uri.amap.com/marker），**不需要 key**，
 * 参数依官方文档：position=lng,lat · coordinate=gaode（GCJ-02）·
 * callnative=1 在移动端尝试唤起高德 App 直接进入导航。
 *
 * 坐标未就绪时（src/data/geo.generated.ts 的 lng/lat 为 null）不渲染该入口 ——
 * 给出一个点了没反应的按钮，比不给更伤信任。
 */
const hasGeo = typeof geo.lng === "number" && typeof geo.lat === "number";
const navHref = hasGeo
  ? [
      "https://uri.amap.com/marker",
      `?position=${geo.lng},${geo.lat}`,
      `&name=${encodeURIComponent(company.brandName)}`,
      "&src=meihaowater&coordinate=gaode&callnative=1",
    ].join("")
  : null;

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="bg-[var(--bg)] pt-16 sm:pt-[72px]">
        {/* Hero */}
        <section className="container-site section-y-sm">
          <Reveal className="max-w-3xl">
            <RevealItem>
              <span className="eyebrow">联系我们</span>
            </RevealItem>
            <RevealItem
              as="h1"
              className="display-hero mt-6 text-[var(--ink)]"
            >
              一通电话，
              <br />
              水到门口。
            </RevealItem>
            <RevealItem>
              <p className="body-lg mt-8 max-w-2xl text-[var(--ink-soft)]">
                廊坊本地订水，一个电话就够。也可以扫码加微信。
              </p>
            </RevealItem>
          </Reveal>
        </section>

        {/* 联系信息 + 二维码 */}
        <section className="container-wide pb-16 sm:pb-24">
          <Reveal>
            <div className="grid gap-12 sm:gap-16 lg:grid-cols-12 lg:gap-20">
              {/* 左：电话 + 地址 */}
              <div className="lg:col-span-7 flex flex-col gap-10 sm:gap-12">
                <div>
                  <span className="eyebrow">订水热线</span>
                  <ul className="mt-5 flex flex-col divide-y divide-[var(--hairline)] sm:mt-6 sm:flex-row sm:gap-12 sm:divide-y-0">
                    {company.phones.map((p) => (
                      <li
                        key={p.number}
                        className="py-4 first:pt-0 last:pb-0 sm:py-0"
                      >
                        <TelLink phone={p} />
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="eyebrow">公司地址</span>
                  <p className="mt-4 text-[18px] font-medium leading-relaxed tracking-tight text-[var(--ink)] sm:text-[20px]">
                    {company.address}
                  </p>
                  <p className="mt-2 text-[15px] text-[var(--ink-soft)]">
                    {company.city} · 河北省
                  </p>
                  {navHref ? (
                    <a
                      href={navHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex min-h-11 items-center gap-2 text-[15px] font-medium text-[var(--brand)] underline-offset-4 transition-colors hover:underline"
                    >
                      在高德地图中打开并导航
                      <span aria-hidden>→</span>
                    </a>
                  ) : null}
                </div>
                <div>
                  <span className="eyebrow">公众号</span>
                  <p className="mt-4 text-[18px] font-medium tracking-tight text-[var(--ink)]">
                    {company.wechatPublicName}
                  </p>
                  <p className="mt-2 text-[14px] text-[var(--ink-soft)]">
                    关注公众号，订水、配送、新消息都在里面。
                  </p>
                </div>
              </div>

              {/* 右：微信服务号搜索卡片 */}
              <div className="lg:col-span-5 flex flex-col items-start gap-5 sm:gap-6">
                <span className="eyebrow">微信服务号</span>
                <div className="w-full max-w-sm">
                  <Figure
                    src="/images/wechat-service-card.jpg"
                    alt="微信搜一搜「廊坊桶装水」，关注美好水业服务号"
                    ratio="3/1"
                    fit="contain"
                    rounded
                    sizes="(max-width: 1024px) 80vw, 360px"
                  />
                </div>
                <p className="text-[13px] text-[var(--ink-muted)]">
                  微信搜一搜「廊坊桶装水」
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        {/*
          位置地图。图片由 `npm run map:fetch` 在构建期从高德静态地图 API 抓取并纳入 git
          （前端因此零 key、零外部请求）。未生成时整块不渲染 —— 不留「待接入」字样占位。
        */}
        {hasStaticMap ? (
          <section className="container-wide pb-16 sm:pb-24">
            <Reveal className="flex flex-col gap-4">
              <RevealItem>
                <Figure id="map-location" ratio="16/9" rounded />
              </RevealItem>
              <RevealItem>
                <p className="text-[12px] text-[var(--ink-muted)]">
                  地图数据 © 高德地图
                </p>
              </RevealItem>
            </Reveal>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
