import AnswerForm from "@/components/forms/AnswerForm";
import AllAnswers from "@/components/shared/AllAnswers";
import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import Votes from "@/components/shared/Votes";
import { images } from "@/constants/images";
import { getQuestionById } from "@/database/actions/question.action";
import { getUserById } from "@/database/actions/user.action";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
import { URLProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export async function generateMetadata(
  { params, searchParams }: URLProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  
  const question = await getQuestionById({ questionId: params?.id });
  
  return {
    title: `${question?.title} | Dev Overflow`,
  };
}

export default async function QuestionDetailPage({ params, searchParams }: URLProps) {
  const { userId } = await auth();

  const dbUser = await getUserById({ userId: userId as string });

  const question = await getQuestionById({ questionId: params?.id });

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${question?.author?.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={question?.author?.avatar}
              alt="Profile"
              width={22}
              height={22}
              className="rounded-full"
              unoptimized
            />
            <p className="paragraph-semibold text-dark300_light700">
              {question?.author?.name}
            </p>
          </Link>
          <div className="flex justify-end">
            <Suspense>
              <Votes
                type="question"
                itemId={JSON.stringify(question?._id)}
                userId={JSON.stringify(dbUser?._id)}
                upvotes={question?.upvotes?.length}
                hasUpvoted={dbUser?._id ? question?.upvotes?.includes(dbUser?._id) : false}
                downvotes={question?.downvotes?.length}
                hasDownvoted={
                  dbUser?._id ? question?.downvotes?.includes(dbUser?._id) : false
                }
                hasSaved={dbUser?._id ? dbUser?.saved?.includes(question?._id) : false}
              />
            </Suspense>
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {question?.title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl={images?.clock}
          alt="clock icon"
          value={` Asked ${getTimestamp(question?.createdAt)}`}
          title=""
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatAndDivideNumber(question?.answers?.length)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatAndDivideNumber(question?.views)}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>

      <ParseHTML data={question?.content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {question?.tags?.map((tag: any) => (
          <RenderTag key={tag?._id} _id={tag?._id} name={tag?.name} showCount={false} />
        ))}
      </div>

      <AllAnswers
        questionId={params?.id}
        totalAnswers={question?.answers?.length}
        page={searchParams?.page}
        filter={searchParams?.filter}
      />

      <Suspense>
        <AnswerForm
          authorId={JSON.stringify(dbUser?._id)}
          questionId={JSON.stringify(params?.id)}
          question={question?.content}
        />
      </Suspense>
    </>
  );
}
