import { useCoverImage } from "@/hooks/useCoverImage";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { useEdgeStore } from "@/lib/edgestore";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "../../../convex/_generated/dataModel";
import SingleImageDropzone from "../common/singe-image-dropzone";

const CoverImageModal = () => {
  const coverImage = useCoverImage();
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { edgestore } = useEdgeStore();
  const params = useParams();

  const update = useMutation(api.documents.update);

  const handleModalClose = () => {
    setFile(null);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  const onChange = async (file?: File) => {
    try {
      if (file) {
        setIsSubmitting(true);
        setFile(file);

        const res = await edgestore.publicFiles.upload({
          file,
          options: {
            replaceTargetUrl: coverImage.url,
          },
        });
        await update({
          id: params.documentId as Id<"documents">,
          coverImage: res.url,
        });
        handleModalClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg text-bold"> Cover Image</h2>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file as File}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CoverImageModal;
