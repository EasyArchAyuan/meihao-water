"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useEffect } from "react";
import { primaryNav } from "@/data/navigation";
import { primaryPhone } from "@/data/company";
import { cn } from "@/lib/cn";
import { easeOut } from "@/lib/motion";

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  // 打开时锁滚动 + Esc 关闭
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="mobile-menu"
          className="fixed inset-0 z-30 md:hidden bg-[var(--bg)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.3, ease: easeOut }}
        >
          <div className="container-site flex h-full flex-col pt-20 pb-8">
            <nav
              aria-label="移动端主导航"
              className="flex flex-col gap-1"
            >
              {primaryNav.map((item, i) => {
                const active = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={reduced ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: easeOut, delay: 0.08 * i }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block py-3.5 text-[clamp(26px,7vw,38px)] font-medium tracking-tight",
                        active
                          ? "text-[var(--ink)]"
                          : "text-[var(--ink-soft)]",
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <div className="mt-auto border-t border-[var(--hairline)] pt-8">
              <span className="eyebrow">立即订水</span>
              <a
                href={primaryPhone.tel}
                className="mt-2 block text-[clamp(24px,6.2vw,32px)] font-medium tracking-tight tabular-nums text-[var(--ink)]"
              >
                {primaryPhone.display}
              </a>
              <span className="mt-1 block text-[13px] text-[var(--ink-muted)]">
                廊坊本地 · 二十余年
              </span>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
