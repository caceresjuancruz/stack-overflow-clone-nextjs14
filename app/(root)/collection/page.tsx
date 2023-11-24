import QuestionCard from "@/components/cards/QuestionCard";
import UserCard from "@/components/cards/UserCard";
import Filter from "@/components/shared/Filter";
import NoResults from "@/components/shared/NoResults";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { QuestionFilters } from "@/constants/filters";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";

export default async function CollectionsPage({
  searchParams,
}: SearchParamsProps) {
  const { userId } = auth();

  if (!userId) return null;

  const result = await getSavedQuestions({
    clerkId: userId as string,
    searchQuery: searchParams.q,
  });

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          placeholder="Search for saved questions"
          iconPosition="left"
          iconSrc="/assets/icons/search.svg"
          route="/collection"
        />
        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
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
    </div>
  );
}
