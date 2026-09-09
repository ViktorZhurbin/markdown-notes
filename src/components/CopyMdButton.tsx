import { ActionIcon, CopyButton, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";

export const CopyMdButton = ({ text }: { text: string }) => (
  <CopyButton value={text}>
    {({ copied, copy }) => (
      <Tooltip label={copied ? "Copied" : "Copy markdown"}>
        <ActionIcon
          variant="default"
          size="lg"
          color={copied ? "teal" : undefined}
          aria-label="Copy markdown"
          onClick={copy}
        >
          {copied ? <IconCheck /> : <IconCopy />}
        </ActionIcon>
      </Tooltip>
    )}
  </CopyButton>
);
