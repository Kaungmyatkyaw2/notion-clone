"use client";

import React from "react";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useTheme } from "next-themes";
import "@blocknote/mantine/style.css";
import { useEdgeStore } from "@/lib/edgestore";

interface EditorProps {
  onChange: (val: string) => void;
  initialContent?: string;
  isEditable?: boolean;
}

const Editor = ({ onChange, initialContent, isEditable }: EditorProps) => {
  const { resolvedTheme } = useTheme();

  const handleUpload = async (file: File) => {
    const res = await edgestore.publicFiles.upload({
      file,
    });

    return res.url;
  };

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    uploadFile: handleUpload,
  });

  const { edgestore } = useEdgeStore();

  return (
    <BlockNoteView
      editor={editor}
      editable={isEditable}
      theme={resolvedTheme == "dark" ? "dark" : "light"}
      onChange={() => {
        onChange(JSON.stringify(editor.document, null, 2));
      }}
    ></BlockNoteView>
  );
};

export default Editor;
