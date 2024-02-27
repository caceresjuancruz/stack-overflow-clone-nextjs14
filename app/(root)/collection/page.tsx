import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResults from "@/components/shared/NoResults";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { QuestionFilters } from "@/constants/filters";
import { images } from "@/constants/images";
import { getSavedQuestions } from "@/database/actions/user.action";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Collection | Dev Overflow",
};

export default async function CollectionsPage({
  searchParams,
}: SearchParamsProps) {
  const { userId } = await auth();

  if (!userId) return null;

  const result = await getSavedQuestions({
    clerkId: userId as string,
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Suspense>
          <LocalSearchbar
            placeholder="Search for saved questions"
            iconPosition="left"
            iconSrc={images.search}
            route="/collection"
          />
        </Suspense>
        <Suspense>
          <Filter
            filters={QuestionFilters}
            otherClasses="min-h-[56px] sm:min-w-[170px]"
          />
        </Suspense>
      </div>

      <section className="mt-10 flex w-full flex-col gap-6">
        {result.questions && result.questions.length > 0 ? (
          result.questions.map((question: any) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResults
            title="No Saved Questions Found"
            description="It appears that there are no saved questions in your collection at the moment 😔.Start exploring and saving questions that pique your interest 🌟"
            link="/"
            linkTitle="Explore questions"
          />
        )}
      </section>
      <div className="mt-10">
        <Suspense>
          <Pagination
            pageNumber={searchParams.page ? +searchParams.page : 1}
            isNext={result.isNext || false}
          />
        </Suspense>
      </div>
    </>
  );
}
