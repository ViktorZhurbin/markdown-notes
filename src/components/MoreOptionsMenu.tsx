import { Menu } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { IconDotsVertical, IconTrash, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { navigate } from "wouter/use-browser-location";
import { deleteEntry, updateEntry } from "../db/records/crud";

export const MoreOptionsMenu = (props: { entryId: string }) => {
  const [opened, setOpened] = useState(false);

  const handleDelete = () => {
    deleteEntry(props.entryId);
    navigate("/");
  };

  const handleClear = () => {
    updateEntry(props.entryId, "");
  };

  return (
    <Menu opened={opened} onChange={setOpened}>
      <Menu.Target>
        <RichTextEditor.Control active={opened}>
          <IconDotsVertical size={16} />
        </RichTextEditor.Control>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item color="yellow" leftSection={<IconX />} onClick={handleClear}>
          Clear
        </Menu.Item>
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
