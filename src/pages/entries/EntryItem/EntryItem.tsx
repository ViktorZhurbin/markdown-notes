import { Button } from "@mantine/core";
import { Link } from "wouter";
import { Editor } from "../../../components/Editor/Editor";
import type { Entry } from "../../../db/instant";
import styles from "./EntryItem.module.css";

export const EntryItem = ({ entry }: { entry: Entry }) => {
  return (
    <Button
      key={entry.id}
      fullWidth
      justify="start"
      variant="default"
      radius="md"
      size="md"
      component={Link}
      href={`/${entry.id}`}
      classNames={{
        root: styles.buttonRoot,
        label: styles.buttonLabel,
      }}
    >
      {/* <Text fw={500}>{entry.createdAt}</Text> */}
      <Editor
        content={entry.text}
        editable={false}
        classNames={{ root: styles.editorRoot, content: styles.editorContent }}
      />
    </Button>
  );
};
