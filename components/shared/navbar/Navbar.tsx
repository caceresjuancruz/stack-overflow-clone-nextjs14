import { Suspense } from "react";
import GlobalSearch from "../search/GlobalSearch";
import Logo from "./Logo";
import UserMenu from "./UserMenu";

const Navbar = () => {
  return (
    <nav className="flex-between xl:flex-center background-light900_dark200 light-border fixed z-50 w-full gap-5 border-b p-6 shadow-light-300 dark:shadow-none sm:px-12 lg:z-40">
      <div className="block lg:invisible xl:hidden">
        <Logo />
      </div>
      <Suspense>
        <GlobalSearch />
      </Suspense>
      <div className="block xl:hidden">
        <UserMenu />
      </div>
    </nav>
  );
};

export default Navbar;
