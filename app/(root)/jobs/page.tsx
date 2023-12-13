import NoResults from "@/components/shared/NoResults";
import Pagination from "@/components/shared/Pagination";
import { Metadata } from "next";

import {
  fetchCountries,
  fetchJobs,
  fetchLocation,
} from "@/lib/actions/job.action";

import { Job } from "@/types";
import JobsFilter from "@/components/jobs/JobsFilter";
import JobCard from "@/components/cards/JobCard";

export const metadata: Metadata = {
  title: "Jobs | Dev Overflow",
};

interface JobsPageProps {
  searchParams: {
    q: string;
    location: string;
    page: string;
  };
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const userLocation = await fetchLocation();

  const jobs = await fetchJobs({
    query:
      `${searchParams.q},${searchParams.location}` ??
      `Software Engineer in ${userLocation}`,
    page: searchParams.page ?? 1,
  });

  const countries = await fetchCountries();
  const page = parseInt(searchParams.page ?? 1);

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Jobs</h1>

      <div className="flex">
        <JobsFilter countriesList={countries} />
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {jobs && jobs.length > 0 ? (
          jobs.map((job: Job, index: number) => (
            <JobCard key={index} job={job} />
          ))
        ) : (
          <NoResults
            title="No jobs available"
            description="There are no jobs available at the moment. Please check back later."
            link="/"
            linkTitle="Go home"
          />
        )}
      </section>
      <div className="mt-10">
        <Pagination pageNumber={page} isNext={jobs?.length === 10 || false} />
      </div>
    </>
  );
}
