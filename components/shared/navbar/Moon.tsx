import Image from "next/image";

const Moon = () => {
  return (
    <Image
      src={"/assets/icons/moon.svg"}
      alt="Moon"
      width={20}
      height={20}
      className="active-theme"
      unoptimized
    />
  );
};

export default Moon;
