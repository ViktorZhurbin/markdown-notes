import { ColorSchemeScript, createTheme, MantineProvider } from "@mantine/core";
import { useEffect, useState } from "react";
import { Route, Switch } from "wouter";
import { migrateHtmlToMarkdown } from "./db/records/migrate";
import { Entries } from "./pages/Entries/Entries";
import { Entry } from "./pages/Entry/Entry";

const theme = createTheme({
  /** Put your mantine theme override here */
});

// Bumped when the storage format changes; gates the one-time HTML→Markdown
// migration so it runs at most once per browser.
const MIGRATION_FLAG = "md-storage-v1";

export const App = () => {
  const [migrating, setMigrating] = useState(
    () => localStorage.getItem(MIGRATION_FLAG) === null,
  );

  useEffect(() => {
    if (!migrating) {
      return;
    }
    migrateHtmlToMarkdown().finally(() => {
      localStorage.setItem(MIGRATION_FLAG, "done");
      setMigrating(false);
    });
  }, [migrating]);

  if (migrating) {
    return "Loading...";
  }

  return (
    <>
      <ColorSchemeScript defaultColorScheme="auto" />
      <MantineProvider theme={theme} defaultColorScheme="auto">
        <Switch>
          <Route path="/" component={Entries} />
          <Route path="/:entryId">
            {(params) => <Entry entryId={params.entryId} />}
          </Route>

          {/* Default route in a switch */}
          <Route>404: No such page!</Route>
        </Switch>
      </MantineProvider>
    </>
  );
};
