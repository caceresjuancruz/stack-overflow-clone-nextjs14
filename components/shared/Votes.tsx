"use client";

import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { formatAndDivideNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useOptimistic } from "react";

interface VotesProps {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  hasUpvoted: boolean;
  downvotes: number;
  hasDownvoted: boolean;
  hasSaved: boolean;
}
const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  hasUpvoted,
  downvotes,
  hasDownvoted,
  hasSaved,
}: VotesProps) => {
  const path = usePathname();

  //--- Optimistic UI START ---

  //Optimistic UI for upvotes
  const [optimisticUpvotes, addOptimisticUpvote] = useOptimistic(
    upvotes,
    (state, newUpvote: number) => {
      return state + newUpvote;
    }
  );

  const [optimisticHasUpvoted, setOptimisticHasUpvoted] = useOptimistic(
    hasUpvoted,
    (state, newHasUpvoted: boolean) => {
      return newHasUpvoted;
    }
  );

  //Optimistic UI for downvotes
  const [optimisticHasDownvoted, setOptimisticHasDownvoted] = useOptimistic(
    hasDownvoted,
    (state, newHasDownvoted: boolean) => {
      return newHasDownvoted;
    }
  );

  const [optimisticDownvotes, addOptimisticDownvote] = useOptimistic(
    downvotes,
    (state, newDownvote: number) => {
      return state + newDownvote;
    }
  );

  //Optimistic UI functions
  const upvoteOptimistic = () => {
    if (!optimisticHasUpvoted && !optimisticHasDownvoted) {
      addOptimisticUpvote(1);
      setOptimisticHasUpvoted(true);
    } else if (optimisticHasDownvoted) {
      addOptimisticUpvote(1);
      setOptimisticHasUpvoted(true);
      addOptimisticDownvote(-1);
      setOptimisticHasDownvoted(false);
    } else if (optimisticHasUpvoted) {
      addOptimisticUpvote(-1);
      setOptimisticHasUpvoted(false);
    }
  };

  const downvoteOptimistic = () => {
    if (!optimisticHasUpvoted && !optimisticHasDownvoted) {
      addOptimisticDownvote(1);
      setOptimisticHasDownvoted(true);
    } else if (optimisticHasUpvoted) {
      addOptimisticDownvote(1);
      setOptimisticHasDownvoted(true);
      addOptimisticUpvote(-1);
      setOptimisticHasUpvoted(false);
    } else if (optimisticHasDownvoted) {
      addOptimisticDownvote(-1);
      setOptimisticHasDownvoted(false);
    }
  };
  //--- Optimistic UI END ---

  const handleVote = async (action: string) => {
    if (!userId) {
      return;
    }

    if (type === "question") {
      if (action === "upvote") {
        upvoteOptimistic();
        await upvoteQuestion({
          questionId: itemId,
          userId,
          hasUpvoted: optimisticHasUpvoted,
          hasDownvoted: optimisticHasDownvoted,
          path,
        });
      }

      if (action === "downvote") {
        downvoteOptimistic();
        await downvoteQuestion({
          questionId: itemId,
          userId,
          hasUpvoted: optimisticHasUpvoted,
          hasDownvoted: optimisticHasDownvoted,
          path,
        });
      }
    }
  };

  const handleSave = async () => {};

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              optimisticHasUpvoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            alt="upvote"
            width={18}
            height={18}
            className="cursor-pointer"
            unoptimized
            onClick={() => handleVote("upvote")}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(optimisticUpvotes)}
            </p>
          </div>
        </div>

        <div className="flex-center gap-1.5">
          <Image
            src={
              optimisticHasDownvoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            alt="downvote"
            width={18}
            height={18}
            className="cursor-pointer"
            unoptimized
            onClick={() => handleVote("downvote")}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(optimisticDownvotes)}
            </p>
          </div>
        </div>
      </div>

      {type === "question" && (
        <Image
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          alt="star"
          width={18}
          height={18}
          className="cursor-pointer"
          unoptimized
          onClick={handleSave}
        />
      )}
    </div>
  );
};

export default Votes;
