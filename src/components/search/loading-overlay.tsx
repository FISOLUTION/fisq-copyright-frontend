import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  isLoading: boolean;
  message: string;
}

export default function LoadingOverlay({
  isLoading,
  message,
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[2px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="text-primary h-12 w-12 animate-spin" />
        <p className="text-lg font-medium">{message}</p>
      </div>
    </div>
  );
}
