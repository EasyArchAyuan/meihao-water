import Link from "next/link";
import { Logo } from "./Logo";
import { brandSpan, company, isTodo } from "@/data/company";
import { primaryNav, footerNav } from "@/data/navigation";
import { cn } from "@/lib/cn";

export function Footer() {
  const hasWechat = !isTodo(company.wechatService);
  const hasDouyin = !isTodo(company.douyin);
  const hasIcp = !isTodo(company.icp);

  return (
    <footer className="bg-[var(--brand-deep)] text-[var(--on-dark)]">
      <div className="container-wide section-y">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-16">
          {/* 品牌 */}
          <div className="max-w-md">
            <Link
              href="/"
              aria-label="返回首页"
              className="inline-flex min-h-11 items-center"
            >
              <Logo variant="white" height={40} />
            </Link>
            <p className="mt-5 text-[clamp(26px,3.6vw,40px)] font-medium leading-tight tracking-tight text-[var(--on-dark)] sm:mt-6">
              好水，
              <br />
              在身边。
            </p>
            {/*
              年份跨度是品牌核心视觉之一（与首页 YearsSection 的巨字同源）。
              Footer 里克制处理：只做中等字号 + 弱色，不跟 slogan 抢层级。
            */}
            <p className="mt-4 text-[clamp(19px,2.3vw,26px)] font-medium tracking-[-0.02em] tabular-nums text-[var(--on-dark-soft)] sm:mt-5">
              {brandSpan.label}
            </p>
            <p className="mt-3 text-[14px] leading-relaxed text-[var(--on-dark-soft)] sm:mt-4">
              {company.legalName} · 廊坊本地饮水服务
            </p>
          </div>

          {/* 移动端：订水电话优先，大字号一点即拨 */}
          <div className="border-t border-[var(--on-dark-soft)]/15 pt-8 md:hidden">
            <h3 className="text-[11px] uppercase tracking-[0.24em] text-[var(--on-dark-soft)]">
              订水电话
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {company.phones.map((p) => (
                <li key={p.number}>
                  <a
                    href={p.tel}
                    className="flex min-h-11 items-baseline gap-3 transition-colors hover:text-white"
                  >
                    <span className="w-14 shrink-0 text-[11px] uppercase tracking-[0.2em] text-[var(--on-dark-soft)]">
                      {p.label}
                    </span>
                    <span className="text-[clamp(22px,6.4vw,28px)] font-medium tabular-nums text-[var(--on-dark)]">
                      {p.display}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 导航 + 联系：移动端两栏整齐排列，桌面三栏 */}
          <div className="grid grid-cols-2 gap-8 border-t border-[var(--on-dark-soft)]/15 pt-8 sm:gap-10 md:flex md:gap-16 md:border-0 md:pt-0">
            <FooterCol title="网站">
              {primaryNav.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
              {footerNav.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
            </FooterCol>

            <FooterCol title="订水电话" className="hidden md:flex">
              {company.phones.map((p) => (
                <a
                  key={p.number}
                  href={p.tel}
                  className="flex min-h-11 flex-col justify-center text-[15px] text-[var(--on-dark)] transition-colors hover:text-white"
                >
                  <span className="block text-[11px] uppercase tracking-[0.24em] text-[var(--on-dark-soft)]">
                    {p.label}
                  </span>
                  <span className="tabular-nums">{p.display}</span>
                </a>
              ))}
            </FooterCol>

            <FooterCol title="联系">
              <div className="text-[14px] leading-relaxed text-[var(--on-dark-soft)]">
                <p className="text-[var(--on-dark)]">{company.address}</p>
                <p className="mt-1">{company.city} · 河北省</p>
              </div>
              {company.wechatPublicName ? (
                <p className="mt-3 text-[14px]">
                  <span className="text-[11px] uppercase tracking-[0.24em] text-[var(--on-dark-soft)]">
                    微信公众号
                  </span>
                  <br />
                  <span className="text-[var(--on-dark)]">
                    {company.wechatPublicName}
                  </span>
                </p>
              ) : null}
              {hasDouyin ? (
                <p className="mt-3 text-[14px] text-[var(--on-dark-soft)]">
                  抖音 · {company.douyin}
                </p>
              ) : null}
              {hasWechat ? (
                <p className="mt-3 text-[14px] text-[var(--on-dark-soft)]">
                  服务号 · {company.wechatService}
                </p>
              ) : null}
            </FooterCol>
          </div>
        </div>

        {/* 版权行 */}
        <div className="mt-12 flex flex-col gap-3 border-t border-[var(--on-dark-soft)]/15 pt-8 text-[12px] text-[var(--on-dark-soft)] md:mt-20 md:flex-row md:items-center md:justify-between">
          <p>
            © {company.copyrightYear} {company.legalName} · 保留所有权利
          </p>
          {hasIcp ? (
            <p className="tabular-nums">{company.icp}</p>
          ) : (
            <p className="text-[var(--on-dark-soft)]/60">ICP 备案号待填写</p>
          )}
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <h3 className="text-[11px] uppercase tracking-[0.24em] text-[var(--on-dark-soft)]">
        {title}
      </h3>
      {/* 链接自带 44px 触控高度，故间距收紧，避免视觉发散 */}
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center text-[15px] text-[var(--on-dark)] transition-colors hover:text-white"
    >
      {children}
    </Link>
  );
}
