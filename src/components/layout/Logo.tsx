import { cn } from "@/lib/cn";

type LogoProps = {
  /** color = 彩版 logo.jpg（浅底用，正方形 1:1）；white = 白色字标 SVG（深底用，宽扁 220:64） */
  variant?: "color" | "white";
  className?: string;
  /** 高度（px） */
  height?: number;
  /** 仅 color 版生效：是否在图标右侧补一行清晰的品牌名 */
  showText?: boolean;
};

export function Logo({
  variant = "color",
  className,
  height = 36,
  showText = true,
}: LogoProps) {
  if (variant === "color") {
    return (
      <span
        className={cn("inline-flex items-center gap-2.5", className)}
        style={{ height }}
      >
        {/* 彩版为位图，用原生 <img> 避免 next/image 的尺寸声明冗余 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo.jpg"
          alt="美好水业"
          width={height}
          height={height}
          className="block shrink-0 rounded-md object-cover"
          style={{ height, width: height }}
        />
        {showText ? (
          <span className="text-[15px] font-medium tracking-tight text-[var(--ink)]">
            美好水业
          </span>
        ) : null}
      </span>
    );
  }

  // 白色版 SVG 本身已含「抽象水字 + 美好水业」，故不再叠加文字；
  // 且其 viewBox 为 220:64，必须按该比例计算宽度，否则会被压扁。
  const whiteWidth = Math.round((height * 220) / 64);
  return (
    <span className={cn("inline-flex items-center", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/logo-white.svg"
        alt="美好水业"
        width={whiteWidth}
        height={height}
        className="block"
        style={{ height, width: whiteWidth }}
      />
    </span>
  );
}
