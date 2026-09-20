import type { Note } from "./types";

const BASE = "/api/notes";

/* Cloudflare Access answers an expired session with a 302 to a
   cloudflareaccess.com login page. Following that redirect is a cross-origin
   request the CORS check blocks, so a default fetch rejects with the same
   `TypeError: Failed to fetch` as a dead network — and a replay queue cannot
   tell "retry later" from "retrying will never work". redirect: "manual" leaves
   the redirect unfollowed and yields an opaqueredirect response instead, which
   is distinguishable. Nothing in this API redirects otherwise. */
const NO_REDIRECT = { redirect: "manual" } as const;

const SESSION_EXPIRED = "SessionExpired";

export const isSessionExpired = (error: unknown): boolean =>
  error instanceof Error && error.name === SESSION_EXPIRED;

// Carries the status code so callers can tell "the Worker or D1 hiccuped"
// (5xx, worth retrying) from "this request will never succeed" (4xx, e.g. a
// PUT against a row deleted from another tab) without re-parsing message text.
export class HttpError extends Error {
  constructor(
    public status: number,
    statusText: string,
  ) {
    super(`${status} ${statusText}`);
  }
}

// A network failure (offline, DNS, CORS) throws a plain TypeError with no
// status at all — that's retryable too, same as a 5xx. Only a session expiry
// or a 4xx response are excluded, since those won't change on retry.
export const isRetryable = (error: unknown): boolean => {
  if (isSessionExpired(error)) {
    return false;
  }

  return !(error instanceof HttpError) || error.status >= 500;
};

function check(response: Response): Response {
  if (response.type === "opaqueredirect") {
    // An opaque response has no status or body to report, only the fact of it.
    const error = new Error("Session expired");
    error.name = SESSION_EXPIRED;

    throw error;
  }

  if (!response.ok) {
    throw new HttpError(response.status, response.statusText);
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
  return fetch(BASE, { ...NO_REDIRECT, signal }).then(parse<Note[]>);
}

export async function getNote(
  id: number,
  signal?: AbortSignal,
): Promise<Note | null> {
  const response = await fetch(`${BASE}/${id}`, { ...NO_REDIRECT, signal });

  if (response.status === 404) {
    return null;
  }

  return parse<Note>(response);
}

export function addNote(): Promise<Note> {
  return fetch(BASE, { ...NO_REDIRECT, method: "POST" }).then(parse<Note>);
}

export function updateNote(id: number, text: string): Promise<Response> {
  const body = JSON.stringify({ text });

  return fetch(`${BASE}/${id}`, {
    ...NO_REDIRECT,
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
  return fetch(`${BASE}/${id}`, {
    ...NO_REDIRECT,
    method: "DELETE",
    keepalive: true,
  }).then(check);
}
