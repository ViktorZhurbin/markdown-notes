import { ActionIcon } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { navigate } from "wouter/use-browser-location";
import { addEntry } from "../db/records/crud";

export const CreateButton = () => {
  const onClick = () => {
    const recordId = addEntry();

    navigate(`/${recordId}`);
  };

  return (
    <ActionIcon onClick={onClick} size="lg">
      <IconPlus />
    </ActionIcon>
  );
};
