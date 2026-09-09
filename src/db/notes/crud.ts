import type { Note } from "./types";

const BASE = "/api/notes";

async function parse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

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
  return fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text }),
    /* The debounced save can fire from flushOnUnmount as the tab closes.
       Without keepalive the browser cancels that request during teardown and
       the last edit is lost. */
    keepalive: true,
  });
}

export function deleteNote(id: number): Promise<Response> {
  return fetch(`${BASE}/${id}`, { method: "DELETE", keepalive: true });
}
