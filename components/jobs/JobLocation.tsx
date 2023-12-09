import Image from "next/image";
import React from "react";

interface JobLocationProps {
  job_country?: string;
  job_city?: string;
  job_state?: string;
}

const JobLocation = ({
  job_country,
  job_city,
  job_state,
}: JobLocationProps) => {
  return (
    <div className="background-light800_dark400 flex items-center justify-end gap-2 rounded-2xl px-3 py-1.5">
      <Image
        src={`https://flagsapi.com/${job_country}/flat/64.png`}
        alt="Country flag"
        width={16}
        height={16}
        unoptimized
        className="rounded-full"
      />

      <p className="body-medium text-dark400_light700">
        {job_city && `${job_city}, `}
        {job_state && `${job_state}, `}
        {job_country && `${job_country}`}
      </p>
    </div>
  );
};

export default JobLocation;
