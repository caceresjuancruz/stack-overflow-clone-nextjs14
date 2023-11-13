import { getUserAnswers } from "@/lib/actions/user.action";

interface AnswerTabProps {
  userId: string;
}

const AnswerTab = async ({ userId }: AnswerTabProps) => {
  const result = await getUserAnswers({ userId, page: 1 });

  return (
    <>
      {result.answers && result.answers?.length > 0 ? (
        result.answers.map((answer) => <p key={answer._id}></p>)
      ) : (
        <p>No results</p>
      )}
    </>
  );
};

export default AnswerTab;
