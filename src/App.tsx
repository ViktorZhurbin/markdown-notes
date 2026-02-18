import { ColorSchemeScript, createTheme, MantineProvider } from "@mantine/core";
import { Route, Switch } from "wouter";
import { Entry } from "./pages/Entry/Entry";
import { Entries } from "./pages/entries/Entries";

const theme = createTheme({
  /** Put your mantine theme override here */
});

export const App = () => {
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
