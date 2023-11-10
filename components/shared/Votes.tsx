"use client";

import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
import {
  downvoteQuestion,
  toggleSaveQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { formatAndDivideNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useOptimistic } from "react";

interface VotesProps {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  hasUpvoted: boolean;
  downvotes: number;
  hasDownvoted: boolean;
  hasSaved?: boolean;
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
  const router = useRouter();

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

  //Optimistic UI for save
  const [optimisticHasSaved, setOptimisticHasSaved] = useOptimistic(
    hasSaved,
    (state, newHasSaved: boolean) => {
      return newHasSaved;
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

  const toggleSaveOptimistic = () => {
    if (optimisticHasSaved) {
      setOptimisticHasSaved(false);
    } else {
      setOptimisticHasSaved(true);
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
    } else if (type === "answer") {
      if (action === "upvote") {
        upvoteOptimistic();
        await upvoteAnswer({
          answerId: itemId,
          userId,
          hasUpvoted: optimisticHasUpvoted,
          hasDownvoted: optimisticHasDownvoted,
          path,
        });
      }

      if (action === "downvote") {
        downvoteOptimistic();
        await downvoteAnswer({
          answerId: itemId,
          userId,
          hasUpvoted: optimisticHasUpvoted,
          hasDownvoted: optimisticHasDownvoted,
          path,
        });
      }
    }
  };

  const handleSave = async () => {
    if (!userId) {
      return;
    }

    if (type === "question") {
      toggleSaveOptimistic();
      await toggleSaveQuestion({
        questionId: itemId,
        userId,
        path,
      });
    }
  };

  useEffect(() => {
    if (type === "question") {
      viewQuestion({
        questionId: itemId,
        userId: userId ? userId : undefined,
      });
    }
  }, [itemId, userId, path, type, router]);

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
            optimisticHasSaved
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
