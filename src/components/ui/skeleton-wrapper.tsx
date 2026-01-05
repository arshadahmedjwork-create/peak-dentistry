
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
  numberOfLines?: number;
  animated?: boolean;
}

export function SkeletonCard({ className, numberOfLines = 4, animated = true }: SkeletonCardProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <Skeleton 
        className={cn(
          "h-[125px] w-full rounded-lg", 
          animated && "animate-pulse"
        )} 
      />
      <div className="space-y-2">
        {Array.from({ length: numberOfLines }).map((_, i) => (
          <Skeleton 
            key={i} 
            className={cn(
              "h-4 w-full", 
              i === 0 ? "w-full" : i === 1 ? "w-[80%]" : "w-[70%]",
              animated && "animate-pulse"
            )} 
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonList({ 
  count = 3, 
  className 
}: { 
  count?: number, 
  className?: string 
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonAvatar() {
  return <Skeleton className="h-12 w-12 rounded-full" />;
}

export function SkeletonButton() {
  return <Skeleton className="h-10 w-[120px] rounded-md" />;
}
