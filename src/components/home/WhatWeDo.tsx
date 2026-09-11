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
    desc: "会议、接待、门店。有客人在，水要先备好。",
    image: "whatwedo-03",
  },
  {
    title: "一次性桶装水",
    desc: "不用回收，也不用清洗。",
    image: "whatwedo-04",
  },
];

export function WhatWeDo() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  return (
    <section aria-labelledby="wwd-title" className="bg-[var(--bg)]">
      <div className="container-wide section-y">
        <div className="grid gap-10 sm:gap-16 lg:grid-cols-12 lg:gap-20">
          {/* 左：标题 */}
          <header className="lg:col-span-5">
            <span className="eyebrow">我们做什么</span>
            <h2
              id="wwd-title"
              className="display-section mt-5 text-[var(--ink)] sm:mt-6"
            >
              一桶水，连着每一天的生活。
            </h2>
          </header>

          {/* 右：列表 + 预览图 */}
          <div className="lg:col-span-7">
            <ul className="border-t border-[var(--hairline)]">
              {items.map((item, i) => (
                <li
                  key={item.title}
                  className="group border-b border-[var(--hairline)]"
                  onMouseEnter={() => setActive(i)}
                >
                  {/*
                    移动端：编号 + 标题一行，描述紧随其下（始终可见，不依赖 hover）。
                    桌面：标题在左、描述在右对齐，hover 时描述加深并联动下方大图。
                  */}
                  <div className="flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 sm:py-8">
                    <div className="flex items-baseline gap-4 sm:gap-6">
                      <span className="tabular-nums text-[12px] text-[var(--ink-muted)]">
                        0{i + 1}
                      </span>
                      <span
                        className={cn(
                          "title transition-colors duration-300",
                          active === i
                            ? "text-[var(--ink)]"
                            : "text-[var(--ink-soft)]",
                        )}
                      >
                        {item.title}
                      </span>
                    </div>
                    <p className="pl-7 text-[14px] leading-relaxed text-[var(--ink-soft)] transition-colors duration-300 sm:pl-8 sm:text-right lg:text-[var(--ink-muted)] lg:group-hover:text-[var(--ink-soft)]">
                      {item.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* hover 大图预览（仅桌面，装饰性） */}
            <div className="mt-10 hidden lg:block" aria-hidden>
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
