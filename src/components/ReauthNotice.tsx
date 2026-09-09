import { Button, Group, Text } from "@mantine/core";

/* Access has already ended the session, so every /api call fails the same way
   until the user signs in again. A top-level navigation is not CORS-restricted,
   so reloading runs the login flow and comes back here.

   A button rather than an automatic reload: the navigation discards whatever is
   in the textarea, and there is no local draft store yet to survive it. */
export const ReauthNotice = ({ children }: { children: string }) => (
  <Group gap="sm" px="xs" py="sm">
    <Text c="red" size="sm">
      {children}
    </Text>
    <Button
      size="xs"
      variant="default"
      onClick={() => window.location.reload()}
    >
      Sign in again
    </Button>
  </Group>
);
