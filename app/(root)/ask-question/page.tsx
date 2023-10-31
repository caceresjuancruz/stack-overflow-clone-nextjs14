import { QuestionForm } from "@/components/forms/QuestionForm";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function AskQuestionPage() {
  //const { userId } = auth();

  const userId = "123456789";
  if (!userId) redirect("/sign-in");

  const dbUser = await getUserById(userId);

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask question</h1>
      <div className="mt-9">
        <QuestionForm userId={JSON.stringify(dbUser._id)} />
      </div>
    </div>
  );
}
