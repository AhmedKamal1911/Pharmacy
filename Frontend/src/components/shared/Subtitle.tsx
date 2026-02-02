import { cn } from "@/lib/utils";

interface SubtitleProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function Subtitle({
  title,
  description,
  action,
  className,
}: SubtitleProps) {
  return (
    <div className={cn("mb-6 space-y-1", className)}>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        {action && <div className="flex shrink-0 items-center">{action}</div>}
      </div>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}
