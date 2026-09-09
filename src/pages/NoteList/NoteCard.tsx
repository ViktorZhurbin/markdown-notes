import { ActionIcon, Card, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import { Link } from "wouter";
import { ConfirmModal } from "../../components/ConfirmModal";
import type { Note } from "../../db/instant";
import { deleteNote } from "../../db/notes/crud";
import { noteTitle } from "../../utils/markdown";
import styles from "./NoteCard.module.css";

export const NoteCard = ({ note }: { note: Note }) => {
  const [confirmOpen, { open, close }] = useDisclosure(false);
  const title = noteTitle(note.text);

  return (
    <Card withBorder radius="md" padding="md" className={styles.card}>
      {/* Full-card overlay link: keeps the whole card clickable (cmd/middle-click
          still work) while the delete control sits above it via z-index. */}
      <Link
        href={`/${note.id}`}
        aria-label={`Open note: ${title || "Empty note"}`}
        className={styles.link}
      />

      <Text className={styles.title} fw={500} c={title ? undefined : "dimmed"}>
        {title || "Empty note"}
      </Text>

      <ActionIcon
        className={styles.deleteButton}
        variant="subtle"
        size="lg"
        color="dray.8"
        aria-label="Delete note"
        onClick={open}
      >
        <IconTrash size={24} />
      </ActionIcon>

      <ConfirmModal
        opened={confirmOpen}
        onClose={close}
        onConfirm={() => deleteNote(note.id)}
        title="Delete note"
        message="This can't be undone."
        confirmLabel="Delete"
      />
    </Card>
  );
};
