import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { images } from "@/constants/images";

interface NoResultsProps {
  title: string;
  description: string;
  link?: string;
  linkTitle?: string;
}

const NoResults = ({ title, description, link, linkTitle }: NoResultsProps) => {
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center">
      <Image
        src={images.lightIllustration}
        alt="No results"
        width={270}
        height={200}
        className="block object-contain dark:hidden"
        unoptimized
      />

      <Image
        src={images.darkIllustration}
        alt="No results"
        width={270}
        height={200}
        className="hidden object-contain dark:flex"
        unoptimized
      />

      <h2 className="h2-bold text-dark200_light900 mt-8">{title}</h2>
      <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center ">
        {description}
      </p>

      {link && (
        <Link aria-label={linkTitle} href={link}>
          <Button
            title={linkTitle}
            className="paragraph-medium mt-5 min-h-[46px] rounded-lg bg-primary-500 px-4 py-3 text-light-900 hover:bg-primary-500 dark:bg-primary-500 "
          >
            {linkTitle}
          </Button>
        </Link>
      )}
    </div>
  );
};

export default NoResults;
