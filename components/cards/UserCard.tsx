import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import RenderTag from "../shared/RenderTag";

interface UserCardProps {
  user: {
    _id: string;
    clerkId: string;
    avatar: string;
    name: string;
    username: string;
    interactedTags: {
      _id: string;
      name: string;
    }[];
  };
}

const UserCard = async ({ user }: UserCardProps) => {
  return (
    <Link
      aria-label="User card"
      href={`/profile/${user.clerkId}`}
      className="shadow-light100_darknone w-full rounded-2xl max-xs:min-w-full xs:w-[260px]"
    >
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <Image
          src={user.avatar}
          alt="User avatar"
          width={100}
          height={100}
          className="rounded-full"
          unoptimized
        />

        <div className="mt-4 text-center">
          <p className="h3-bold text-dark200_light900 line-clamp-1">
            {user.name}
          </p>
          <p className="body-regular text-dark500_light500 mt-2">
            @{user.username}
          </p>
        </div>

        <div className="mt-5">
          {user.interactedTags && user.interactedTags.length > 0 ? (
            <div className="flex items-center justify-center gap-2 overflow-hidden text-ellipsis">
              {user.interactedTags.map((tag: any) => (
                <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
              ))}
            </div>
          ) : (
            <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
              No tags yet
            </Badge>
          )}
        </div>
      </article>
    </Link>
  );
};

export default UserCard;
