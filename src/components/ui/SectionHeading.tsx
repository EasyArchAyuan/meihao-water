import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  /** 小字眉标（位于标题上方） */
  eyebrow?: string;
  /** 主标题（h2），支持换行用 \n 或 <br/> */
  title: ReactNode;
  /** 副文/描述 */
  description?: ReactNode;
  className?: string;
  /** 在深色 Section 使用时翻转颜色 */
  onDark?: boolean;
  /** 居中（用于 ClosingCTA 等） */
  center?: boolean;
  /** 阅读列宽上限（默认 640px） */
  maxTextWidth?: number;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  onDark = false,
  center = false,
  maxTextWidth = 640,
}: SectionHeadingProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-6",
        center && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span
          className={cn("eyebrow", onDark && "!text-[var(--on-dark-soft)]")}
        >
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={cn(
          "display-section",
          onDark ? "text-[var(--on-dark)]" : "text-[var(--ink)]",
        )}
        style={{ maxWidth: maxTextWidth }}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "body-lg",
            onDark ? "text-[var(--on-dark-soft)]" : "text-[var(--ink-soft)]",
          )}
          style={{ maxWidth: maxTextWidth }}
        >
          {description}
        </p>
      ) : null}
    </header>
  );
}
