import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "default" | "compact";
}

export function Logo({ className, variant = "default" }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
        <div className="absolute inset-0 rounded-xl bg-white opacity-20"></div>
        <span className="relative text-white font-bold text-lg">UP</span>
      </div>
      {variant === "default" && (
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-900">Ultra</span>
          <span className="text-xs font-medium text-gray-500">Pharmacy</span>
        </div>
      )}
    </div>
  );
}
