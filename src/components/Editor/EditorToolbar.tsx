import { RichTextEditor } from "@mantine/tiptap";
import { useEffect, useRef } from "react";
import { CopyMdButton } from "../CopyMdButton";
import { MoreOptionsMenu } from "../MoreOptionsMenu";
import styles from "./EditorToolbar.module.css";

export const EditorToolbar = ({ entryId }: { entryId: string }) => {
  const toolbarRef = useRef<HTMLDivElement>(null);

  /* for sticky toolbar to work on mobile with virtual keyboard on */

  useEffect(() => {
    if (!window.visualViewport) return;

    const handleViewportChange = () => {
      if (toolbarRef.current && window.visualViewport !== null) {
        const offset = window.visualViewport.offsetTop;
        toolbarRef.current.style.top = `${offset}px`;
      }
    };

    window.visualViewport.addEventListener("resize", handleViewportChange);
    window.visualViewport.addEventListener("scroll", handleViewportChange);

    return () => {
      window.visualViewport?.removeEventListener(
        "resize",
        handleViewportChange,
      );
      window.visualViewport?.removeEventListener(
        "scroll",
        handleViewportChange,
      );
    };
  }, []);

  return (
    <RichTextEditor.Toolbar sticky ref={toolbarRef} className={styles.toolbar}>
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
        <RichTextEditor.Code />
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
    </RichTextEditor.Toolbar>
  );
};
