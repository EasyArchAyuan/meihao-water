/**
 * Tailwind class 合并工具（轻量替代 clsx/cn 库）。
 * 内部使用，无第三方依赖。
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
