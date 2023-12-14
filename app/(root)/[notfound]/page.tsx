import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 | Dev Overflow",
};

export default function NotFoundPage() {
  return (
    <div className="text-dark100_light900 mt-36 flex flex-col items-center justify-center gap-3">
      <ExclamationTriangleIcon className="h-20 w-20 text-primary-500" />
      <h1 className="h1-bold text-9xl">Oops!</h1>
      <p className="paragraph-semibold text-2xl">Page Not Found</p>
      <p className="paragraph-regular">
        We&apos;re sorry, we couldn&apos;t find the page you requested.
      </p>
      <Link
        href="/"
        className="cursor-pointer text-primary-500 hover:underline"
      >
        <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
          Go to Home
        </Button>
      </Link>
    </div>
  );
}
