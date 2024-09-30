import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section>
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-2">
        <div className="flex-between w-full">
          <div className="flex-center gap-1 ">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="h-8 w-28" />
          </div>

          
          <Skeleton className="h-8 w-36" />
        
        </div>

        
      </div>

      <Skeleton className="mt-4 h-9 w-10/12" />

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-7 w-24" />
      </div>

      <Skeleton className="h-48 w-full rounded-lg" />

      <div className="mt-8 flex flex-wrap gap-2">
        {[1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-6 w-16 rounded-md" />
        ))}
      </div>

      <div className="mt-10">
        <div className="h-7 w-20">
          <Skeleton className="h-7 w-full" />
        </div>

        <div className="mt-5 space-y-4">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-32 w-full rounded-md" />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </section>
  );
}
