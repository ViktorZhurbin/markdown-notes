import { ActionIcon, Card } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import { Link } from "wouter";
import { ConfirmModal } from "../../components/ConfirmModal";
import { Editor } from "../../components/Editor/Editor";
import type { Entry } from "../../db/instant";
import { deleteEntry } from "../../db/records/crud";
import styles from "./EntryItem.module.css";

export const EntryItem = ({ entry }: { entry: Entry }) => {
  const [confirmOpen, { open, close }] = useDisclosure(false);

  return (
    <Card withBorder radius="md" padding="md" className={styles.card}>
      {/* Full-card overlay link: keeps the whole card clickable (cmd/middle-click
          still work) while the delete control sits above it via z-index. */}
      <Link
        href={`/${entry.id}`}
        aria-label="Open note"
        className={styles.link}
      />

      <Editor
        entryId={entry.id}
        content={entry.text}
        editable={false}
        classNames={{ root: styles.editorRoot, content: styles.editorContent }}
      />

      <ActionIcon
        className={styles.deleteButton}
        variant="subtle"
        size="lg"
        color="red"
        aria-label="Delete note"
        onClick={open}
      >
        <IconTrash size={24} />
      </ActionIcon>

      <ConfirmModal
        opened={confirmOpen}
        onClose={close}
        onConfirm={() => deleteEntry(entry.id)}
        title="Delete note"
        message="This can't be undone."
        confirmLabel="Delete"
      />
    </Card>
  );
};
