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
import { CopyMdButton } from "../CopyMdButton";
import { MoreOptionsMenu } from "../MoreOptionsMenu";
import styles from "./Editor.module.css";

const extensions = [
  StarterKit.configure({ link: false }),
  Link,
  Highlight,
  TextAlign.configure({
    defaultAlignment: "left",
    types: ["heading", "paragraph"],
  }),
  Markdown,
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
    content: content,
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getHTML());
    },
  });

  return (
    <RichTextEditor
      editor={editor}
      classNames={classNames}
      // variant="subtle"
      className={styles.editor}
    >
      {editable && (
        <RichTextEditor.Toolbar sticky className={styles.toolbar}>
          <RichTextEditor.ControlsGroup>
            <CopyMdButton />
            <MoreOptionsMenu entryId={entryId} />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
          </RichTextEditor.ControlsGroup>

          {/* <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup> */}

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            {/* <RichTextEditor.BulletList /> */}
            <RichTextEditor.OrderedList />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          {/* <RichTextEditor.ControlsGroup>
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
          </RichTextEditor.ControlsGroup> */}

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Undo />
            <RichTextEditor.Redo />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
      )}

      <RichTextEditor.Content />
    </RichTextEditor>
  );
};
