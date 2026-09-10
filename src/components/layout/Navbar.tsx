"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { primaryNav } from "@/data/navigation";
import { primaryPhone } from "@/data/company";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 路由变化时关闭移动端菜单（React 19 推荐写法：渲染期间根据 prop 变化重置 state）
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter,border-color] duration-500",
          scrolled
            ? "bg-[var(--bg)]/72 backdrop-blur-xl border-b border-[var(--hairline)]"
            : "bg-transparent border-b border-transparent",
        )}
      >
        <div className="container-wide flex h-16 items-center justify-between sm:h-[72px]">
          <Link
            href="/"
            aria-label="返回首页"
            className="flex items-center"
          >
            <Logo variant={scrolled ? "color" : "color"} />
          </Link>

          {/* 桌面导航 */}
          <nav
            aria-label="主导航"
            className="hidden md:flex items-center gap-10"
          >
            {primaryNav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative text-[15px] font-medium transition-colors duration-300",
                    active
                      ? "text-[var(--ink)]"
                      : "text-[var(--ink-soft)] hover:text-[var(--ink)]",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute -bottom-1.5 left-0 h-px bg-[var(--ink)] transition-[width] duration-500",
                      active ? "w-full" : "w-0",
                    )}
                    aria-hidden
                  />
                </Link>
              );
            })}
          </nav>

          {/* 右侧 CTA：桌面立即订水，移动端汉堡 */}
          <div className="flex items-center gap-3">
            <a
              href={primaryPhone.tel}
              className="hidden md:inline-flex h-10 items-center rounded-full bg-[var(--ink)] px-5 text-[14px] font-medium text-[var(--bg)] transition-colors duration-300 hover:bg-[var(--brand)]"
            >
              立即订水
            </a>
            <button
              type="button"
              aria-label={open ? "关闭菜单" : "打开菜单"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--ink)] transition-colors hover:bg-[var(--bg-alt)]"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
