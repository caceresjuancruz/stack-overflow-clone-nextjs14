import UserCard from "@/components/cards/UserCard";
import Filter from "@/components/shared/Filter";
import NoResults from "@/components/shared/NoResults";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community | Dev Overflow",
};

export default async function CommunityPage({
  searchParams,
}: SearchParamsProps) {
  const result = await getAllUsers({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Community</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          placeholder="Search for amazing minds"
          iconPosition="left"
          iconSrc="/assets/icons/search.svg"
          route="/community"
          otherClasses="flex-1"
        />
        <Filter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {result.users && result.users.length > 0 ? (
          result.users.map((user) => (
            <UserCard key={user._id} user={JSON.parse(JSON.stringify(user))} />
          ))
        ) : (
          <NoResults
            title="No users yet 😢"
            description="¡Sign-up to join the best developers community!"
            link="/sign-up"
            linkTitle="Sign Up"
          />
        )}
      </section>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams.page ? +searchParams.page : 1}
          isNext={result.isNext || false}
        />
      </div>
    </>
  );
}
