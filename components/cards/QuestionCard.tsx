import Image from "next/image";
import RenderTag from "../shared/RenderTag";

interface QuestionCardProps {
  _id: string;
  title: string;
  tags: { _id: string; name: string }[];
  author: {
    _id: string;
    name: string;
    picture: string;
  };
  upvotes: number;
  views: number;
  answers: Array<object>;
  createdAt: Date;
}

const QuestionCard = ({
  _id,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt,
}: QuestionCardProps) => {
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span></span>
        </div>

        <h3 className="h3-semibold">{title}</h3>
        <div className="flex gap-2">
          {tags.map((tag) => (
            <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
          ))}
        </div>
        <div className="mt-11 flex items-center gap-2">
          <Image
            src={`/${author.picture}`}
            alt={author.name}
            width={24}
            height={24}
            className="rounded-full"
          />
          <p className="small-medium text-dark500_light700">{author.name}</p>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
