import AnswerForm from "@/components/forms/AnswerForm";
import AllAnswers from "@/components/shared/AllAnswers";
import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import Votes from "@/components/shared/Votes";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
import { URLProps } from "@/types";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Question | Dev Overflow",
};

export default async function QuestionDetailPage({
  params,
  searchParams,
}: URLProps) {
  const { userId } = await auth();

  const dbUser = await getUserById({ userId: userId as string });

  const question = await getQuestionById({ questionId: params.id });

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${question.author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={question.author.avatar}
              alt="Profile"
              width={22}
              height={22}
              className="rounded-full"
              unoptimized
            />
            <p className="paragraph-semibold text-dark300_light700">
              {question.author.name}
            </p>
          </Link>
          <div className="flex justify-end">
            <Votes
              type="question"
              itemId={JSON.parse(JSON.stringify(question._id))}
              userId={
                dbUser._id !== undefined
                  ? JSON.parse(JSON.stringify(dbUser._id))
                  : null
              }
              upvotes={question.upvotes.length}
              hasUpvoted={
                dbUser._id !== undefined
                  ? question.upvotes.includes(dbUser._id)
                  : false
              }
              downvotes={question.downvotes.length}
              hasDownvoted={
                dbUser._id !== undefined
                  ? question.downvotes.includes(dbUser._id)
                  : false
              }
              hasSaved={
                dbUser._id !== undefined
                  ? dbUser.saved.includes(question._id)
                  : false
              }
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {question.title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={` Asked ${getTimestamp(question.createdAt)}`}
          title=""
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatAndDivideNumber(question.answers.length)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatAndDivideNumber(question.views)}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>

      <ParseHTML data={question.content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {question.tags.map((tag: any) => (
          <RenderTag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>

      <AllAnswers
        questionId={params.id}
        totalAnswers={question.answers.length}
        page={searchParams?.page}
        filter={searchParams?.filter}
      />

      <AnswerForm
        authorId={JSON.stringify(dbUser._id)}
        questionId={JSON.stringify(params.id)}
        question={question.content}
      />
    </>
  );
}
