"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ErrorPage = () => {
  return (
    <div className="h-full flex-center flex-col space-y-4">
      <Image
        src={"/error-light.png"}
        height={300}
        width={300}
        alt="error"
        className="dark:hidden block"
      />
      <Image
        src={"/error-dark.png"}
        height={300}
        width={300}
        alt="error"
        className="dark:block hidden"
      />
      <h1 className="text-xl font-medium">Something went wrong!</h1>
      <Button asChild>
        <Link href="/documents">Go Back</Link>
      </Button>
    </div>
  );
};

export default ErrorPage;
