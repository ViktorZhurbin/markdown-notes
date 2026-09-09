# markdown-notes

A personal note-taking app: paste raw markdown, read it rendered, copy it back out.

## Stack

- **React 19** + TypeScript (strict), built with **Rsbuild**
- **Mantine 9** for UI; **react-markdown** + **remark-gfm** render the preview, wrapped in Mantine's `Typography` for element styling
- **Cloudflare Workers + D1** — a Worker in `worker/` serves `/api/notes*`; the built SPA is served from `dist/` as static assets
- **Cloudflare Access** handles auth at the edge. There is no sign-in UI and no auth code in the Worker: any request that reaches it is already authorized
- **Wouter** for routing, **Biome** for linting/formatting
- **Bun** as the package manager — use `bun add` / `bun install` instead of npm/yarn
- Mantine docs move fast — fetch `https://mantine.dev/llms.txt` for current API/migration info instead of relying on training data

## Key patterns

- **Reads** go through `useNotes` / `useNote` in `db/notes/hooks.ts` — plain `useState`/`useEffect` plus a `visibilitychange` refetch, no query library. **Writes** are `fetch` calls in `db/notes/crud.ts`, all with `keepalive: true` so a save flushed on unmount survives the tab closing
- **A note id is the D1 `INTEGER PRIMARY KEY`.** Route params arrive as strings, so `Note` validates with `Number.isInteger` before rendering the loader
- **A note is a raw markdown string.** Nothing parses it on the way in or out.
- **CSS Modules + Mantine**: Mantine class selectors inside `.module.css` must use `:global()` — without it they get hashed and never match. To beat Mantine's own single-class styles (injected after the modules), repeat the class: `&:is(.input) { ... }`.
- Toolbar action buttons are plain `ActionIcon`s with `variant="default"`; destructive actions route through the shared `ConfirmModal`
- **No non-null assertions** (`!`) — handle optionals explicitly
- **No `document.createElement`** — use JSX only

## Deploying

Push to `main`; the Cloudflare GitHub integration builds and deploys. Do not
`wrangler deploy` from a working tree — it would deploy code the next push
then overwrites.

**Migrations are not part of that build.** Run
`bunx wrangler d1 migrations apply markdown-notes --remote` yourself, and do it
*before* pushing the code that needs the new column, or the deployed Worker
returns 500 for every `/api` call.

Local dev needs both processes: `bun dev` (rsbuild, HMR) and `bunx wrangler dev`
(port 8787, holds the D1 binding). `rsbuild.config.ts` proxies `/api` to it.
