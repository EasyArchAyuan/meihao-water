"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Item = {
  title: string;
  desc: string;
  image: string;
};

const items: Item[] = [
  {
    title: "家庭饮水",
    desc: "日常的一桶水，准时到家。",
    image: "whatwedo-01",
  },
  {
    title: "企业饮水",
    desc: "办公室里的水，不该成为要操心的事。",
    image: "whatwedo-02",
  },
  {
    title: "商务用水",
    desc: "会议、接待、门店，体面地准备好。",
    image: "whatwedo-03",
  },
  {
    title: "一次性桶装水",
    desc: "更轻，更现代的一次性解决方案。",
    image: "whatwedo-04",
  },
];

export function WhatWeDo() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  return (
    <section
      aria-labelledby="wwd-title"
      className="bg-[var(--bg)]"
    >
      <div className="container-wide section-y">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          {/* 左：标题 */}
          <header className="lg:col-span-5">
            <span className="eyebrow">我们做什么</span>
            <h2
              id="wwd-title"
              className="display-section mt-6 text-[var(--ink)]"
            >
              一桶水，
              <br />
              连接的是
              <br />
              每一天的生活。
            </h2>
          </header>

          {/* 右：列表 + 预览图 */}
          <div className="lg:col-span-7">
            <ul className="border-t border-[var(--hairline)]">
              {items.map((item, i) => (
                <li
                  key={item.title}
                  className="border-b border-[var(--hairline)]"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                >
                  <button
                    type="button"
                    className="group flex w-full items-baseline justify-between gap-6 py-7 text-left transition-colors duration-300 hover:text-[var(--ink)] sm:py-8"
                    aria-label={`查看 ${item.title} 详情`}
                  >
                    <span className="flex items-baseline gap-4 sm:gap-6">
                      <span className="tabular-nums text-[12px] text-[var(--ink-muted)]">
                        0{i + 1}
                      </span>
                      <span
                        className={cn(
                          "title transition-colors",
                          active === i
                            ? "text-[var(--ink)]"
                            : "text-[var(--ink-soft)] group-hover:text-[var(--ink)]",
                        )}
                      >
                        {item.title}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "hidden flex-1 pl-8 text-[14px] text-[var(--ink-muted)] sm:block",
                        active === i ? "text-[var(--ink-soft)]" : "",
                      )}
                    >
                      {item.desc}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {/* 移动端：直接显示当前项的描述（不可 hover） */}
            <p className="mt-6 text-[15px] text-[var(--ink-soft)] sm:hidden">
              {items[active].desc}
            </p>

            {/* hover 大图预览（仅桌面） */}
            <div
              className="mt-10 hidden lg:block"
              aria-hidden
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={items[active].image}
                  initial={reduced ? false : { opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduced ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.5, ease: easeOut }}
                  className="relative w-full overflow-hidden rounded-2xl bg-[var(--bg-alt)]"
                  style={{ aspectRatio: "16 / 9" }}
                  data-placeholder="TODO: REPLACE_WITH_REAL_IMAGE"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-6 text-center text-[var(--ink-muted)]">
                    <span className="text-[10px] uppercase tracking-[0.24em]">
                      figure-placeholder
                    </span>
                    <span className="text-[12px]">{items[active].image}</span>
                    <span className="text-[10px] opacity-60">
                      {items[active].title} · 16/9
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
