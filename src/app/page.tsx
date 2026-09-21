import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { YearsSection } from "@/components/home/YearsSection";
import { WhatWeDo } from "@/components/home/WhatWeDo";
import { ShuiNeighborSection } from "@/components/home/ShuiNeighborSection";
import { BrandsSection } from "@/components/home/BrandsSection";
import { DeliveryFlow } from "@/components/home/DeliveryFlow";
import { NewsTeaser } from "@/components/home/NewsTeaser";
import { ClosingCTA } from "@/components/home/ClosingCTA";

/**
 * 首页信息架构（8 个区块，较上一版 11 个减少 27%）。
 *
 * 叙事顺序：我是谁（Hero）→ 多久了（Years）→ 做什么（WhatWeDo）
 *   → 送什么水（自有品牌 ShuiNeighbor + 代理品牌 Brands）
 *   → 怎么送（DeliveryFlow）→ 凭什么信（NewsTeaser）→ 怎么开始（ClosingCTA）
 *
 * 已移除的四个区块及原因（内容均已并入保留区块，无信息丢失）：
 * - HomeWaterSection / OfficeSection：两个结构完全对称的「大图 + 一句抒情 + CTA」块，
 *   内容并入 WhatWeDo 的四项服务事实；其按钮是重复 CTA 的来源之一。
 * - DisposableSection：一次性桶装水在 WhatWeDo 已作为独立一项，无需整块重复；
 *   其底部的代理品牌一句话提及，升级为独立的 BrandsSection。
 * - CitySection：抽象线条背景 + 「廊坊/家庭/社区/企业/城市生活」关键词列表，
 *   与 YearsSection 原关键词线一字不差；本地下沉入口移交 DeliveryFlow 的 /langfang 内链。
 */
export const metadata: Metadata = buildMetadata({
  title: "美好水业｜廊坊本地饮水服务品牌",
  description:
    "美好水业，廊坊本地饮水服务品牌。自 1997 年起在廊坊经营桶装水、一次性桶装水、瓶装水与饮水配送，代理十余个品牌，库房 5000 余平米，家庭、公司、门店均可安排。",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <YearsSection />
        <WhatWeDo />
        <ShuiNeighborSection />
        <BrandsSection />
        <DeliveryFlow />
        <NewsTeaser />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  );
}
