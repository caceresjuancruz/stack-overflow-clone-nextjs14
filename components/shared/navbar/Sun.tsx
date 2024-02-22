import Image from "next/image";

const Sun = () => {
  return (
    <Image
      src={"/assets/icons/sun.svg"}
      alt="Sun"
      width={20}
      height={20}
      className="active-theme"
      unoptimized
    />
  );
};

export default Sun;
