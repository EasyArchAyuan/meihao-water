/**
 * Figure —— 唯一图片出口。
 *
 * 行为：
 * 1. 传入 `id`：从 data/media.ts 取 MediaItem，自动 alt / ratio。
 * 2. 传入 `src`：直接渲染（外部资源或临时图）。
 * 3. 都不传：渲染中性占位。
 *
 * 占位 DOM 标记：
 *   data-placeholder="TODO: REPLACE_WITH_REAL_IMAGE"
 *   data-note="该图的用途说明"
 * 设计师 / 替换者只需把 src 填上即可，无需改组件。
 *
 * 占位文案按**容器宽度**自适应（container query）：
 *   ≥ 200px：完整（figure-placeholder + 图片占位 + 比例·id）
 *   < 200px：仅一行「图片占位」，避免在二维码等小容器中溢出
 */

import Image from "next/image";
import { type MediaItem, getMedia } from "@/data/media";
import { cn } from "@/lib/cn";

type FigureProps = {
  /** 从 data/media.ts 读取（推荐） */
  id?: string;
  /** 直接指定，覆盖 id */
  src?: string | null;
  alt?: string;
  /** 移动端（<640px）比例 */
  ratio?: `${number}/${number}`;
  /** ≥640px 时的比例；不传则沿用 ratio */
  ratioSm?: `${number}/${number}`;
  /** next/image 优化提示：true = priority（Hero 大图） */
  priority?: boolean;
  /** 覆盖默认 object-fit（默认 cover） */
  fit?: "cover" | "contain";
  className?: string;
  /** 该图用途备注（不再直接显示，写入 data-note / title 供查看） */
  note?: string;
  /** 显式指定 sizes（响应式优化） */
  sizes?: string;
  /** 是否加圆角（默认 0，符合 Apple 风） */
  rounded?: boolean;
};

/**
 * 比例 → 静态 Tailwind 类名映射。
 * 必须写成字面量，Tailwind 才能扫描到（不可用模板字符串动态拼接）。
 */
const ASPECT_BASE: Record<string, string> = {
  "1/1": "aspect-square",
  "3/2": "aspect-[3/2]",
  "4/3": "aspect-[4/3]",
  "3/4": "aspect-[3/4]",
  "4/5": "aspect-[4/5]",
  "16/9": "aspect-[16/9]",
};

const ASPECT_SM: Record<string, string> = {
  "1/1": "sm:aspect-square",
  "3/2": "sm:aspect-[3/2]",
  "4/3": "sm:aspect-[4/3]",
  "3/4": "sm:aspect-[3/4]",
  "4/5": "sm:aspect-[4/5]",
  "16/9": "sm:aspect-[16/9]",
};

export function Figure({
  id,
  src: srcProp,
  alt: altProp,
  ratio: ratioProp,
  ratioSm,
  priority,
  fit = "cover",
  className,
  note,
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1240px",
  rounded = false,
}: FigureProps) {
  const mediaItem: MediaItem | undefined = id ? getMedia(id) : undefined;
  const src = srcProp ?? mediaItem?.src ?? null;
  const alt = altProp ?? mediaItem?.alt ?? "";
  const ratio = ratioProp ?? mediaItem?.ratio ?? "16/9";
  const isPlaceholder = src === null;
  const isTodoSrc = mediaItem?.todo === true;
  const noteText = note ?? mediaItem?.note;

  // 比例未命中预设映射时，用 inline style 兜底。
  // 注意：该分支下 `ratioSm` 不生效（inline style 无法响应断点），属边缘场景；
  // 新增比例时请优先补进 ASPECT_BASE / ASPECT_SM 映射。
  const useInlineRatio = !(ratio in ASPECT_BASE);
  const baseAspect: string | undefined = ASPECT_BASE[ratio];
  const smAspect: string | undefined = ratioSm ? ASPECT_SM[ratioSm] : undefined;

  return (
    <figure
      className={cn(
        "@container relative w-full overflow-hidden bg-[var(--bg-alt)]",
        !useInlineRatio && baseAspect,
        !useInlineRatio && smAspect,
        rounded && "rounded-2xl",
        className,
      )}
      style={
        useInlineRatio ? { aspectRatio: ratio.replace("/", " / ") } : undefined
      }
      title={noteText}
      data-placeholder={
        isTodoSrc || isPlaceholder ? "TODO: REPLACE_WITH_REAL_IMAGE" : undefined
      }
      data-note={noteText}
    >
      {isPlaceholder ? (
        <PlaceholderContent
          ratio={smAspect ? `${ratio} → ${ratioSm}` : ratio}
          id={id ?? mediaItem?.id}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn(fit === "cover" ? "object-cover" : "object-contain")}
        />
      )}
    </figure>
  );
}

function PlaceholderContent({ ratio, id }: { ratio: string; id?: string }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center @max-[200px]:gap-1 @max-[200px]:p-2"
      style={{
        backgroundImage:
          "linear-gradient(135deg, var(--bg-alt) 0%, var(--accent-tint) 100%)",
      }}
    >
      <span className="text-[11px] uppercase tracking-[0.24em] text-[var(--ink-muted)] @max-[200px]:hidden">
        figure-placeholder
      </span>
      <span className="text-[13px] text-[var(--ink-soft)] @max-[200px]:text-[10px]">
        图片占位
        <span className="hidden @min-[200px]:inline"> · 待替换真实摄影</span>
      </span>
      <span className="text-[11px] tabular-nums text-[var(--ink-muted)] @max-[200px]:hidden">
        {ratio}
        {id ? ` · ${id}` : ""}
      </span>
    </div>
  );
}
