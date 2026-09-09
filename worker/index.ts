/*
 * Cloudflare Access gates every request before this Worker runs, so there is
 * no auth check here. The account-level Access policy is the only thing that
 * decides who reaches these routes.
 *
 * `run_worker_first: ["/api/*"]` in wrangler.jsonc means the handler only ever
 * sees /api paths; everything else is served from ./dist by the assets binding.
 */

type NoteRow = {
  id: number;
  text: string;
  createdAt: number;
  updatedAt: number | null;
};

const json = (body: unknown, status = 200) =>
  Response.json(body, {
    status,
    // A note read now must not come from a stale cache after an edit on
    // another device.
    headers: { "cache-control": "no-store" },
  });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    const segments = pathname.split("/").filter(Boolean); // ["api", "notes", id?]

    if (segments[0] !== "api" || segments[1] !== "notes") {
      return json({ error: "Not found" }, 404);
    }

    const rawId = segments[2];

    if (segments.length > 3) {
      return json({ error: "Not found" }, 404);
    }

    try {
      if (rawId === undefined) {
        return await collection(request, env);
      }

      // Number("") is 0 and Number("1x") is NaN, so both are rejected here
      // before they reach a query that would silently match nothing.
      const id = Number(rawId);
      if (!Number.isInteger(id) || id <= 0) {
        return json({ error: "Invalid note id" }, 400);
      }

      return await item(request, env, id);
    } catch (error) {
      console.error(error);
      return json({ error: "Internal error" }, 500);
    }
  },
} satisfies ExportedHandler<Env>;

/** /api/notes */
async function collection(request: Request, env: Env): Promise<Response> {
  if (request.method === "GET") {
    // The list only renders a title per note, but noteTitle() needs the
    // markdown to derive one, so text comes along.
    const { results } = await env.DB.prepare(
      "SELECT id, text, createdAt, updatedAt FROM notes ORDER BY createdAt DESC",
    ).all<NoteRow>();

    return json(results);
  }

  if (request.method === "POST") {
    const row = await env.DB.prepare(
      "INSERT INTO notes (text, createdAt) VALUES ('', ?) RETURNING id, text, createdAt, updatedAt",
    )
      .bind(Date.now())
      .first<NoteRow>();

    if (!row) {
      return json({ error: "Insert returned no row" }, 500);
    }

    return json(row, 201);
  }

  return json({ error: "Method not allowed" }, 405);
}

/** /api/notes/:id */
async function item(request: Request, env: Env, id: number): Promise<Response> {
  if (request.method === "GET") {
    const row = await env.DB.prepare(
      "SELECT id, text, createdAt, updatedAt FROM notes WHERE id = ?",
    )
      .bind(id)
      .first<NoteRow>();

    return row ? json(row) : json({ error: "Not found" }, 404);
  }

  if (request.method === "PUT") {
    const body = await request.json<{ text?: unknown }>().catch(() => null);

    if (typeof body?.text !== "string") {
      return json({ error: "Expected { text: string }" }, 400);
    }

    // UPDATE ... RETURNING yields no row when the id does not exist, which is
    // how a save against a note deleted on another device becomes a 404
    // instead of silently succeeding.
    const row = await env.DB.prepare(
      "UPDATE notes SET text = ?, updatedAt = ? WHERE id = ? RETURNING id, text, createdAt, updatedAt",
    )
      .bind(body.text, Date.now(), id)
      .first<NoteRow>();

    return row ? json(row) : json({ error: "Not found" }, 404);
  }

  if (request.method === "DELETE") {
    await env.DB.prepare("DELETE FROM notes WHERE id = ?").bind(id).run();

    return new Response(null, { status: 204 });
  }

  return json({ error: "Method not allowed" }, 405);
}
