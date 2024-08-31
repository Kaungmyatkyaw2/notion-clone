import React, { ElementRef, useRef, useState } from "react";
import { Doc } from "../../../convex/_generated/dataModel";
import IconPicker from "./icon-picker";
import { Button } from "../ui/button";
import { ImageIcon, SmileIcon, X } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import TextAreaAutoSize from "react-textarea-autosize";
import { useCoverImage } from "@/hooks/useCoverImage";

interface ToolbarProps {
  initialData: Doc<"documents">;
  isPreview?: boolean;
}

const Toolbar = ({ initialData, isPreview }: ToolbarProps) => {
  const inputRef = useRef<ElementRef<"textarea"> | null>(null);
  const [isEditting, setIsEditting] = useState(false);
  const [value, setValue] = useState(initialData.title);

  const coverImage = useCoverImage();

  const update = useMutation(api.documents.update);
  const removeIcon = useMutation(api.documents.removeIcon);

  const enableEdit = () => {
    if (isPreview) {
      return;
    }

    setIsEditting(true);
    setTimeout(() => {
      setValue(initialData.title);
      inputRef.current?.focus();
    }, 0);
  };

  const disableEdit = () => {
    setIsEditting(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    update({
      id: initialData._id,
      title: e.target.value || "Untitled",
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      disableEdit();
    }
  };

  const handleIconSelect = (icon: string) => {
    update({
      id: initialData._id,
      icon,
    });
  };

  const handleRemoveIcon = () => {
    removeIcon({
      id: initialData._id,
    });
  };

  return (
    <div className="pl-[54px] group relative">
      {!!initialData.icon && !isPreview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onChange={handleIconSelect}>
            <span className="text-6xl hover:opacity-75 transition">
              {initialData.icon}
            </span>
          </IconPicker>
          <Button
            onClick={handleRemoveIcon}
            className="rounded-full opacity-0 group-hover:opacity-100 transition text-muted-foreground text-xs"
            variant={"outline"}
            size={"icon"}
          >
            <X className="size-4" />
          </Button>
        </div>
      )}
      {!!initialData.icon && isPreview && (
        <p className="text-6xl pt-6">{initialData.icon}</p>
      )}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initialData.icon && !isPreview && (
          <IconPicker asChild onChange={handleIconSelect}>
            <Button
              className="text-muted-foreground text-xs"
              variant={"outline"}
              size={"sm"}
            >
              <SmileIcon className="size-4 mr-2" />
              Add icon
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !isPreview && (
          <Button
            onClick={coverImage.onOpen}
            className="text-muted-foreground text-xs"
            variant={"outline"}
            size={"sm"}
          >
            <ImageIcon className="size-4 mr-2" />
            Add Cover Image
          </Button>
        )}
      </div>
      {isEditting && !isPreview ? (
        <TextAreaAutoSize
          ref={inputRef}
          onClick={enableEdit}
          onBlur={disableEdit}
          onChange={handleTitleChange}
          onKeyDown={onKeyDown}
          value={value}
          className="text-5xl bg-transparent font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf] resize-none w-full"
        />
      ) : (
        <div
          onClick={enableEdit}
          className="pb-[11.5px] text-5xl bg-transparent font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf]"
        >
          {initialData.title}
        </div>
      )}
    </div>
  );
};

export default Toolbar;
