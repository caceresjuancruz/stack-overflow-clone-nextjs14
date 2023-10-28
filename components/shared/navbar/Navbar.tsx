import GlobalSearch from "../search/GlobalSearch";
import Logo from "./Logo";
import UserMenu from "./UserMenu";

const Navbar = () => {
  return (
    <nav className="flex-between xl:flex-center background-light900_dark200 fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12 lg:z-40">
      <div className="block xl:hidden">
        <Logo />
      </div>
      <GlobalSearch />

      <div className="block xl:hidden">
        <UserMenu />
      </div>
    </nav>
  );
};

export default Navbar;
