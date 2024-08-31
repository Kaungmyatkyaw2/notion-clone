"use client";

import { useQuery } from "convex/react";
import React from "react";
import { api } from "../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "../../../convex/_generated/dataModel";
import { MenuIcon } from "lucide-react";
import DocumentTitle from "./document-title";
import Banner from "./banner";
import Menu from "./menu";
import Publish from "./publish";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

const DocumentNavbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
  const params = useParams();
  const doc = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<"documents">,
  });

  if (doc === undefined) {
    return (
      <nav className="bg-background dark:bg-[#1f1f1f] px-3 py-2 w-full flex items-center justify-between">
        <DocumentTitle.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    );
  }

  if (doc === null) {
    return null;
  }

  return (
    <>
      <nav className="bg-background dark:bg-[#1f1f1f] px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            role="button"
            className="size-6 text-muted-foreground cursor-pointer"
            onClick={onResetWidth}
          />
        )}

        <div className="flex items-center justify-between w-full">
          <DocumentTitle initialData={doc} />
          <div className="flex items-center gap-x-2">
            <Publish initialData={doc} />
            <Menu documentId={doc._id} />
          </div>
        </div>
      </nav>
      {doc.isArchived && <Banner documentId={doc._id} />}
    </>
  );
};

export default DocumentNavbar;
