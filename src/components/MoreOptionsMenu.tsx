import { Menu } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { navigate } from "wouter/use-browser-location";
import { deleteEntry } from "../db/records/crud";

export const MoreOptionsMenu = (props: { entryId: string }) => {
  const [opened, setOpened] = useState(false);

  const handleDelete = () => {
    deleteEntry(props.entryId);
    navigate("/");
  };

  return (
    <Menu opened={opened} onChange={setOpened}>
      <Menu.Target>
        <RichTextEditor.Control active={opened}>
          <IconDotsVertical size={16} />
        </RichTextEditor.Control>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          color="red"
          leftSection={<IconTrash />}
          onClick={handleDelete}
        >
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
