import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { YearsSection } from "@/components/home/YearsSection";
import { WhatWeDo } from "@/components/home/WhatWeDo";
import { HomeWaterSection } from "@/components/home/HomeWaterSection";
import { OfficeSection } from "@/components/home/OfficeSection";
import { DisposableSection } from "@/components/home/DisposableSection";
import { ShuiNeighborSection } from "@/components/home/ShuiNeighborSection";
import { DeliveryFlow } from "@/components/home/DeliveryFlow";
import { CitySection } from "@/components/home/CitySection";
import { ClosingCTA } from "@/components/home/ClosingCTA";

export const metadata: Metadata = buildMetadata({
  title: "美好水业｜廊坊本地饮水服务品牌",
  description:
    "美好水业，扎根廊坊本地二十余年，为家庭、企业与商务场景提供桶装水、一次性桶装水、瓶装水及饮水配送服务。",
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
        <HomeWaterSection />
        <OfficeSection />
        <DisposableSection />
        <ShuiNeighborSection />
        <DeliveryFlow />
        <CitySection />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  );
}
