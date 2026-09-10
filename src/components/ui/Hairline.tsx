import { cn } from "@/lib/cn";

export function Hairline({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <hr
      className={cn(
        "h-px w-full border-0",
        onDark ? "bg-[var(--on-dark-soft)]/20" : "bg-[var(--hairline)]",
        className,
      )}
    />
  );
}
