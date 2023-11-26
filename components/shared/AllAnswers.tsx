import { getAnswers } from "@/lib/actions/answer.action";
import Filter from "./Filter";
import { AnswerFilters } from "@/constants/filters";
import Answer from "./Answer";

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
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>

        <Filter filters={AnswerFilters} />
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
    </div>
  );
};

export default AllAnswers;
