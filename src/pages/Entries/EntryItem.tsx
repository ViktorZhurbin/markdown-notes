import { ActionIcon, Button, Card, Group, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import { Link } from "wouter";
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

      <Modal
        opened={confirmOpen}
        onClose={close}
        title="Delete note"
        centered
        radius="md"
        size="sm"
      >
        <Text size="sm" mb="lg">
          This can't be undone.
        </Text>
        <Group grow gap="sm">
          <Button variant="default" size="md" onClick={close}>
            Cancel
          </Button>
          <Button color="red" size="md" onClick={() => deleteEntry(entry.id)}>
            Delete
          </Button>
        </Group>
      </Modal>
    </Card>
  );
};
