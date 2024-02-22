"use client";
import { HomePageFilters } from "@/constants/filters";
import { Button } from "../ui/button";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";

const HomeFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [active, setActive] = useState("newest");

  const handleTypeClick = (item: string) => {
    if (active === item) {
      setActive("");

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: null,
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActive(item);

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: item.toLowerCase(),
      });

      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((item) => (
        <Button
          title="Select filter type"
          key={item.value}
          onClickCapture={() => handleTypeClick(item.value)}
          className={`body-medium  rounded-lg px-6 py-3 capitalize shadow-none dark:bg-dark-300 ${
            active === item.value
              ? "bg-primary-100 dark:bg-dark-400 "
              : "bg-light-800"
          }`}
        >
          <span
            className={`${
              active === item.value ? "primary-text-gradient" : "text-light-500"
            }`}
          >
            {item.name}
          </span>
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
