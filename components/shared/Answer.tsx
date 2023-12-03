import Link from "next/link";
import ParseHTML from "./ParseHTML";
import { getTimestamp } from "@/lib/utils";
import Image from "next/image";
import Votes from "./Votes";

interface AnswerProps {
  answer: {
    _id: string;
    content: string;
    createdAt: Date;
    upvotes: string[];
    downvotes: string[];
    author: {
      _id: string;
      clerkId: string;
      name: string;
      avatar: string;
    };
  };
}

const Answer = ({ answer }: AnswerProps) => {
  return (
    <article
      key={answer._id}
      className="light-border text-dark300_light900 border-b py-10 "
    >
      <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <Link
          href={`/profile/${answer.author.clerkId}`}
          className="flex flex-1 items-start gap-1 sm:items-center"
        >
          <Image
            src={answer.author.avatar}
            alt="profile"
            width={18}
            height={18}
            className="rounded-full object-cover max-sm:mt-0.5"
            unoptimized
          />
          <div className="flex flex-col sm:flex-row sm:items-center">
            <p className="body-semibold text-dark300_light700">
              {answer.author.name}
            </p>

            <p className="small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1">
              • answered {getTimestamp(answer.createdAt)}
            </p>
          </div>
        </Link>
        <div className="flex justify-end">
          <Votes
            type="answer"
            itemId={JSON.parse(JSON.stringify(answer._id))}
            userId={JSON.parse(JSON.stringify(answer.author._id))}
            upvotes={answer.upvotes.length}
            hasUpvoted={answer.upvotes.includes(answer.author._id)}
            downvotes={answer.downvotes.length}
            hasDownvoted={answer.downvotes.includes(answer.author._id)}
          />
        </div>
      </div>

      <ParseHTML data={answer.content} />
    </article>
  );
};

export default Answer;
