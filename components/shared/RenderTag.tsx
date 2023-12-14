import Link from "next/link";
import { Badge } from "../ui/badge";

interface RenderTagProps {
  _id: string;
  name: string;
  totalQuestions?: number;
  showCount?: boolean;
}

const RenderTag = ({
  _id,
  name,
  totalQuestions,
  showCount,
}: RenderTagProps) => {
  return (
    <Link
      href={`/tags/${_id}`}
      aria-label="Tag"
      className="flex items-baseline justify-between gap-2"
    >
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 max-w-[5rem] overflow-hidden rounded-md border-none px-4 py-2 uppercase">
        <span className="truncate">{name}</span>
      </Badge>

      {showCount && (
        <p className="small-medium text-dark500_light700">{totalQuestions}</p>
      )}
    </Link>
  );
};

export default RenderTag;
