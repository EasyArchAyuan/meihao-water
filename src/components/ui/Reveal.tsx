"use client";

/**
 * Reveal —— 统一入场动效容器。
 * 详见 docs/phase1-design-system.md §H。
 *
 * 用法：
 *   <Reveal>
 *     <RevealItem>...</RevealItem>
 *     <RevealItem>...</RevealItem>
 *   </Reveal>
 *
 * - IntersectionObserver，`once: true`
 * - 子项 stagger 80ms
 * - 默认 fadeUp（fade + translateY 24px → 0）
 * - `prefers-reduced-motion` 由 globals.css 统一降级
 */

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/cn";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** 触发阈值 0–1 */
  amount?: number;
  /** 自定义 viewport margin，0 = 触底即触发 */
  margin?: string;
  as?: "div" | "section" | "ul" | "ol" | "header" | "footer";
};

export function Reveal({
  children,
  className,
  amount = 0.25,
  margin = "0px 0px -10% 0px",
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      initial={reduced ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount, margin }}
      variants={stagger}
    >
      {children}
    </MotionTag>
  );
}

type RevealItemProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "p" | "h1" | "h2" | "h3" | "h4" | "span" | "article" | "figure";
};

export function RevealItem({
  children,
  className,
  as = "div",
}: RevealItemProps) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag className={cn(className)} variants={fadeUp}>
      {children}
    </MotionTag>
  );
}

/** 单元素入场（无需 stagger） */
export function RevealOne({
  children,
  className,
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount, margin: "0px 0px -8% 0px" }}
      variants={fadeUp}
    >
      {children}
    </motion.div>
  );
}
