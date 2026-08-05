import { cn } from "../../lib/utils.js";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-[#E6E5DC]/80", className)}
      {...props}
    />
  );
}

export { Skeleton };
