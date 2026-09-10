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
 *   className 含 `figure-placeholder`
 * 设计师 / 替换者只需把 src 填上即可，无需改组件。
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
  ratio?: `${number}/${number}`;
  /** next/image 优化提示：true = priority（Hero 大图） */
  priority?: boolean;
  /** 覆盖默认 object-fit（默认 cover） */
  fit?: "cover" | "contain";
  className?: string;
  /** 给设计师标注的备注（仅占位时显示） */
  note?: string;
  /** 显式指定 sizes（响应式优化） */
  sizes?: string;
  /** 是否加圆角（默认 0，符合 Apple 风） */
  rounded?: boolean;
};

export function Figure({
  id,
  src: srcProp,
  alt: altProp,
  ratio: ratioProp,
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

  const wrapperStyle: React.CSSProperties = {
    aspectRatio: ratio.replace("/", " / "),
  };

  return (
    <figure
      className={cn(
        "relative w-full overflow-hidden bg-[var(--bg-alt)]",
        rounded && "rounded-2xl",
        className,
      )}
      style={wrapperStyle}
      data-placeholder={isTodoSrc || isPlaceholder ? "TODO: REPLACE_WITH_REAL_IMAGE" : undefined}
    >
      {isPlaceholder ? (
        <PlaceholderContent
          ratio={ratio}
          note={note ?? mediaItem?.note}
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

function PlaceholderContent({
  ratio,
  note,
  id,
}: {
  ratio: string;
  note?: string;
  id?: string;
}) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center"
      style={{
        backgroundImage:
          "linear-gradient(135deg, var(--bg-alt) 0%, var(--accent-tint) 100%)",
      }}
    >
      <span className="text-[11px] uppercase tracking-[0.24em] text-[var(--ink-muted)]">
        figure-placeholder
      </span>
      <span className="text-[13px] text-[var(--ink-soft)]">
        图片占位 · 待替换真实摄影
      </span>
      <span className="text-[11px] tabular-nums text-[var(--ink-muted)]">
        {ratio} {id ? `· ${id}` : ""}
      </span>
      {note ? (
        <span className="mt-1 max-w-[28ch] text-[11px] leading-relaxed text-[var(--ink-muted)]">
          {note}
        </span>
      ) : null}
    </div>
  );
}
