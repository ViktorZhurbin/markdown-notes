import { ActionIcon } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { navigate } from "wouter/use-browser-location";
import { addNote } from "../db/notes/crud";

export const CreateButton = () => {
  /* The id comes back from the insert, so this is a round trip. Without the
     disabled flag a second click during it creates a second empty note. */
  const [creating, setCreating] = useState(false);

  const onClick = () => {
    setCreating(true);

    addNote()
      .then((note) => navigate(`/${note.id}`))
      .catch(() => setCreating(false));
  };

  return (
    <ActionIcon onClick={onClick} size="lg" loading={creating}>
      <IconPlus />
    </ActionIcon>
  );
};
