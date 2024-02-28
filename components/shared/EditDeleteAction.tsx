"use client";

import { images } from "@/constants/images";
import { deleteAnswer } from "@/database/actions/answer.action";
import { deleteQuestion } from "@/database/actions/question.action";
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
        <Link
          aria-label="Edit button"
          href={`/question/edit/${JSON.parse(itemId)}`}
        >
          <Image
            src={images.edit}
            alt="Edit"
            width={14}
            height={14}
            className="cursor-pointer object-contain"
            unoptimized
          />
        </Link>
      )}
      <Image
        src={images.trash}
        alt="Delete"
        width={14}
        height={14}
        className="cursor-pointer object-contain"
        onClick={handleDelete}
        aria-label="Delete button"
        unoptimized
      />
    </div>
  );
};

export default EditDeleteAction;
