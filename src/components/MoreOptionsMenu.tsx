import { ActionIcon, Menu } from "@mantine/core";
import { IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { navigate } from "wouter/use-browser-location";
import { deleteEntry } from "../db/records/crud";

export const MoreOptionsMenu = (props: { entryId: string }) => {
  const handleDelete = () => {
    deleteEntry(props.entryId);
    navigate("/");
  };

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon variant="default" style={{ border: "none" }}>
          <IconDotsVertical />
        </ActionIcon>
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
