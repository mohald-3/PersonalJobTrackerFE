// src/components/ui/Skeleton.tsx
interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`rounded-md bg-slate-200/80 ${className}`} />;
}
