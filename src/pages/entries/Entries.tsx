import { Affix, Group, Stack } from "@mantine/core";
import { CreateButton } from "../../components/CreateButton/CreateButton";
import { ThemeToggle } from "../../components/ThemeToggle/ThemeToggle";
import { db } from "../../db/instant";
import { EntryItem } from "./EntryItem/EntryItem";

export function Entries() {
  const { isLoading, error, data } = db.useQuery({ entries: {} });
  if (isLoading) {
    return "Loading...";
  }

  if (error) {
    return <div>Error querying data: {error.message}</div>;
  }

  return (
    <div>
      <Group justify="flex-end" mb="sm">
        <ThemeToggle />
      </Group>
      <Stack gap="sm">
        {data.entries
          .toSorted((a, b) => b.createdAt.localeCompare(a.createdAt))
          .map((entry) => (
            <EntryItem key={entry.id} entry={entry} />
          ))}
      </Stack>
      <Affix position={{ bottom: 20, right: 20 }}>
        <CreateButton />
      </Affix>
    </div>
  );
}
