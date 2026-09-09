import type { Note } from "./types";

const BASE = "/api/notes";

function check(response: Response): Response {
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response;
}

async function parse<T>(response: Response): Promise<T> {
  return check(response).json() as Promise<T>;
}

/* A keepalive request body is capped at 64KB by the fetch spec, and the cap
   applies to every keepalive request, not only the one flushed on unmount. A
   pasted document over the cap would fail on every save, so those fall back to
   a normal request: it can still be cancelled if the tab closes mid-flight,
   which is strictly better than never succeeding. */
const KEEPALIVE_MAX_BYTES = 60_000;

export function listNotes(signal?: AbortSignal): Promise<Note[]> {
  return fetch(BASE, { signal }).then(parse<Note[]>);
}

export async function getNote(
  id: number,
  signal?: AbortSignal,
): Promise<Note | null> {
  const response = await fetch(`${BASE}/${id}`, { signal });

  if (response.status === 404) {
    return null;
  }

  return parse<Note>(response);
}

export function addNote(): Promise<Note> {
  return fetch(BASE, { method: "POST" }).then(parse<Note>);
}

export function updateNote(id: number, text: string): Promise<Response> {
  const body = JSON.stringify({ text });

  return fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body,
    /* The debounced save can fire from flushOnUnmount as the tab closes.
       Without keepalive the browser cancels that request during teardown and
       the last edit is lost. */
    keepalive: new Blob([body]).size <= KEEPALIVE_MAX_BYTES,
  }).then(check);
}

export function deleteNote(id: number): Promise<Response> {
  return fetch(`${BASE}/${id}`, { method: "DELETE", keepalive: true }).then(
    check,
  );
}
