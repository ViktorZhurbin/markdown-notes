import { Textarea } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import { navigate } from "wouter/use-browser-location";
import { Markdown } from "../../components/Markdown/Markdown";
import {
  type NoteMode,
  NoteToolbar,
} from "../../components/NoteToolbar/NoteToolbar";
import { ReauthNotice } from "../../components/ReauthNotice";
import { type SaveState, SaveStatus } from "../../components/SaveStatus";
import { deleteNote, isSessionExpired, updateNote } from "../../db/notes/crud";
import { useNote } from "../../db/notes/hooks";
import styles from "./Note.module.css";

const SAVE_DELAY_MS = 500;

/* Route params are strings; ids are the INTEGER primary key. Validating in a
   wrapper keeps useNote out of the invalid case entirely — a hook inside the
   loader would still fire a request for /api/notes/NaN before any guard. */
export const Note = (props: { noteId: string }) => {
  const noteId = Number(props.noteId);

  if (!Number.isInteger(noteId) || noteId <= 0) {
    return <div>404: No such note</div>;
  }

  return <NoteLoader key={noteId} noteId={noteId} />;
};

const NoteLoader = ({ noteId }: { noteId: number }) => {
  const { isLoading, error, data } = useNote(noteId);

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

  if (!data) {
    return <div>404: No such note</div>;
  }

  return <NoteView noteId={noteId} text={data.text} />;
};

const NoteView = ({ noteId, text }: { noteId: number; text: string }) => {
  const [mode, setMode] = useState<NoteMode>("edit");
  const [draft, setDraft] = useState(text);

  /* The last value this tab sent. When our own write comes back on a refetch
     it equals this ref, so the textarea keeps whatever has been typed since. A
     value we did not send came from another device and replaces the draft. */
  const lastSentRef = useRef(text);

  useEffect(() => {
    if (text !== lastSentRef.current) {
      lastSentRef.current = text;
      setDraft(text);
    }
  }, [text]);

  /* Instant retried failed writes from its own send queue. fetch does not, so
     a rejected save is silently lost text unless it is shown, with a way to
     retry the exact bytes that failed (lastSentRef, not draft — draft may
     have moved on if typing continued after the error).

     navigator.onLine is captured when the save fails rather than read at
     render: it answers why this attempt failed, and the connection may already
     be back by the time the message paints. Without it an outage and a Worker
     error both read "Failed to fetch". */
  const [saveState, setSaveState] = useState<SaveState>({ kind: "saved" });

  const attemptSave = (value: string) => {
    lastSentRef.current = value;
    setSaveState({ kind: "saving" });
    updateNote(noteId, value)
      .then(() => setSaveState({ kind: "saved" }))
      .catch((error: unknown) =>
        setSaveState({
          kind: "error",
          error: error instanceof Error ? error : new Error(String(error)),
          offline: !navigator.onLine,
        }),
      );
  };

  const save = useDebouncedCallback(
    attemptSave,
    /* flushOnUnmount writes the pending edit when leaving the page. Without
       it the hook cancels instead, and going back to the list within the
       delay drops the last keystrokes. */
    { delay: SAVE_DELAY_MS, flushOnUnmount: true },
  );

  // Anything that changes draft text must go through here, not updateNote
  // directly, or a pending debounced save overwrites it afterward.
  const handleChange = (value: string) => {
    setDraft(value);
    setSaveState({ kind: "pending" });
    save(value);
  };

  const retrySave = () => attemptSave(lastSentRef.current);

  /* Cancel first, or the flush on unmount sends a PUT against the deleted row
     and paints a 404 in saveError. Awaiting the DELETE matters too: navigate()
     mounts NoteList, which immediately issues GET /api/notes, and running that
     alongside an in-flight DELETE can list the note as still there. */
  const handleDelete = () => {
    save.cancel();
    deleteNote(noteId).then(() => navigate("/"));
  };

  return (
    <div className={styles.wrapper}>
      <NoteToolbar
        text={draft}
        mode={mode}
        onToggleMode={() => setMode(mode === "edit" ? "view" : "edit")}
        onClear={() => handleChange("")}
        onDelete={handleDelete}
      />

      {saveState.kind === "error" && isSessionExpired(saveState.error) ? (
        <ReauthNotice>
          Not saved — you were signed out. Copy your text first; signing in
          reloads the page.
        </ReauthNotice>
      ) : (
        <SaveStatus state={saveState} onRetry={retrySave} />
      )}

      {mode === "edit" ? (
        <Textarea
          autosize
          autoFocus={!text}
          spellCheck={false}
          placeholder="Paste markdown here"
          value={draft}
          onChange={(event) => handleChange(event.currentTarget.value)}
          classNames={{ root: styles.pane, input: styles.input }}
        />
      ) : (
        <Markdown className={styles.pane}>{draft}</Markdown>
      )}
    </div>
  );
};
