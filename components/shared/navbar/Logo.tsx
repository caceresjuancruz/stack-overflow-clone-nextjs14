import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-1">
      <Image
        src="/assets/images/site-logo.svg"
        alt="DevFlow"
        width={23}
        height={23}
      />
      <p className="h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 max-sm:hidden">
        Dev <span className="text-primary-500">Overflow</span>
      </p>
    </Link>
  );
};

export default Logo;
