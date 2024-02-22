import { QuestionForm } from "@/components/forms/QuestionForm";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Ask Question | Dev Overflow",
};

export default async function AskQuestionPage() {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const dbUser = await getUserById({ userId });

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask question</h1>
      <div className="mt-9">
        <QuestionForm userId={JSON.stringify(dbUser._id)} formType="create" />
      </div>
    </div>
  );
}
