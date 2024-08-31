import Image from "next/image";
import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center justify-center gap-x-2">
      <Image src={"/logo.png"} width={40} height={40} alt="logo" />
      <h1 className="font-bold md:text-lg text-base sm:block hidden">Kotion</h1>
    </div>
  );
};

export default Logo;
