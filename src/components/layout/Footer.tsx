import Link from "next/link";
import { Logo } from "./Logo";
import { company, isTodo } from "@/data/company";
import { primaryNav } from "@/data/navigation";
import { cn } from "@/lib/cn";

export function Footer() {
  const hasWechat = !isTodo(company.wechatService);
  const hasDouyin = !isTodo(company.douyin);
  const hasIcp = !isTodo(company.icp);

  return (
    <footer className="bg-[var(--brand-deep)] text-[var(--on-dark)]">
      <div className="container-wide section-y">
        {/* 顶行：品牌 + slogan */}
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <Link href="/" aria-label="返回首页" className="inline-flex">
              <Logo variant="white" height={40} />
            </Link>
            <p className="mt-6 text-[clamp(28px,3.6vw,40px)] font-medium leading-tight tracking-tight text-[var(--on-dark)]">
              好水，
              <br />
              在身边。
            </p>
            <p className="mt-4 text-[14px] text-[var(--on-dark-soft)]">
              {company.legalName} · 自 1998 年起 · 廊坊本地饮水服务
            </p>
          </div>

          {/* 导航 + 联系 */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:gap-16">
            <FooterCol title="网站">
              {primaryNav.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
            </FooterCol>

            <FooterCol title="订水电话">
              {company.phones.map((p) => (
                <a
                  key={p.number}
                  href={p.tel}
                  className="block text-[15px] text-[var(--on-dark)] transition-colors hover:text-white"
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
        <div className="mt-20 flex flex-col gap-3 border-t border-[var(--on-dark-soft)]/15 pt-8 text-[12px] text-[var(--on-dark-soft)] md:flex-row md:items-center md:justify-between">
          <p>
            © {company.copyrightYear} {company.legalName} · 保留所有权利
          </p>
          {hasIcp ? (
            <p className="tabular-nums">{company.icp}</p>
          ) : (
            <p className="text-[var(--on-dark-soft)]/60">
              ICP 备案号待填写
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[11px] uppercase tracking-[0.24em] text-[var(--on-dark-soft)]">
        {title}
      </h3>
      <div className={cn("flex flex-col gap-3")}>{children}</div>
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
      className="text-[15px] text-[var(--on-dark)] transition-colors hover:text-white"
    >
      {children}
    </Link>
  );
}
