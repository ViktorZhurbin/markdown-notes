import { Affix, Group, Stack } from "@mantine/core";
import { CreateButton } from "../../components/CreateButton";
import { ReauthNotice } from "../../components/ReauthNotice";
import { ThemeToggle } from "../../components/ThemeToggle/ThemeToggle";
import { isSessionExpired } from "../../db/notes/crud";
import { useNotes } from "../../db/notes/hooks";
import { NoteCard } from "./NoteCard";

export const NoteList = () => {
  const { isLoading, error, data, refetch } = useNotes();

  if (isLoading) {
    return "Loading...";
  }

  if (error && !data) {
    return isSessionExpired(error) ? (
      <ReauthNotice>You were signed out.</ReauthNotice>
    ) : (
      <div>Error querying data: {error.message}</div>
    );
  }

  return (
    <div style={{ padding: "1rem 0.5rem" }}>
      <Group justify="flex-end" mb="sm">
        <ThemeToggle />
      </Group>
      <Stack gap="sm">
        {/* Ordered by createdAt DESC in the SQL query. */}
        {data?.map((note) => (
          <NoteCard key={note.id} note={note} onDeleted={refetch} />
        ))}
      </Stack>
      <Affix position={{ bottom: 15, right: 15 }}>
        <CreateButton />
      </Affix>
    </div>
  );
};
