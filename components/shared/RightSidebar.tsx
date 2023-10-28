import UserMenu from "./navbar/UserMenu";

const RightSidebar = () => {
  return (
    <section className="background-light900_dark200 light-border custom-scrollbar shadow-light100_dark100 sticky right-0 top-0 z-40 flex h-screen flex-col justify-between overflow-y-auto border-l px-6 pb-12 pt-6 max-xl:hidden lg:z-50 lg:w-[266px]">
      <div>
        <UserMenu />
      </div>
    </section>
  );
};

export default RightSidebar;
