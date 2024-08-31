import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Trash,
} from "lucide-react";
import React from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useUser } from "@clerk/clerk-react";

interface ItemProps {
  id?: Id<"documents">;
  label: string;
  onClick?: () => void;
  icon: LucideIcon;
  active?: boolean;
  isSearch?: boolean;
  level?: number;
  documentIcon?: string;
  expanded?: boolean;
  onExpand?: () => void;
}

const SidebarItem = ({
  label,
  onClick,
  icon: Icon,
  id,
  active,
  level = 0,
  documentIcon,
  expanded,
  onExpand,
  isSearch,
}: ItemProps) => {
  const create = useMutation(api.documents.create);
  const archive = useMutation(api.documents.archive);

  const router = useRouter();
  const { user } = useUser();

  const handleExpand = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    onExpand?.();
  };

  const handleCreate = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (!id) {
      return;
    }
    const promise = create({ title: "Untitled", parentDocument: id }).then(
      (docId) => {
        if (!expanded) {
          onExpand?.();
        }
        router.push(`/documents/${docId}`);
      }
    );

    toast.promise(promise, {
      loading: "Creating a document!",
      success: "Successfully created a document!",
      error: "Failed to create a document!",
    });
  };

  const handleArchive = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (!id) {
      return;
    }
    const promise = archive({ id }).then(() => {
      router.push(`/documents`);
    });

    toast.promise(promise, {
      loading: "Moving document to trash!",
      success: "Successfully archived a document!",
      error: "Failed to archive a document!",
    });
  };

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: `${level * 12 + 12}px` }}
      className={cn(
        "group min-h-9 text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium ",
        active && "bg-primary/5 text-primary"
      )}
    >
      {!!id && (
        <div
          onClick={handleExpand}
          role="button"
          className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
        >
          <ChevronIcon className="size-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-2 h-5">{documentIcon}</div>
      ) : (
        <Icon className="shrink-0 h-5 mr-2" />
      )}
      <span className="truncate">{label}</span>
      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">CMD</span>K
        </kbd>
      )}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              onClick={(e) => {
                e.stopPropagation();
              }}
              asChild
            >
              <div
                role="button"
                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
              >
                <MoreHorizontal className="size-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="w-60 z-[9999]"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem
                onClick={handleArchive}
                className="cursor-pointer"
              >
                <Trash className="size-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">
                Last edited by : {user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            role="button"
            onClick={handleCreate}
            className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
          >
            <Plus className="size-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarItem;

SidebarItem.Skeleton = function ItemSkeleton({
  level = 0,
}: {
  level?: number;
}) {
  return (
    <div
      style={{ paddingLeft: `${level * 12 + 12}px` }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="size-4" />
      <Skeleton className="h-4 w-[40%]" />
    </div>
  );
};
