import { ActionIcon } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { navigate } from "wouter/use-browser-location";
import { addNote } from "../db/notes/crud";

export const CreateButton = () => {
  const onClick = () => {
    const noteId = addNote();

    navigate(`/${noteId}`);
  };

  return (
    <ActionIcon onClick={onClick} size="lg">
      <IconPlus />
    </ActionIcon>
  );
};
