"use client";

import { formUrlQuery } from "@/lib/utils";
import { Country } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import LocalSearchbar from "../shared/search/LocalSearchbar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Image from "next/image";

interface JobsFilterProps {
  countriesList: Country[];
}

const JobsFilter = ({ countriesList }: JobsFilterProps) => {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();

  const handleUpdateParams = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "location",
      value,
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="relative mt-11 flex w-full justify-between gap-5 max-sm:flex-col sm:items-center">
      <LocalSearchbar
        route={path}
        iconPosition="left"
        iconSrc="/assets/icons/search.svg"
        placeholder="Job Title, Company, or Keywords"
        otherClasses="flex-1 max-sm:w-full"
      />

      <Select onValueChange={(value) => handleUpdateParams(value)}>
        <SelectTrigger className="body-regular light-border-2 background-light800_dark300 text-dark500_light700 line-clamp-1 flex min-h-[56px] items-center gap-3 border p-4 focus:ring-0 focus:ring-offset-0 sm:max-w-[210px]">
          <Image
            src="/assets/icons/carbon-location.svg"
            alt="Location"
            width={18}
            height={18}
            unoptimized
          />
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select Location" />
          </div>
        </SelectTrigger>

        <SelectContent className="body-semibold text-dark500_light700 light-border-2 max-h-[350px] max-w-[250px] border bg-light-900 dark:bg-dark-300">
          <SelectGroup>
            {countriesList && countriesList.length > 0 ? (
              countriesList.map((country: Country) => (
                <SelectItem
                  key={country.name.common}
                  value={country.name.common}
                  className="cursor-pointer px-6 py-3 hover:bg-light-800 dark:hover:bg-dark-400"
                >
                  {country.name.common}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="No results found">No results found</SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default JobsFilter;
