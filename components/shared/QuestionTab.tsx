import { getUserQuestions } from "@/database/actions/user.action";
import QuestionCard from "../cards/QuestionCard";
import Pagination from "./Pagination";
import { SearchParamsProps } from "@/types";
import { Suspense } from "react";

interface QuestionTabProps extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const QuestionTab = async ({
  searchParams,
  userId,
  clerkId,
}: QuestionTabProps) => {
  const result = await getUserQuestions({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      {result.questions && result.questions?.length > 0 ? (
        result.questions.map((question) => (
          <QuestionCard
            key={question._id}
            _id={question._id}
            clerkId={clerkId}
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
        <p className="h3-semibold text-dark100_light900">No posts found! 🥲</p>
      )}
      <Suspense>
        <Pagination
          pageNumber={searchParams.page ? +searchParams.page : 1}
          isNext={result.isNext || false}
        />
      </Suspense>
    </>
  );
};

export default QuestionTab;
