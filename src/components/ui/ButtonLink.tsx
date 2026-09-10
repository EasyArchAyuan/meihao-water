import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "text" | "onDark";
type Size = "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  fullWidthMobile?: boolean;
  className?: string;
  children: ReactNode;
};

type AsButton = CommonProps & Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps> & { href?: undefined };
type AsAnchor = CommonProps & Omit<ComponentPropsWithoutRef<"a">, keyof CommonProps> & { href: string };

type ButtonLinkProps = AsButton | AsAnchor;

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "transition-[background-color,color,border-color,transform] duration-300 " +
  "select-none focus-visible:outline-2 focus-visible:outline-[var(--brand)] " +
  "focus-visible:outline-offset-3";

const sizes: Record<Size, string> = {
  md: "h-11 px-6 text-[15px]",
  lg: "h-14 px-8 text-[16px]",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--ink)] text-[var(--bg)] hover:bg-[var(--brand)]",
  secondary:
    "border border-[var(--hairline-strong)] bg-transparent text-[var(--ink)] " +
    "hover:border-[var(--ink)] hover:bg-[var(--bg-alt)]",
  text:
    "bg-transparent text-[var(--ink)] underline-offset-4 hover:underline",
  onDark:
    "bg-[var(--on-dark)] text-[var(--brand-deep)] hover:bg-white",
};

function buildClass(
  variant: Variant,
  size: Size,
  fullWidthMobile: boolean,
  className?: string,
) {
  return cn(
    base,
    sizes[size],
    variants[variant],
    fullWidthMobile && "w-full sm:w-auto",
    className,
  );
}

export function ButtonLink(props: ButtonLinkProps) {
  if ("href" in props && props.href) {
    const {
      variant = "primary",
      size = "md",
      fullWidthMobile = false,
      className,
      children,
      href,
      ...rest
    } = props;
    return (
      <a
        href={href}
        className={buildClass(variant, size, fullWidthMobile, className)}
        {...rest}
      >
        {children}
      </a>
    );
  }
  const {
    variant = "primary",
    size = "md",
    fullWidthMobile = false,
    className,
    children,
    ...rest
  } = props as AsButton;
  return (
    <button
      className={buildClass(variant, size, fullWidthMobile, className)}
      {...rest}
    >
      {children}
    </button>
  );
}
