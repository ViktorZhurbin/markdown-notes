import { RichTextEditor, type RichTextEditorProps } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import { useEffect } from "react";
import { extensions } from "../../tiptap/extensions";
import { EditorToolbar } from "./EditorToolbar";

type EditorProps = {
  content: string;
  noteId: string;
  editable?: boolean;
  classNames?: RichTextEditorProps["classNames"];
  onUpdate?: (text: string) => void;
};

export const Editor = ({
  content,
  noteId,
  editable = true,
  classNames,
  onUpdate,
}: EditorProps) => {
  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    extensions,
    editable,
    autofocus: !content,
    content: content,
    contentType: "markdown",
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getMarkdown());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getMarkdown()) {
      editor.commands.setContent(content, { contentType: "markdown" });
    }
  }, [editor, content]);

  return (
    <RichTextEditor editor={editor} classNames={classNames} variant="subtle">
      {editable && <EditorToolbar noteId={noteId} />}

      <RichTextEditor.Content />
    </RichTextEditor>
  );
};
