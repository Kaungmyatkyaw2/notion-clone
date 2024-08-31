"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import React from "react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Documentspage = () => {
  const { user } = useUser();
  const create = useMutation(api.documents.create);
  const router = useRouter();

  const handleCreate = async () => {
    const promise = create({ title: "Untitled" }).then((docId) => {
      router.push(`/documents/${docId}`);
    });
    toast.promise(promise, {
      loading: "Creating a document!",
      success: "Successfully created a document!",
      error: "Failed to create a document!",
    });
  };

  return (
    <div className="size-full flex-center flex-col space-y-4">
      <Image
        src={"/empty.png"}
        width={300}
        height={300}
        alt="Empty-image"
        className="dark:hidden"
      />
      <Image
        src={"/empty-dark.png"}
        width={300}
        height={300}
        alt="Empty-dark-image"
        className="hidden dark:block"
      />
      <h1>Welcome to {user?.firstName}&apos;s Kotion</h1>
      <Button onClick={handleCreate}>
        <PlusCircle className="mr-2 size-4" />
        Create Document
      </Button>
    </div>
  );
};

export default Documentspage;
