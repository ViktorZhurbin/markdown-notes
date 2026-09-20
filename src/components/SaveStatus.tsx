import { ActionIcon, Group, Text } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";

export type SaveState =
  | { kind: "saved" }
  | { kind: "pending" }
  | { kind: "saving" }
  | { kind: "error"; error: Error; offline: boolean };

type SaveStatusProps = {
  state: SaveState;
  onRetry: () => void;
};

const PENDING_LABEL: Record<"saved" | "pending" | "saving", string> = {
  saved: "Saved",
  pending: "Unsaved changes",
  saving: "Saving…",
};

// Split out from Note.tsx so the error branch (which needs a Retry control)
// and the quiet saved/pending/saving text share one place that reads the
// whole state machine, instead of two components each guessing at what the
// other renders.
export const SaveStatus = ({ state, onRetry }: SaveStatusProps) => {
  if (state.kind === "error") {
    return (
      <Group gap="sm" px="xs" py="sm" wrap="nowrap">
        <Text c="red" size="sm" style={{ flex: 1 }}>
          {state.offline
            ? "Offline — not saved."
            : `Not saved: ${state.error.message}`}
        </Text>
        <ActionIcon
          variant="default"
          size="sm"
          aria-label="Retry save"
          onClick={onRetry}
        >
          <IconRefresh size={16} />
        </ActionIcon>
      </Group>
    );
  }

  return (
    <Text c="dimmed" size="xs" px="xs" py={4}>
      {PENDING_LABEL[state.kind]}
    </Text>
  );
};
