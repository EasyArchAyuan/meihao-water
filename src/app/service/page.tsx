import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { primaryPhone } from "@/data/company";

export const metadata: Metadata = buildMetadata({
  title: "配送服务",
  description: "配送服务页面即将上线。",
  path: "/service",
  noindex: true,
});

export default function ServicePage() {
  return (
    <>
      <Navbar />
      <main
        id="main"
        className="bg-[var(--bg)] pt-16 sm:pt-[72px] min-h-[60vh]"
      >
        <section className="container-site section-y">
          <Reveal className="flex max-w-2xl flex-col items-start gap-8">
            <RevealItem>
              <span className="eyebrow">配送服务</span>
            </RevealItem>
            <RevealItem
              as="h1"
              className="display-section text-[var(--ink)]"
            >
              配送服务页，
              <br />
              正在路上。
            </RevealItem>
            <RevealItem>
              <p className="body-lg text-[var(--ink-soft)]">
                现在订水，直接打热线，或者扫码加微信。
              </p>
            </RevealItem>
            <RevealItem>
              <a
                href={primaryPhone.tel}
                className="inline-flex min-h-11 items-center text-[clamp(30px,4.4vw,44px)] font-medium tabular-nums text-[var(--ink)] transition-colors hover:text-[var(--brand)]"
              >
                {primaryPhone.display}
              </a>
            </RevealItem>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
