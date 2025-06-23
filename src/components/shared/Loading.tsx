import { ClipboardCheck } from "lucide-react";
import { cn } from '@/lib/utils';
interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export default function Loading({
  size = "md",
  text = "Loading...",
  className,
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className,
      )}
    >
      <div className="relative">
        <div
          className={cn(
            "animate-spin rounded-full border-2 border-pti-blue/20 border-t-pti-blue",
            sizeClasses[size],
          )}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <ClipboardCheck
            className={cn("text-pti-blue animate-pulse", {
              "h-2 w-2": size === "sm",
              "h-4 w-4": size === "md",
              "h-6 w-6": size === "lg",
            })}
          />
        </div>
      </div>
      {text && (
        <p
          className={cn("text-pti-gray-600 font-medium", textSizeClasses[size])}
        >
          {text}
        </p>
      )}
    </div>
  );
}

export function LoadingPage({ text = "Loading PTI Easy..." }: LoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pti-blue-50 to-pti-blue-100">
      <Loading size="lg" text={text} />
    </div>
  );
}

export function LoadingCard({ className, text = "Loading..." }: LoadingProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center p-8 rounded-lg border bg-white",
        className,
      )}
    >
      <Loading size="md" text={text} />
    </div>
  );
}
