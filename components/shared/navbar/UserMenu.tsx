import { SignedIn, UserButton } from "@clerk/nextjs";
import { Suspense } from "react";
import MobileNav from "./MobileNav";
import ThemeSwitcher from "./ThemeSwitcher";

const UserMenu = () => {
  return (
    <div className="flex-between sm:flex-end gap-2 sm:gap-5">
      <ThemeSwitcher />
      <SignedIn>
        <UserButton
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
