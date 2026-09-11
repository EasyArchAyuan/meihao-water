import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Figure } from "@/components/ui/Figure";
import { TelLink } from "@/components/ui/TelLink";
import { company } from "@/data/company";

export const metadata: Metadata = buildMetadata({
  title: "联系我们",
  description: `美好水业（${company.legalName}）联系方式：订水热线 ${company.phones.map((p) => p.number).join(" / ")}，地址 ${company.address}。`,
  path: "/contact",
});

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
                廊坊本地订水，请直接拨打下方电话。也可通过微信服务号下单或咨询。
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
                </div>
                <div>
                  <span className="eyebrow">公众号</span>
                  <p className="mt-4 text-[18px] font-medium tracking-tight text-[var(--ink)]">
                    {company.wechatPublicName}
                  </p>
                  <p className="mt-2 text-[14px] text-[var(--ink-soft)]">
                    关注公众号，接收订水、配送与品牌更新。
                  </p>
                </div>
              </div>

              {/* 右：二维码 */}
              <div className="lg:col-span-5 flex flex-col items-start gap-5 sm:gap-6">
                <span className="eyebrow">微信服务号</span>
                <div className="w-40 sm:w-52">
                  <Figure id="wechat-qr" ratio="1/1" rounded />
                </div>
                <p className="text-[13px] text-[var(--ink-muted)]">
                  扫码加微信 · 二维码待替换
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 地图占位 */}
        <section className="container-wide pb-16 sm:pb-24">
          <Reveal>
            <Figure id="map-placeholder" ratio="4/3" ratioSm="16/9" rounded />
          </Reveal>
          <p className="mt-4 text-center text-[12px] text-[var(--ink-muted)]">
            地图位置示意 · 真实地图待接入
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
