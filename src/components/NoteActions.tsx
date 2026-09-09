import { ActionIcon, Tooltip } from "@mantine/core";
import { IconEraser, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { ConfirmModal } from "./ConfirmModal";

type PendingAction = "clear" | "delete" | null;

/* Clearing must go through the same debounced save as typing, or a pending
   write restores the text. Deleting must cancel that save first, or the
   flush recreates the row after it's gone. */
type NoteActionsProps = {
  onClear: () => void;
  onDelete: () => void;
};

export const NoteActions = ({ onClear, onDelete }: NoteActionsProps) => {
  const [pending, setPending] = useState<PendingAction>(null);

  const closeModal = () => setPending(null);

  return (
    <>
      <Tooltip label="Clear note">
        <ActionIcon
          variant="default"
          size="lg"
          aria-label="Clear note"
          onClick={() => setPending("clear")}
        >
          <IconEraser />
        </ActionIcon>
      </Tooltip>

      <Tooltip label="Delete note">
        <ActionIcon
          variant="default"
          size="lg"
          aria-label="Delete note"
          onClick={() => setPending("delete")}
        >
          <IconTrash />
        </ActionIcon>
      </Tooltip>

      <ConfirmModal
        opened={pending === "clear"}
        onClose={closeModal}
        onConfirm={onClear}
        title="Clear note"
        message="This removes all content from the note."
        confirmLabel="Clear"
        confirmColor="yellow"
      />

      <ConfirmModal
        opened={pending === "delete"}
        onClose={closeModal}
        onConfirm={onDelete}
        title="Delete note"
        message="This can't be undone."
        confirmLabel="Delete"
      />
    </>
  );
};
