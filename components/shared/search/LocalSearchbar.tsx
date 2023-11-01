import { Input } from "@/components/ui/input";
import Image from "next/image";

interface CustomSearchbarProps {
  route: string;
  iconPosition: "left" | "right";
  iconSrc: string;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearchbar = ({
  route,
  iconPosition,
  iconSrc,
  placeholder,
  otherClasses,
}: CustomSearchbarProps) => {
  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={iconSrc}
          alt="Search"
          width={24}
          height={24}
          className="cursor-pointer"
          unoptimized
        />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value=""
        className="paragraph-regular no-focus placeholder border-none bg-transparent shadow-none outline-none"
      />

      {iconPosition === "right" && (
        <Image
          src={iconSrc}
          alt="Search"
          width={24}
          height={24}
          className="cursor-pointer"
          unoptimized
        />
      )}
    </div>
  );
};

export default LocalSearchbar;
