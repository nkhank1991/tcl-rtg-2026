import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-lg mx-auto w-full px-4 pt-6 space-y-4">
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-6 w-48" />
      <div className="space-y-3">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    </div>
  );
}
