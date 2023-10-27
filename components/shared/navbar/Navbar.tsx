import { SignedIn, UserButton } from "@clerk/nextjs";
import React from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import MobileNav from "./MobileNav";
import GlobalSearch from "../search/GlobalSearch";

const Navbar = () => {
  return (
    <nav className="flex-center background-light900_dark200 fixed z-40 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12">
      {/* <Logo /> */}
      <GlobalSearch />
      <div className="flex-between gap-5">
        <ThemeSwitcher />
        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-10 w-10",
              },
              variables: {
                colorPrimary: "#ff7000",
              },
            }}
          />
        </SignedIn>
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
