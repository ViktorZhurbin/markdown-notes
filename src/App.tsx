import { ColorSchemeScript, createTheme, MantineProvider } from "@mantine/core";
import { Route, Switch } from "wouter";
import { Note } from "./pages/Note/Note";
import { NoteList } from "./pages/NoteList/NoteList";

const theme = createTheme({
  /** Put your mantine theme override here */
});

/* No sign-in UI: Cloudflare Access authenticates before any request reaches
   the Worker or the static assets. */
export const App = () => {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="auto" />
      <MantineProvider theme={theme} defaultColorScheme="auto">
        <Switch>
          <Route path="/" component={NoteList} />
          <Route path="/:noteId">
            {(params) => <Note noteId={params.noteId} />}
          </Route>

          {/* Default route in a switch */}
          <Route>404: No such page!</Route>
        </Switch>
      </MantineProvider>
    </>
  );
};
