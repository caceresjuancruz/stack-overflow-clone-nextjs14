"use client";

import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface CustomSearchbarProps {
  route: string;
  iconPosition: "left" | "right";
  iconSrc: string;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearchbar = ({
  route,
  iconPosition,
  iconSrc,
  placeholder,
  otherClasses,
}: CustomSearchbarProps) => {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q");

  const [search, setSearch] = useState(query || "");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "q",
          value: search,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (path === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["q"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, route, path, router, searchParams, query]);

  return (
    <div
      className={`background-light800_darkgradient light-border-2 flex min-h-[56px] grow items-center gap-4 rounded-[10px] border px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={iconSrc}
          alt="Search"
          width={24}
          height={24}
          className="cursor-pointer"
          unoptimized
        />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="paragraph-regular no-focus placeholder text-dark300_light900 border-none bg-transparent shadow-none outline-none"
      />

      {iconPosition === "right" && (
        <Image
          src={iconSrc}
          alt="Search"
          width={24}
          height={24}
          className="cursor-pointer"
          unoptimized
        />
      )}
    </div>
  );
};

export default LocalSearchbar;
