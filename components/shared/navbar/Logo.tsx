import { images } from "@/constants/images";
import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link
      aria-label="DevOverflow logo"
      href="/"
      className="flex select-none items-center gap-1"
    >
      <Image
        src={images.logo}
        alt="DevFlow"
        width={23}
        height={23}
        unoptimized
        priority
      />
      <p className="h2-semibold font-spaceGrotesk text-dark-100 dark:text-light-900 max-sm:hidden">
        Dev<span className="h2-bold text-primary-500">Overflow</span>
      </p>
    </Link>
  );
};

export default Logo;
