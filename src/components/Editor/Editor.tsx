import { RichTextEditor, type RichTextEditorProps } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import { useEffect } from "react";
import { extensions } from "../../tiptap/extensions";
import styles from "./Editor.module.css";
import { EditorToolbar } from "./EditorToolbar";

type EditorProps = {
  content: string;
  entryId: string;
  editable?: boolean;
  classNames?: RichTextEditorProps["classNames"];
  onUpdate?: (text: string) => void;
};

export const Editor = ({
  content,
  entryId,
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
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  return (
    <RichTextEditor
      editor={editor}
      classNames={classNames}
      variant="subtle"
      className={styles.editor}
    >
      {editable && <EditorToolbar entryId={entryId} />}

      <RichTextEditor.Content />
    </RichTextEditor>
  );
};
