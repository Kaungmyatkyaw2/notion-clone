import React, { useState } from "react";
import { Doc } from "../../../convex/_generated/dataModel";
import { useOrigin } from "@/hooks/useOrigin";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Check, Copy, Globe } from "lucide-react";

interface PublishProps {
  initialData: Doc<"documents">;
}

const Publish = ({ initialData }: PublishProps) => {
  const origin = useOrigin();
  const update = useMutation(api.documents.update);

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const url = `${origin}/preview/${initialData._id}`;

  const handlePublish = () => {
    setIsSubmitting(true);

    const promise = update({
      id: initialData._id,
      isPublished: true,
    }).finally(() => {
      setIsSubmitting(false);
    });

    toast.promise(promise, {
      loading: "Publishing....",
      success: "Document published",
      error: "Failed to publish document!",
    });
  };

  const handleUnpublish = () => {
    setIsSubmitting(true);

    const promise = update({
      id: initialData._id,
      isPublished: false,
    }).finally(() => {
      setIsSubmitting(false);
    });

    toast.promise(promise, {
      loading: "Unpublishing....",
      success: "Document unpublished",
      error: "Failed to upublish document!",
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size={"sm"} variant={"ghost"}>
          Publish{" "}
          {initialData.isPublished && (
            <Globe className="size-4 text-sky-500 ml-2" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 z-[99999]"
        align="end"
        alignOffset={8}
        forceMount
      >
        {initialData.isPublished ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <Globe className="text-sky-500 animate-pulse" />
              <p className="text-xs font-medium text-sky-500">
                This note is live on web.
              </p>
            </div>
            <div className="flex items-center">
              <input
                className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
                disabled
                value={url}
              />
              <Button
                onClick={handleCopy}
                disabled={copied}
                className="h-8 rounded-l-none"
              >
                {copied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </div>
            <Button
              disabled={isSubmitting}
              onClick={handleUnpublish}
              className="w-full text-xs"
              size="sm"
            >
              Unpublish
            </Button>
          </div>
        ) : (
          <div className="flex-center flex-col">
            <Globe className="size-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-2">Publish this document</p>
            <span className="text-xs text-muted-foreground mb-4">
              Share your work with others
            </span>

            <Button
              disabled={isSubmitting}
              onClick={handlePublish}
              className="w-full text-xs"
              size="sm"
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default Publish;
