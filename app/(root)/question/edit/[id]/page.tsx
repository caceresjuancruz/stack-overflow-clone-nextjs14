import { QuestionForm } from "@/components/forms/QuestionForm";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Question | Dev Overflow",
};

export default async function EditQuestionPage({ params }: ParamsProps) {
  const { userId } = await auth();

  if (!userId) return null;

  const user = await getUserById({ userId: userId as string });
  const question = await getQuestionById({ questionId: params.id });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question </h1>

      <div className="mt-9">
        <QuestionForm
          userId={JSON.stringify(user._id)}
          formType="edit"
          questionDetails={JSON.stringify(question)}
        />
      </div>
    </>
  );
}
