import { ActionIcon, CopyButton } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useCurrentEditor } from "@tiptap/react";

export const CopyMdButton = () => {
  const { editor } = useCurrentEditor();

  return (
    <CopyButton value={editor?.getMarkdown() ?? ""}>
      {({ copied, copy }) => (
        <ActionIcon
          color={copied ? "teal" : "gray"}
          variant="subtle"
          onClick={copy}
        >
          {copied ? <IconCheck /> : <IconCopy />}
        </ActionIcon>
      )}
    </CopyButton>
  );
};
