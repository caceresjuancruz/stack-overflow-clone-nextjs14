import { getUserAnswers } from "@/lib/actions/user.action";
import AnswerCard from "../cards/AnswerCard";
import { auth } from "@clerk/nextjs";

interface AnswerTabProps {
  userId: string;
}

const AnswerTab = async ({ userId }: AnswerTabProps) => {
  const { userId: clerkId } = auth();
  const result = await getUserAnswers({ userId, page: 1 });

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
    </>
  );
};

export default AnswerTab;
