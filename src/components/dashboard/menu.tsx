import React from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, Trash } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface MenuProps {
  documentId: Id<"documents">;
}

const Menu = ({ documentId }: MenuProps) => {
  const router = useRouter();
  const { user } = useUser();

  const archive = useMutation(api.documents.archive);

  const handleArchive = () => {
    const promise = archive({ id: documentId }).then(() => {
      router.push(`/documents`);
    });

    toast.promise(promise, {
      loading: "Moving document to trash!",
      success: "Successfully archived a document!",
      error: "Failed to archive a document!",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"sm"} variant={"ghost"}>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60 z-[99999]"
        align="end"
        alignOffset={8}
        forceMount
      >
        <DropdownMenuItem onClick={handleArchive}>
          <Trash className="size-4 mr-2" />
          Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="text-xs text-muted-foreground p-2">
          Last edited by : {user?.fullName}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Menu;


Menu.Skeleton = function MenuSkeleton(){
    return <Skeleton className="h-10 w-10"/>
}