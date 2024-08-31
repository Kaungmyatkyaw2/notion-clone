import React from "react";
import { Button } from "@/components/ui/button";
import Logo from "./logo";

const Footer = () => {
  return (
    <div className="w-full flex items-center md:justify-between justify-start p-6 bg-background dark:bg-[#1f1f1f]">
      <div className="md:block hidden">
        <Logo />
      </div>

      <div className="w-full flex items-center md:justify-end justify-between gap-x-2">
        <Button className="" variant={"ghost"}>
          Privacy
        </Button>
        <Button className="" variant={"ghost"}>
          Policy
        </Button>
      </div>
    </div>
  );
};

export default Footer;
