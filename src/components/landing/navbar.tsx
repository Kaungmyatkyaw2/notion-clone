"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import Logo from "./logo";
import { useScrollTop } from "@/hooks/useScrollTop";
import { cn } from "@/lib/utils";
import ModeToggler from "@/components/common/mode-toggler";
import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Spinner } from "@/components/common/spinner";

const Navbar = () => {
  const isScrolled = useScrollTop();
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div
      className={cn(
        "px-6 py-4 flex items-center justify-between fixed top-0 left-0 w-full bg-background dark:bg-[#1f1f1f]",
        isScrolled ? "border-b shadow-sm" : ""
      )}
    >
      <Logo />
      <div className="w-fit flex items-center gap-x-4">
        {isLoading && <Spinner />}
        {!isAuthenticated && !isLoading ? (
          <SignInButton mode="modal">
            <Button>Sign in</Button>
          </SignInButton>
        ) : (
          <Button variant={"ghost"} size={"sm"} asChild>
            <UserButton />
          </Button>
        )}
        <ModeToggler />
      </div>
    </div>
  );
};

export default Navbar;
