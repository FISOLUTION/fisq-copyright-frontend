import React from "react";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface LoadingOverlayProps {
  isLoading: boolean;
  message: string;
  progress?: {
    current: number;
    total: number;
  };
}

export default function LoadingOverlay({
  isLoading,
  message,
  progress,
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  const progressPercentage = progress
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  return (
    <div className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[2px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="text-primary h-12 w-12 animate-spin" />
        <p className="text-lg font-medium">{message}</p>
        {progress && (
          <div className="w-80 space-y-2">
            <Progress
              value={progressPercentage}
              max={100}
              getValueLabel={(value) => `${progress.current}개 중 ${Math.round(value)}% 완료`}
              className="w-full"
            />
            <p className="text-muted-foreground text-center text-sm">
              {progress.current} / {progress.total} ({progressPercentage}%)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
