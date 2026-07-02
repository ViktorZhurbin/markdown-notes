import { ActionIcon, Group } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { navigate } from "wouter/use-browser-location";
import { Editor } from "../../components/Editor/Editor";
import { ThemeToggle } from "../../components/ThemeToggle/ThemeToggle";
import { db } from "../../db/instant";
import { updateNote } from "../../db/notes/crud";
import styles from "./Note.module.css";

export const Note = (props: { noteId: string }) => {
  const { isLoading, error, data } = db.useQuery({
    entries: {
      $: {
        where: {
          id: props.noteId,
        },
      },
    },
  });

  if (isLoading) {
    return "Loading...";
  }

  if (error) {
    return <div>Error querying data: {error.message}</div>;
  }

  const { text } = data.entries[0] ?? {};

  const handleUpdate = (text: string) => {
    updateNote(props.noteId, text);
  };

  return (
    <div className={styles.wrapper}>
      <Group justify="space-between" p="1rem 0.5rem 0 0.5rem">
        <ActionIcon variant="default" onClick={() => navigate("/")} size="lg">
          <IconArrowLeft />
        </ActionIcon>
        <ThemeToggle />
      </Group>

      <Editor
        noteId={props.noteId}
        content={text ?? ""}
        onUpdate={handleUpdate}
        classNames={{
          root: styles.editorRoot,
          content: styles.editorContent,
        }}
      />
    </div>
  );
};
