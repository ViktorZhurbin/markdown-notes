# markdown-notes

A personal note-taking app: paste raw markdown, read it rendered, copy it back out.

## Stack

- **React 19** + TypeScript (strict), built with **Rsbuild**
- **Mantine 9** for UI; **react-markdown** + **remark-gfm** render the preview, wrapped in Mantine's `Typography` for element styling
- **InstantDB** (`@instantdb/react`) — real-time DB and the only state layer (no Redux/Context/Zustand)
- **Wouter** for routing, **Biome** for linting/formatting
- **Bun** as the package manager — use `bun add` / `bun install` instead of npm/yarn
- Mantine docs move fast — fetch `https://mantine.dev/llms.txt` for current API/migration info instead of relying on training data

## Key patterns

- **InstantDB = state**: `db.useQuery` for reads; all writes go through `db.transact(db.tx...)` in `db/notes/crud.ts`
- **A note is a raw markdown string.** Nothing parses it on the way in or out.
- **CSS Modules + Mantine**: Mantine class selectors inside `.module.css` must use `:global()` — without it they get hashed and never match. To beat Mantine's own single-class styles (injected after the modules), repeat the class: `&:is(.input) { ... }`.
- Toolbar action buttons are plain `ActionIcon`s with `variant="default"`; destructive actions route through the shared `ConfirmModal`
- **No non-null assertions** (`!`) — handle optionals explicitly
- **No `document.createElement`** — use JSX only
