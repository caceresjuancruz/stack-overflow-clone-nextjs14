import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Skeleton } from "@/components/ui/skeleton";
import { images } from "@/constants/images";
import { Suspense } from "react";

export default function Loading() {
  return (
    <section>
      <h1 className="h1-bold text-dark100_light900">Community</h1>

      <div className="mb-12 mt-11 flex flex-wrap gap-5">
        <Suspense>
          <LocalSearchbar
            placeholder="Search for amazing minds"
            iconPosition="left"
            iconSrc={images.search}
            route="/community"
            otherClasses="flex-1"
          />
        </Suspense>
        <Skeleton className="h-14 w-28" />
      </div>

      <div className="flex flex-wrap gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <Skeleton
            key={item}
            className="h-60 w-full rounded-2xl sm:w-[260px]"
          />
        ))}
      </div>
    </section>
  );
}
