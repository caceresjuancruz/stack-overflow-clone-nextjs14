"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { images } from "@/constants/images";
import { SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const NavContent = () => {
  const pathname = usePathname();

  return (
    <section className="flex h-full flex-1 flex-col gap-4 pt-12">
      {sidebarLinks.map((item) => {
        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;

        return (
          <SheetClose asChild key={item.route}>
            <Link
              href={item.route}
              className={`${
                isActive ? "primary-gradient text-light-900" : "text-dark300_light900"
              } rounded-lg bg-transparent`}
            >
              <span className="flex items-center justify-start gap-4 p-4">
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  width={20}
                  height={20}
                  className={`${isActive ? "" : "invert-colors"}`}
                  unoptimized
                />
                <p className={`${isActive ? "base-medium" : "base-medium"}`}>
                  {item.label}
                </p>
              </span>
            </Link>
          </SheetClose>
        );
      })}
    </section>
  );
};

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src={images.hamburger}
          width={36}
          height={36}
          alt="Menu"
          className="invert-colors sm:hidden"
          unoptimized
          priority
        />
      </SheetTrigger>
      <SheetContent side="left" className="background-light900_dark200 border-none">
        <Logo />
        <div className="no-scrollbar  flex h-full flex-col justify-between overflow-y-auto">
          <SheetClose asChild>
            <NavContent />
          </SheetClose>

          <SignedOut>
            <div className="mt-12 flex flex-col gap-3 pb-6">
              <SheetClose asChild>
                <Link href="/sign-in">
                  <Button
                    title="Log in"
                    className="small-medium light-border-2 btn-secondary no-focus min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none"
                  >
                    <span className="primary-text-gradient">Log In</span>
                  </Button>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link href="/sign-up">
                  <Button
                    title="Sign up"
                    className="small-medium light-border-2 btn-tertiary text-dark400_light900 no-focus min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none"
                  >
                    Sign Up
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </SignedOut>

          <SignedIn>
            <SheetClose asChild>
              <div className="small-medium text-dark400_light900 mt-12 w-full cursor-pointer py-3">
                <SignOutButton>
                  <div className="base-medium flex select-none items-center justify-start gap-4 bg-transparent p-4">
                    <Image
                      src={images.logOut}
                      alt="LogOut"
                      width={20}
                      height={20}
                      className="invert-colors"
                      unoptimized
                    />
                    <p>Logout</p>
                  </div>
                </SignOutButton>{" "}
              </div>
            </SheetClose>
          </SignedIn>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
