# markdown-notes

A personal note-taking app with rich-text editing and real-time sync.

## Stack

- **React 19** + TypeScript (strict), built with **Rsbuild**
- **Mantine 8** + **Tiptap 3** via `@mantine/tiptap` — editor stores/serializes content as markdown (`contentType: "markdown"`)
- **InstantDB** (`@instantdb/react`) — real-time DB and the only state layer (no Redux/Context/Zustand)
- **Wouter** for routing, **Biome** for linting/formatting
- **Bun** as the package manager — use `bun add` / `bun install` instead of npm/yarn

## Key patterns

- **InstantDB = state**: `db.useQuery` for reads; all writes go through `db.transact(db.tx...)` in `db/records/crud.ts`
- **Editor** (`components/Editor/`): takes `content` (markdown string), `entryId`, `editable`, `onUpdate`, optional `classNames`; syncs external content changes via `useEffect` comparing `content !== editor.getMarkdown()`; extensions centralized in `tiptap/extensions.ts`
- **CSS Modules + Mantine**: Mantine class selectors inside `.module.css` must use `:global()` (e.g. `:global(.mantine-RichTextEditor-control)`) — without it they get hashed and never match
- Toolbar action buttons (`EntryActions`, `CopyMdButton`) use `RichTextEditor.Control` so they match the built-in formatting controls; destructive actions route through the shared `ConfirmModal`
- **No non-null assertions** (`!`) — handle optionals explicitly
- **No `document.createElement`** — use JSX only
