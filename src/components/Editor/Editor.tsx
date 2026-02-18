import {
  Link,
  RichTextEditor,
  type RichTextEditorProps,
} from "@mantine/tiptap";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { Markdown } from "@tiptap/markdown";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { PasteMarkdown } from "../../tiptap/PasteMarkdown";
import styles from "./Editor.module.css";
import { EditorToolbar } from "./EditorToolbar";

const extensions = [
  StarterKit.configure({ link: false }),
  Link,
  Highlight,
  TextAlign.configure({
    defaultAlignment: "left",
    types: ["heading", "paragraph"],
  }),
  Markdown,
  PasteMarkdown,
];

type EditorProps = {
  content: string;
  entryId: string;
  editable?: boolean;
  classNames?: RichTextEditorProps["classNames"];
  onUpdate?: (text: string) => void;
};

export const Editor = ({
  content = "",
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
