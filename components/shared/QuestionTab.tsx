import { getUserQuestions } from "@/lib/actions/user.action";
import QuestionCard from "../cards/QuestionCard";

interface QuestionTabProps {
  userId: string;
}

const QuestionTab = async ({ userId }: QuestionTabProps) => {
  const result = await getUserQuestions({ userId, page: 1 });

  return (
    <>
      {result.questions && result.questions?.length > 0 ? (
        result.questions.map((question) => (
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
        <p>No results</p>
      )}
    </>
  );
};

export default QuestionTab;
