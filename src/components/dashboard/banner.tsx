import React from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import { Button } from "../ui/button";
import ConfirmModal from "../modals/confirm-modal";

interface BannerProps {
  documentId: Id<"documents">;
}

const Banner = ({ documentId }: BannerProps) => {
  const router = useRouter();

  const remove = useMutation(api.documents.remove);
  const restore = useMutation(api.documents.restore);

  const handleRemove = () => {
    const promise = remove({ id: documentId });

    toast.promise(promise, {
      loading: "Deleting document...",
      success: "Document deleted successfully!",
      error: "Failed to delete document",
    });
    router.push("/documents");
  };

  const handleRestore = () => {
    const promise = restore({ id: documentId });

    toast.promise(promise, {
      loading: "Restoring document...",
      success: "Document restored successfully!",
      error: "Failed to restore document",
    });
  };
  return (
    <div className="w-full text-center bg-rose-500 text-sm p-2 text-white flex-center gap-4 flex-wrap">
      <p>This page is in the trash</p>
      <Button
        size={"sm"}
        onClick={handleRestore}
        variant={"outline"}
        className="border-white text-white bg-transparent hover:bg-primary/5 hover:text-white py-1 px-2"
      >
        Restore
      </Button>
      <ConfirmModal onConfirm={handleRemove}>
        <Button
          size={"sm"}
          variant={"outline"}
          className="border-white text-white bg-transparent hover:bg-primary/5 hover:text-white py-1 px-2"
        >
          Delete Forever
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default Banner;
