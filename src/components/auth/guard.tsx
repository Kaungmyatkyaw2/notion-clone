"use client";

import { useConvexAuth } from "convex/react";
import React from "react";
import { Spinner } from "../common/spinner";
import { redirect } from "next/navigation";

const Guard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="flex-center size-full">
        <Spinner size={"icon"} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect("/");
  }

  return children;
};

export default Guard;
