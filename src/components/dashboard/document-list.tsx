"use client";

import React, { useState } from "react";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import SidebarItem from "./sidebar-item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";

interface DocumentListProps {
  parentDocumentId?: Id<"documents">;
  level?: number;
  data?: Doc<"documents">[];
}

const DocumentList = ({
  parentDocumentId,
  level = 0,
  data,
}: DocumentListProps) => {
  const param = useParams();
  const router = useRouter();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (documentId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [documentId]: !prev[documentId],
    }));
  };

  const documents = useQuery(api.documents.getSidebar, {
    parentDocument: parentDocumentId,
  });

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  if (documents == undefined) {
    return (
      <>
        <SidebarItem.Skeleton level={level} />

        {level == 0 && (
          <>
            <SidebarItem.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <p
        style={{
          paddingLeft: `${level ? `${level * 12 + 25}px` : undefined}`,
        }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          expanded && "last:block",
          level == 0 && "hidden"
        )}
      >
        No Page Inside
      </p>
      {documents?.map((doc) => (
        <div key={doc._id}>
          <SidebarItem
            id={doc._id}
            onClick={() => onRedirect(doc._id)}
            label={doc.title}
            icon={FileIcon}
            documentIcon={doc.icon}
            active={param.documentId == doc._id}
            level={level}
            onExpand={() => onExpand(doc._id)}
            expanded={expanded[doc._id]}
          />
          {expanded[doc._id] && (
            <DocumentList
              level={level + 1}
              parentDocumentId={doc._id}
            />
          )}
        </div>
      ))}
    </>
  );
};

export default DocumentList;
