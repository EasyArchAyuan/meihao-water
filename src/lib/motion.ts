/**
 * Motion 动效统一预设。
 * 仅使用 fade / translateY / scale≤1.04，遵循"克制"原则。
 * 详情见 docs/phase1-design-system.md §H。
 */

import type { Transition, Variants } from "motion/react";

export const easeOut: Transition["ease"] = [0.22, 1, 0.36, 1];

export const dur = {
  fast: 0.4,
  base: 0.6,
  slow: 0.9,
} as const;

/** 标准入场：fade + translateY */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: dur.base, ease: easeOut },
  },
};

/** 大图入场：fade + 微 scale */
export const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.04 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: dur.slow, ease: easeOut },
  },
};

/** 父容器（用于 stagger 子元素） */
export const stagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};
