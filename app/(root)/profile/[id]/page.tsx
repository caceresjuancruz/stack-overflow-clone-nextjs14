import { getUserById, getUserInfo } from "@/database/actions/user.action";
import { URLProps } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignedIn, auth } from "@clerk/nextjs";
import Image from "next/image";
import { getJoinedDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProfileLink from "@/components/shared/ProfileLink";
import Stats from "@/components/shared/Stats";
import QuestionTab from "@/components/shared/QuestionTab";
import AnswerTab from "@/components/shared/AnswerTab";
import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  { params, searchParams }: URLProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const userId = params.id;
  const user = await getUserById({ userId });
  return {
    title: `${user.name} | Dev Overflow`,
  };
}

export default async function ProfilePage({ params, searchParams }: URLProps) {
  const { userId: clerkId } = await auth();
  const result = await getUserInfo({ userId: params.id });

  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Image
            src={result?.user?.avatar}
            alt="Avatar"
            width={140}
            height={140}
            className="rounded-full border-4 border-primary-500 object-cover"
            unoptimized
          />

          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">
              {result?.user?.name}
            </h2>
            <p className="paragraph-regular text-dark200_light800">
              @{result?.user?.username}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {result?.user?.portfolioWebsite && (
                <ProfileLink
                  imgUrl="/assets/icons/link.svg"
                  href={result?.user?.portfolioWebsite}
                  title="Portfolio"
                />
              )}

              {result?.user?.location && (
                <ProfileLink
                  imgUrl="/assets/icons/location.svg"
                  title={result?.user?.location}
                />
              )}

              <ProfileLink
                imgUrl="/assets/icons/calendar.svg"
                title={`Joined ${getJoinedDate(
                  result?.user?.joinedAt || new Date()
                )}`}
              />
            </div>

            {result?.user?.bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                {result?.user?.bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          <SignedIn>
            {clerkId === result?.user?.clerkId && (
              <Link href="/profile/edit">
                <Button
                  title="Edit profile"
                  className="paragraph-medium btn-secondary text-dark300_light900  light-border-2 min-h-[46px] min-w-[175px] border px-4 py-3"
                >
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>
      <Stats
        totalQuestions={result?.totalQuestions || 0}
        totalAnswers={result?.totalAnswers || 0}
        badges={result?.badgeCounts!}
        reputation={result?.reputation || 0}
      />
      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="top-posts"
            className="mt-5 flex w-full flex-col gap-6"
          >
            <QuestionTab
              userId={result?.user?._id}
              clerkId={clerkId}
              searchParams={searchParams}
            />
          </TabsContent>
          <TabsContent value="answers" className="flex w-full flex-col gap-6">
            <AnswerTab
              userId={result?.user?._id}
              clerkId={clerkId}
              searchParams={searchParams}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
