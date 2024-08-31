"use client";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const EnterBtn = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center">
        <Spinner size={"lg"} />
      </div>
    );
  }

  if (!isAuthenticated && !isLoading) {
    return (
      <SignInButton>
        <Button>
          Enter Kotion
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </SignInButton>
    );
  }

  return (
    <Button asChild>
      <Link href={"/documents"}>
        Enter Kotion
        <ArrowRight className="size-4 ml-2" />
      </Link>
    </Button>
  );
};

export default EnterBtn;
