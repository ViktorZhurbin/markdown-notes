import { RichTextEditor } from "@mantine/tiptap";
import { IconEraser, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { navigate } from "wouter/use-browser-location";
import { deleteEntry, updateEntry } from "../db/records/crud";
import { ConfirmModal } from "./ConfirmModal";

type PendingAction = "clear" | "delete" | null;

export const NoteActions = ({ noteId }: { noteId: string }) => {
  const [pending, setPending] = useState<PendingAction>(null);

  const closeModal = () => setPending(null);

  const handleClear = () => {
    updateEntry(noteId, "");
  };

  const handleDelete = () => {
    deleteEntry(noteId);
    navigate("/");
  };

  return (
    <>
      <RichTextEditor.Control
        aria-label="Clear note"
        title="Clear note"
        onClick={() => setPending("clear")}
      >
        <IconEraser size={16} />
      </RichTextEditor.Control>

      <RichTextEditor.Control
        aria-label="Delete note"
        title="Delete note"
        onClick={() => setPending("delete")}
      >
        <IconTrash size={16} />
      </RichTextEditor.Control>

      <ConfirmModal
        opened={pending === "clear"}
        onClose={closeModal}
        onConfirm={handleClear}
        title="Clear note"
        message="This removes all content from the note."
        confirmLabel="Clear"
        confirmColor="yellow"
      />

      <ConfirmModal
        opened={pending === "delete"}
        onClose={closeModal}
        onConfirm={handleDelete}
        title="Delete note"
        message="This can't be undone."
        confirmLabel="Delete"
      />
    </>
  );
};
