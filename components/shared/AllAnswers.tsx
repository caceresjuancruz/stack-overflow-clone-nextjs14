import { getAnswers } from "@/database/actions/answer.action";
import Filter from "./Filter";
import { AnswerFilters } from "@/constants/filters";
import Answer from "./Answer";
import Pagination from "./Pagination";
import { Suspense } from "react";

interface AllAnswersProps {
  questionId: string;
  totalAnswers?: number;
  page?: string;
  filter?: string;
}

const AllAnswers = async ({
  questionId,
  totalAnswers,
  page,
  filter,
}: AllAnswersProps) => {
  const result = await getAnswers({
    questionId,
    page: page ? +page : 1,
    sortBy: filter,
  });

  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <p className="primary-text-gradient">{totalAnswers} Answers</p>
        <Suspense>
          <Filter filters={AnswerFilters} />
        </Suspense>
      </div>
      <div>
        {result.answers && result.answers.length > 0 ? (
          result.answers.map((answer: any) => (
            <Answer answer={answer} key={answer._id} />
          ))
        ) : (
          <></>
        )}
      </div>
      <div className="mt-10 w-full">
        <Suspense>
          <Pagination
            pageNumber={page ? +page : 1}
            isNext={result.isNext || false}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default AllAnswers;
