import RenderTag from "../shared/RenderTag";
import {
  formatAndDivideNumber,
  getTimestamp,
  processJobTitle,
} from "@/lib/utils";
import Link from "next/link";
import Metric from "../shared/Metric";
import { toast } from "../ui/use-toast";
import { title } from "process";
import QuestionCard from "./QuestionCard";
import { Job } from "@/types";
import Image from "next/image";
import JobLocation from "../jobs/JobLocation";

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  const {
    employer_logo,
    employer_website,
    job_employment_type,
    job_title,
    job_description,
    job_apply_link,
    job_city,
    job_state,
    job_country,
  } = job;

  return (
    <div className="background-light900_dark200 light-border shadow-light100_darknone flex flex-col items-start gap-6 rounded-lg border p-6 sm:flex-row sm:p-8">
      <div className="flex w-full justify-end sm:hidden">
        <JobLocation
          job_country={job_country}
          job_state={job_state}
          job_city={job_city}
        />
      </div>

      <div className="flex items-center gap-6">
        {employer_logo ? (
          <Link
            href={employer_website ?? "/jobs"}
            target="_blank"
            className="background-light800_dark400 relative h-16 w-16 rounded-xl"
          >
            <Image
              src={employer_logo}
              alt="Company logo"
              fill
              className="h-full w-full object-contain p-2"
              unoptimized
            />
          </Link>
        ) : (
          <Image
            src="/assets/images/site-logo.svg"
            alt="Default site logo"
            width={64}
            height={64}
            className="rounded-[10px]"
          />
        )}
      </div>

      <div className="w-full">
        <div className="flex-between flex-wrap gap-2">
          <p className="base-semibold text-dark200_light900">
            {processJobTitle(job_title)}
          </p>

          <div className="hidden sm:flex">
            <JobLocation
              job_country={job_country}
              job_state={job_state}
              job_city={job_city}
            />
          </div>
        </div>

        <p className="body-regular text-dark500_light700 mt-2 line-clamp-2">
          {job_description?.slice(0, 200)}
        </p>

        <div className="flex-between mt-8 flex-wrap gap-6">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/icons/clock.svg"
                alt="clock"
                width={20}
                height={20}
                unoptimized
              />
              <p className="body-medium text-light-500">
                {job_employment_type}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Image
                src="/assets/icons/currency-dollar-circle.svg"
                alt="dollar symbol"
                width={20}
                height={20}
                unoptimized
              />
              <p className="body-medium text-light-500">Not disclosed</p>
            </div>
          </div>

          <Link
            href={job_apply_link ?? "/jobs"}
            className="flex items-center gap-2"
            target="_blank"
          >
            <p className="body-semibold primary-text-gradient">View job</p>

            <Image
              src="/assets/icons/arrow-up-right.svg"
              alt="arrow up right"
              width={20}
              height={20}
              unoptimized
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
