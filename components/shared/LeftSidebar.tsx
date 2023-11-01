"use client";

import { sidebarLinks } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "../ui/button";
import Logo from "./navbar/Logo";

const LeftSidebar = () => {
  const pathname = usePathname();

  return (
    <section className="background-light900_dark200 light-border custom-scrollbar shadow-light100_dark100 sticky left-0 top-0 z-40 flex h-screen flex-col justify-between overflow-y-auto border-r px-4 pb-12 pt-6 max-sm:hidden lg:z-50 lg:w-[266px]">
      <div className="hidden lg:block">
        <Logo />
      </div>
      <div className="flex h-full flex-1 flex-col gap-6 pt-20 lg:pt-16">
        {sidebarLinks.map((item) => {
          const isActive =
            (pathname.includes(item.route) && item.route.length > 1) ||
            pathname === item.route;

          return (
            <Link
              href={item.route}
              key={item.route}
              className={`${
                isActive
                  ? "primary-gradient rounded-lg text-light-900"
                  : "text-dark300_light900"
              } flex items-center justify-start gap-4 bg-transparent p-4 `}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className={`${isActive ? "" : "invert-colors"}`}
                unoptimized
              />
              <p
                className={`${
                  isActive ? "base-bold" : "base-medium"
                } max-lg:hidden`}
              >
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>

      <SignedOut>
        <div className="flex flex-col gap-3">
          <Link href="/sign-in">
            <Button className="small-medium btn-secondary no-focus min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              <Image
                src="/assets/icons/account.svg"
                alt="login"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
                unoptimized
              />
              <span className="primary-text-gradient max-lg:hidden">
                Log In
              </span>
            </Button>
          </Link>

          <Link href="/sign-up">
            <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 no-focus min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              <Image
                src="/assets/icons/sign-up.svg"
                alt="sign up"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
                unoptimized
              />
              <span className="max-lg:hidden">Sign Up</span>
            </Button>
          </Link>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="small-medium text-dark400_light900 w-full cursor-pointer">
          <SignOutButton>
            <div className="base-medium flex items-center justify-start gap-4 bg-transparent px-4">
              <Image
                src="/assets/icons/logout.svg"
                alt="LogOut"
                width={20}
                height={20}
                className="invert-colors"
                unoptimized
              />
              <p className="max-lg:hidden">Logout</p>
            </div>
          </SignOutButton>{" "}
        </div>
      </SignedIn>
    </section>
  );
};

export default LeftSidebar;
