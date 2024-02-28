import { SignedIn, UserButton } from "@clerk/nextjs";
import ThemeSwitcher from "./ThemeSwitcher";
import MobileNav from "./MobileNav";
import { Suspense } from "react";

const UserMenu = () => {
  return (
    <div className="flex-between sm:flex-end gap-2 sm:gap-5">
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
      <Suspense>
        <MobileNav />
      </Suspense>
    </div>
  );
};

export default UserMenu;
