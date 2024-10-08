"use client";

import React, { useMemo } from "react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import Toolbar from "@/components/document/toolbar";
import CoverImage from "@/components/document/cover-image";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

const DocumentDetailPage = ({
  params,
}: {
  params: { documentId: Id<"documents"> };
}) => {
  const Editor = useMemo(
    () => dynamic(() => import("@/components/document/editor"), { ssr: false }),
    []
  );

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId,
  });

  const update = useMutation(api.documents.update);

  if (document === undefined) {
    return (
      <div>
        <CoverImage.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <div>Not found!</div>;
  }

  const handleContentChange = (content: string) => {
    update({
      id: params.documentId,
      content,
    });
  };

  return (
    <div className="pb-40">
      <CoverImage url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document} />
        <Editor
          initialContent={document.content}
          onChange={handleContentChange}
        />
      </div>
    </div>
  );
};

export default DocumentDetailPage;
