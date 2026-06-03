import { CopyButton } from "@mantine/core";
import { RichTextEditor, useRichTextEditorContext } from "@mantine/tiptap";
import { IconCheck, IconCopy } from "@tabler/icons-react";

export const CopyMdButton = () => {
  const { editor } = useRichTextEditorContext();

  return (
    <CopyButton value={editor?.getMarkdown() ?? ""}>
      {({ copied, copy }) => (
        <RichTextEditor.Control
          style={{ color: copied ? "teal" : undefined }}
          onClick={copy}
        >
          {copied ? <IconCheck /> : <IconCopy />}
        </RichTextEditor.Control>
      )}
    </CopyButton>
  );
};
