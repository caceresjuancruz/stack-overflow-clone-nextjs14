import { getUserAnswers } from "@/database/actions/user.action";
import AnswerCard from "../cards/AnswerCard";
import { SearchParamsProps } from "@/types";
import Pagination from "./Pagination";

interface AnswerTabProps extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnswerTab = async ({ searchParams, userId, clerkId }: AnswerTabProps) => {
  const result = await getUserAnswers({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      {result.answers && result.answers?.length > 0 ? (
        result.answers.map((answer) => (
          <AnswerCard
            key={answer._id}
            _id={answer._id}
            clerkId={clerkId}
            question={answer.question}
            author={answer.author}
            upvotes={answer.upvotes.length}
            createdAt={answer.createdAt}
          />
        ))
      ) : (
        <p>No results</p>
      )}
      <Pagination
        pageNumber={searchParams.page ? +searchParams.page : 1}
        isNext={result.isNext || false}
      />
    </>
  );
};

export default AnswerTab;
