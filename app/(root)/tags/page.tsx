import TagCard from "@/components/cards/TagCard";
import Filter from "@/components/shared/Filter";
import NoResults from "@/components/shared/NoResults";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.action";
import { SearchParamsProps } from "@/types";

export default async function TagsPage({ searchParams }: SearchParamsProps) {
  const result = await getAllTags({
    searchQuery: searchParams.q,
  });

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Tags</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          placeholder="Search by tag name..."
          iconPosition="left"
          iconSrc="/assets/icons/search.svg"
          route="/tags"
        />
        <Filter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {result.tags && result.tags.length > 0 ? (
          result.tags.map((tag) => (
            <TagCard key={tag._id} tag={JSON.parse(JSON.stringify(tag))} />
          ))
        ) : (
          <NoResults
            title="No tags yet 😢"
            description="¡Create a question to start interacting with the community!"
            link="/ask-question"
            linkTitle="Ask Question"
          />
        )}
      </section>
    </div>
  );
}
