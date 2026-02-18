import { ActionIcon, Group, Stack } from "@mantine/core";
import { IconArrowLeft, IconTrash } from "@tabler/icons-react";
import { navigate } from "wouter/use-browser-location";
import { Editor } from "../../components/Editor/Editor";
import { ThemeToggle } from "../../components/ThemeToggle/ThemeToggle";
import { db } from "../../db/instant";
import { deleteEntry, updateEntry } from "../../db/records/crud";
import styles from "./Entry.module.css";

export function Entry({ entryId }: { entryId: string }) {
  const { isLoading, error, data } = db.useQuery({
    entries: {
      $: {
        where: {
          id: entryId,
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
    updateEntry(entryId, text);
  };

  const goBack = () => {
    navigate("/");
  };

  const handleDelete = () => {
    deleteEntry(entryId);
    goBack();
  };

  return (
    <div className={styles.wrapper}>
      <Stack>
        <Group justify="space-between">
          <ActionIcon variant="default" onClick={goBack}>
            <IconArrowLeft />
          </ActionIcon>
          <ThemeToggle />
        </Group>
        <Group justify="space-between">
          <div />
          <ActionIcon variant="default" onClick={handleDelete}>
            <IconTrash />
          </ActionIcon>
        </Group>
      </Stack>

      <Editor content={text} onUpdate={handleUpdate} />
    </div>
  );
}
