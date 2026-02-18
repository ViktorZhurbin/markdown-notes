import { RichTextEditor } from "@mantine/tiptap";
import { CopyMdButton } from "../CopyMdButton";
import { MoreOptionsMenu } from "../MoreOptionsMenu";
import styles from "./EditorToolbar.module.css";

export const EditorToolbar = ({ entryId }: { entryId: string }) => (
  <RichTextEditor.Toolbar sticky className={styles.toolbar}>
    <RichTextEditor.ControlsGroup>
      <CopyMdButton />
      <MoreOptionsMenu entryId={entryId} />
    </RichTextEditor.ControlsGroup>

    <RichTextEditor.ControlsGroup>
      <RichTextEditor.Undo />
      <RichTextEditor.Redo />
    </RichTextEditor.ControlsGroup>

    <RichTextEditor.ControlsGroup>
      <RichTextEditor.H1 />
      <RichTextEditor.H2 />
      <RichTextEditor.H3 />
      <RichTextEditor.H4 />
    </RichTextEditor.ControlsGroup>

    <RichTextEditor.ControlsGroup>
      <RichTextEditor.Bold />
      <RichTextEditor.Italic />
      <RichTextEditor.Underline />
      <RichTextEditor.Strikethrough />
    </RichTextEditor.ControlsGroup>

    <RichTextEditor.ControlsGroup>
      <RichTextEditor.Blockquote />
      <RichTextEditor.Hr />
      <RichTextEditor.BulletList />
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
  </RichTextEditor.Toolbar>
);
