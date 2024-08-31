import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { ImageIcon, Trash } from "lucide-react";
import { useCoverImage } from "@/hooks/useCoverImage";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "../../../convex/_generated/dataModel";
import { useEdgeStore } from "@/lib/edgestore";
import { Skeleton } from "../ui/skeleton";

interface CoverImageProps {
  url?: string;
  isPreview?: boolean;
}

const CoverImage = ({ isPreview, url }: CoverImageProps) => {
  const coverImage = useCoverImage();
  const params = useParams();

  const { edgestore } = useEdgeStore();

  const removeCoverImage = useMutation(api.documents.removeCoverImage);

  const handleRemoveCoverImage = async () => {
    if (url) {
      await edgestore.publicFiles.delete({
        url,
      });
    }
    removeCoverImage({
      id: params.documentId as Id<"documents">,
    });
  };

  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group",
        !url && "h-[12vh]",
        url && "bg-muted"
      )}
    >
      {!!url && (
        <Image src={url} alt="Cover_Image" className="object-cover" fill />
      )}
      {!!url && !isPreview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            onClick={() => coverImage.onReplace(url)}
            className="text-muted-foreground text-xs"
            variant={"outline"}
            size={"sm"}
          >
            <ImageIcon className="size-4 mr-2" />
            Change cover
          </Button>
          <Button
            onClick={handleRemoveCoverImage}
            className="text-muted-foreground text-xs"
            variant={"outline"}
            size={"sm"}
          >
            <Trash className="size-4 mr-2" />
            Remove cover
          </Button>
        </div>
      )}
    </div>
  );
};

export default CoverImage;

CoverImage.Skeleton = function CoverImageSkeleton(){
  return <Skeleton className="w-full h-[12vh]"/>
}