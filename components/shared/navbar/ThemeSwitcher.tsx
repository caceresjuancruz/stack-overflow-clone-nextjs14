"use client";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

import Sun from "./Sun";
import { useTheme } from "@/context/ThemeProvider";
import Moon from "./Moon";
import { themes } from "@/constants";
import Image from "next/image";

const ThemeSwitcher = () => {
  const { mode, setMode } = useTheme();

  return (
    <div>
      <Menubar className="relative  border-none bg-transparent shadow-none">
        <MenubarMenu>
          <MenubarTrigger
            aria-label="Switch theme"
            className="cursor-pointer focus:bg-light-900 data-[state=open]:bg-light-900 dark:focus:bg-dark-200 dark:data-[state=open]:bg-dark-200"
          >
            {mode === "light" ? <Sun /> : <Moon />}
          </MenubarTrigger>
          <MenubarContent className="absolute right-[-3rem] min-w-[120px] rounded border bg-light-900 py-2 dark:border-dark-400 dark:bg-dark-300">
            {themes.map((item) => (
              <MenubarItem
                aria-label={item.label}
                key={item.value}
                className="flex cursor-pointer items-center gap-4 px-2.5 py-2 focus:bg-light-800 dark:focus:bg-dark-400"
                onClick={() => {
                  setMode(item.value);
                  if (item.value !== "system") {
                    localStorage.theme = item.value;
                  } else {
                    localStorage.removeItem("theme");
                  }
                }}
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={16}
                  height={16}
                  className={`${mode === item.value && "active-theme"}`}
                  unoptimized
                />
                <p
                  className={`body-semibold text-light-500 ${
                    mode === item.value
                      ? "text-primary-500"
                      : "text-dark100_light900"
                  }`}
                >
                  {item.label}
                </p>
              </MenubarItem>
            ))}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};

export default ThemeSwitcher;
