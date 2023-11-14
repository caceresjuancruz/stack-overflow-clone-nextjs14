"use client";

import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface EditDeleteActionProps {
  type: string;
  itemId: string;
}

const EditDeleteAction = ({ type, itemId }: EditDeleteActionProps) => {
  const path = usePathname();

  const handleDelete = async () => {
    if (type === "question") {
      await deleteQuestion({ questionId: JSON.parse(itemId), path });
    } else if (type === "answer") {
      await deleteAnswer({ answerId: JSON.parse(itemId), path });
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full">
      {type === "question" && (
        <Link href={`/question/edit/${itemId}`}>
          <Image
            src="/assets/icons/edit.svg"
            alt="Edit"
            width={14}
            height={14}
            className="cursor-pointer object-contain"
          />
        </Link>
      )}
      <Image
        src="/assets/icons/trash.svg"
        alt="Delete"
        width={14}
        height={14}
        className="cursor-pointer object-contain"
        onClick={handleDelete}
      />
    </div>
  );
};

export default EditDeleteAction;
