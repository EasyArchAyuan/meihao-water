"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Figure } from "@/components/ui/Figure";

type Item = {
  title: string;
  desc: string;
  image: string;
};

/**
 * 四项描述从「抒情句」改为**可核对的服务事实**（配送频次 / 发票 / 当天安排 /
 * 一次性封装）。原句如「日常的一桶水，准时到家」任何水站都能写，不构成品牌信息。
 * 这四项同时吸收了原 HomeWaterSection / OfficeSection / DisposableSection
 * 三个独立区块要表达的内容，是首页能一次砍掉三个区块的前提。
 */
const items: Item[] = [
  {
    title: "家庭饮水",
    desc: "按周或按月约定频次，送到门口。",
    image: "whatwedo-01",
  },
  {
    title: "企业饮水",
    desc: "办公室、门店的定期补给，可开发票。",
    image: "whatwedo-02",
  },
  {
    title: "商务用水",
    desc: "会议、接待、活动，急用当天能安排。",
    image: "whatwedo-03",
  },
  {
    title: "一次性桶装水",
    desc: "一次性封装，不回收、不重复使用。",
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
              家庭、公司、门店，
              <br />
              水都在送。
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
                  className="relative w-full"
                >
                  <Figure
                    id={items[active].image}
                    ratio="16/9"
                    rounded
                    sizes="(max-width: 1024px) 90vw, 640px"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
