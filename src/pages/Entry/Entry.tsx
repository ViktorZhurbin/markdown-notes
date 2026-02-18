import { ActionIcon, Group } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { navigate } from "wouter/use-browser-location";
import { Editor } from "../../components/Editor/Editor";
import { ThemeToggle } from "../../components/ThemeToggle/ThemeToggle";
import { db } from "../../db/instant";
import { updateEntry } from "../../db/records/crud";
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

  return (
    <div className={styles.wrapper}>
      <Group justify="space-between" p="1rem 0.5rem 0 0.5rem">
        <ActionIcon variant="default" onClick={goBack}>
          <IconArrowLeft />
        </ActionIcon>
        <ThemeToggle />
      </Group>

      <Editor entryId={entryId} content={text} onUpdate={handleUpdate} />
    </div>
  );
}
