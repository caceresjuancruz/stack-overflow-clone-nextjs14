"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import GlobalResult from "./GlobalResult";
import { images } from "@/constants/images";

const GlobalSearch = () => {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const query = searchParams.get("q");

  const [search, setSearch] = useState(query || "");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };

    setIsOpen(false);

    document.addEventListener("click", handleOutsideClick);

    return () => document.removeEventListener("click", handleOutsideClick);
  }, [path]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: search,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (query) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["global", "type"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, path, router, searchParams, query]);

  return (
    <div className="relative w-full max-w-[400px] max-lg:hidden xl:max-w-[600px]">
      <div className="background-light800_darkgradient light-border-2 relative flex min-h-[56px] grow items-center gap-1 rounded-xl border px-4">
        <Image
          src={images.search}
          alt="Search"
          width={24}
          height={24}
          className="cursor-pointer"
          unoptimized
        />
        <Input
          type="text"
          value={search}
          placeholder="Search globally"
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
            if ((!e.target.value || e.target.value === "") && isOpen)
              setIsOpen(false);
          }}
          className="paragraph-regular no-focus placeholder text-dark300_light900 border-none bg-transparent shadow-none outline-none"
        />
      </div>
      {isOpen && (
        <Suspense>
          <GlobalResult />
        </Suspense>
      )}
    </div>
  );
};

export default GlobalSearch;
