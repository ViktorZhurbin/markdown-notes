import { useCallback, useEffect, useRef, useState } from "react";
import { getNote, listNotes } from "./crud";
import type { Note } from "./types";

type Query<T> = {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

/* Instant pushed changes over a socket. Plain fetch does not, so a note edited
   on another device only arrives on the next read. Refetching when the tab
   becomes visible covers the actual usage: paste on one machine, open on
   another later. */
function useFetchOnFocus<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
): Query<T> {
  const [state, setState] = useState<Omit<Query<T>, "refetch">>({
    data: undefined,
    isLoading: true,
    error: null,
  });

  /* Each load aborts the one before it, so a slow first response cannot
     overwrite a newer one that already resolved. */
  const inFlight = useRef<AbortController>(null);

  const load = useCallback(() => {
    inFlight.current?.abort();

    const controller = new AbortController();
    inFlight.current = controller;

    fetcher(controller.signal)
      .then((data) => setState({ data, isLoading: false, error: null }))
      .catch((error: unknown) => {
        // An abort means a newer request replaced this one, not a failed read,
        // so it must not overwrite the state that request is about to fill.
        if (controller.signal.aborted) {
          return;
        }

        // A refetch that fails keeps the data it already had. Clearing it
        // unmounts NoteView and takes the unsaved draft with it.
        setState((prev) => ({
          data: prev.data,
          isLoading: false,
          error: error instanceof Error ? error : new Error(String(error)),
        }));
      });
  }, [fetcher]);

  useEffect(() => {
    load();

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        load();
      }
    };

    document.addEventListener("visibilitychange", onVisible);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      inFlight.current?.abort();
    };
  }, [load]);

  return { ...state, refetch: load };
}

export function useNotes(): Query<Note[]> {
  return useFetchOnFocus(
    useCallback((signal: AbortSignal) => listNotes(signal), []),
  );
}

export function useNote(id: number): Query<Note | null> {
  return useFetchOnFocus(
    useCallback((signal: AbortSignal) => getNote(id, signal), [id]),
  );
}
