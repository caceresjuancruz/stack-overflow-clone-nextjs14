import Link from "next/link";
import UserMenu from "./navbar/UserMenu";
import Image from "next/image";
import RenderTag from "./RenderTag";
import { getHotQuestions } from "@/lib/actions/question.action";
import { getPopularTags } from "@/lib/actions/tag.action";

// const popularTags = [
//   { _id: "1", name: "javascript", totalQuestions: 5 },
//   { _id: "2", name: "react", totalQuestions: 5 },
//   { _id: "3", name: "next", totalQuestions: 5 },
//   { _id: "4", name: "vue", totalQuestions: 2 },
//   { _id: "5", name: "redux", totalQuestions: 10 },
// ];

const RightSidebar = async () => {
  const hotQuestions = await getHotQuestions();
  const popularTags = await getPopularTags();

  return (
    <section className="light-border custom-scrollbar shadow-light100_dark100 sticky right-0 top-0 z-40 flex h-screen w-[350px] flex-col gap-16 overflow-y-auto border-l bg-opacity-50 px-6 pb-12 pt-6 backdrop-blur-xl max-xl:hidden lg:z-50">
      <div>
        <UserMenu />
      </div>
      <div className="">
        <div>
          <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
          <div className="mt-7 flex w-full flex-col gap-4">
            {hotQuestions &&
            Array.isArray(hotQuestions) &&
            hotQuestions.length > 0 ? (
              hotQuestions.map((question: any) => (
                <Link
                  aria-label="Question card"
                  href={`/questions/${question._id}`}
                  key={question._id}
                  className="hover:background-hover flex min-h-[41px] cursor-pointer items-center justify-between gap-7 rounded-lg p-2"
                >
                  <p className="body-medium text-dark500_light700">
                    {question.title}
                  </p>
                  <Image
                    src="/assets/icons/chevron-right.svg"
                    alt="chevron"
                    width={20}
                    height={20}
                    className="invert-colors"
                    unoptimized
                  />
                </Link>
              ))
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="mt-16">
          <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
          <div className="mt-7 flex flex-col gap-4">
            {popularTags &&
            Array.isArray(popularTags) &&
            popularTags.length > 0 ? (
              popularTags.map((tag: any) => (
                <RenderTag
                  key={tag._id}
                  _id={tag._id}
                  name={tag.name}
                  totalQuestions={tag.totalQuestions}
                  showCount
                />
              ))
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
