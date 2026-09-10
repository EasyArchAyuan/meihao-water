import { cn } from "@/lib/cn";

type LogoProps = {
  /** color = 彩版（浅底用）；white = 白色字标（深底用） */
  variant?: "color" | "white";
  className?: string;
  /** 高度（宽度等比） */
  height?: number;
  /** 显示品牌中文（默认 true，false 时只显示图标） */
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
        {/* 品牌资产（彩版 logo.jpg）使用原生 <img> 避免与 next/image 的尺寸声明冲突 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo.jpg"
          alt="美好水业"
          width={height}
          height={height}
          className="block rounded-md object-cover"
          style={{ height, width: height }}
        />
        {showText ? (
          <span
            className="text-[15px] font-medium tracking-tight text-[var(--ink)]"
            style={{ lineHeight: 1 }}
          >
            美好水业
          </span>
        ) : null}
      </span>
    );
  }

  return (
    <span
      className={cn("inline-flex items-center gap-2.5", className)}
      style={{ height }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/logo-white.svg"
        alt="美好水业"
        width={height}
        height={height}
        className="block"
        style={{ height, width: height }}
      />
      {showText ? (
        <span
          className="text-[15px] font-medium tracking-tight text-[var(--on-dark)]"
          style={{ lineHeight: 1 }}
        >
          美好水业
        </span>
      ) : null}
    </span>
  );
}
