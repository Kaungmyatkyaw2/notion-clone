import { useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Spinner } from "../common/spinner";
import { Search, Trash, Undo } from "lucide-react";
import { Input } from "../ui/input";
import ConfirmModal from "../modals/confirm-modal";

const TrashBox = () => {
  const router = useRouter();
  const param = useParams();
  const documents = useQuery(api.documents.getArchivedDocuments, {});
  const restore = useMutation(api.documents.restore);
  const remove = useMutation(api.documents.remove);

  const [search, setSearch] = useState("");

  const filteredDocuments = documents?.filter((e) =>
    e.title.toLocaleLowerCase().includes(search.toLowerCase())
  );

  const onRedirect = (docId: string) => {
    router.push(`/documents/${docId}`);
  };

  const handleRestore = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    docId: Id<"documents">
  ) => {
    e.stopPropagation();
    const promise = restore({ id: docId });

    toast.promise(promise, {
      loading: "Restoring document....",
      success: "Successfully restored the document!",
      error: "Failed to restore the document!",
    });
  };

  const handleRemove = (docId: Id<"documents">) => {
    const promise = remove({ id: docId });

    toast.promise(promise, {
      loading: "Deleting document....",
      success: "Successfully deleted the document!",
      error: "Failed to delete the document!",
    });

    if (param.documentId == docId) {
      router.push("/documents");
    }
  };

  if (documents == undefined) {
    return (
      <div className="w-full flex-center p-4">
        <Spinner size={"lg"} />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-2">
        <Search className="size-4" />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter document by title...."
        />
      </div>
      <div className="mt-2 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          No Documents Found
        </p>
        {filteredDocuments?.map((doc) => (
          <div
            key={doc._id}
            role="button"
            onClick={() => onRedirect(doc._id)}
            className="text-sm rounded-sm w-full hover:bg-primary/5 flex  items-center text-primary justify-between"
          >
            <span className="truncate pl-2">{doc.title}</span>
            <div className="flex items-center ">
              <div
                onClick={(e) => {
                  handleRestore(e, doc._id);
                }}
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
              >
                <Undo className="size-4 text-muted-foreground" />
              </div>
              <ConfirmModal
                onConfirm={() => {
                  handleRemove(doc._id);
                }}
              >
                <div
                  role="button"
                  className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                >
                  <Trash className="size-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrashBox;
