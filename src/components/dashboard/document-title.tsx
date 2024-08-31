import React, { useRef, useState } from "react";
import { Doc } from "../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

interface Props {
  initialData: Doc<"documents">;
}

const DocumentTitle = ({ initialData }: Props) => {
  const update = useMutation(api.documents.update);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState(initialData.title || "Untitled");
  const [isEditting, setIsEditting] = useState(false);

  const enableEdit = () => {
    setTitle(initialData.title);
    setIsEditting(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableEdit = () => {
    setIsEditting(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    update({
      id: initialData._id,
      title: e.target.value || "Untitled",
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      disableEdit();
    }
  };

  return (
    <div className="flex items-center gap-x-1">
      {initialData.icon && <p>{initialData.icon}</p>}
      {isEditting ? (
        <Input
          ref={inputRef}
          onClick={enableEdit}
          onBlur={disableEdit}
          onChange={handleTitleChange}
          onKeyDown={onKeyDown}
          value={title}
          className="h-7 px-2 focus-visible:ring-transparent"
        />
      ) : (
        <Button
        onClick={enableEdit}
        variant={"ghost"}
          size={"sm"}
          className="p-1"
        >
          <span className="truncate">{initialData.title}</span>
        </Button>
      )}
    </div>
  );
};

export default DocumentTitle;


DocumentTitle.Skeleton= function TitleSkeleton (){
    return <Skeleton className="h-6 w-24 rounded-md" />
}