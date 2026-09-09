import { Textarea } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import { navigate } from "wouter/use-browser-location";
import { Markdown } from "../../components/Markdown/Markdown";
import {
  type NoteMode,
  NoteToolbar,
} from "../../components/NoteToolbar/NoteToolbar";
import { db } from "../../db/instant";
import { deleteNote, updateNote } from "../../db/notes/crud";
import styles from "./Note.module.css";

const SAVE_DELAY_MS = 500;

export const Note = (props: { noteId: string }) => {
  const { isLoading, error, data } = db.useQuery({
    entries: {
      $: {
        where: {
          id: props.noteId,
        },
      },
    },
  });

  if (isLoading) {
    return "Loading...";
  }

  if (error) {
    return <div>Error querying data: {error.message}</div>;
  }

  const { text } = data.entries[0] ?? {};

  return (
    <NoteView key={props.noteId} noteId={props.noteId} text={text ?? ""} />
  );
};

const NoteView = ({ noteId, text }: { noteId: string; text: string }) => {
  const [mode, setMode] = useState<NoteMode>("edit");
  const [draft, setDraft] = useState(text);

  /* The last value this tab sent. When our own write echoes back through the
     query it equals this ref, so the textarea keeps whatever has been typed
     since. A value we did not send came from another device and replaces the
     draft. */
  const lastSentRef = useRef(text);

  useEffect(() => {
    if (text !== lastSentRef.current) {
      lastSentRef.current = text;
      setDraft(text);
    }
  }, [text]);

  const save = useDebouncedCallback(
    (value: string) => {
      lastSentRef.current = value;
      updateNote(noteId, value);
    },
    /* flushOnUnmount writes the pending edit when leaving the page. Without
       it the hook cancels instead, and going back to the list within the
       delay drops the last keystrokes. */
    { delay: SAVE_DELAY_MS, flushOnUnmount: true },
  );

  // Anything that changes draft text must go through here, not updateNote
  // directly, or a pending debounced save overwrites it afterward.
  const handleChange = (value: string) => {
    setDraft(value);
    save(value);
  };

  /* Cancel first: the flush on unmount would otherwise re-create the row this
     just deleted. */
  const handleDelete = () => {
    save.cancel();
    deleteNote(noteId);
    navigate("/");
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
