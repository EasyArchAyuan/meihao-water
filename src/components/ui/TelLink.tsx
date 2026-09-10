import type { Phone } from "@/data/company";
import { cn } from "@/lib/cn";

type TelLinkProps = {
  phone: Phone;
  className?: string;
  /** 显示是否突出（CTA 区主电话用） */
  prominent?: boolean;
};

export function TelLink({ phone, className, prominent = false }: TelLinkProps) {
  return (
    <a
      href={phone.tel}
      className={cn(
        "group inline-flex flex-col gap-1 transition-colors duration-300",
        "hover:text-[var(--brand)]",
        prominent
          ? "text-[var(--ink)]"
          : "text-[var(--ink-soft)]",
        className,
      )}
    >
      <span className="text-[11px] uppercase tracking-[0.24em] text-[var(--ink-muted)]">
        {phone.label}
      </span>
      <span
        className={cn(
          "tabular-nums font-medium tracking-tight",
          prominent ? "text-[clamp(28px,4vw,44px)]" : "text-[16px]",
          "group-hover:text-[var(--brand)]",
        )}
      >
        {phone.display}
      </span>
    </a>
  );
}
