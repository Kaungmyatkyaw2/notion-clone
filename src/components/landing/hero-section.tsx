import Image from "next/image";
import React from "react";

const HeroSection = () => {
  return (
    <div className="flex items-center justify-center gap-x-4 max-w-5xl">
      <div className="w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] md:w-[350px] md:h-[350px] relative">
        <Image
          src={"/documents-light.png"}
          fill
          alt="Hero Page Documents Image"
          className="object-contain dark:hidden"
        />
        <Image
          src={"/documents-dark.png"}
          fill
          alt="Hero Page Documents Image"
          className="object-contain hidden dark:block"
        />
      </div>
      <div className="w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] md:w-[350px] md:h-[350px] relative md:block hidden">
        <Image
          src={"/reading-light.png"}
          fill
          alt="Hero Page Reading Image"
          className="object-contain dark:hidden"
        />
        <Image
          src={"/reading-dark.png"}
          fill
          alt="Hero Page Reading Image"
          className="object-contain hidden dark:block"
        />
      </div>
    </div>
  );
};

export default HeroSection;
