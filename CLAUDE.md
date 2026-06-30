# markdown-notes

A journal/note-taking app with rich-text editing and real-time sync.

## Stack

- **React 19** + TypeScript (strict), built with **Rsbuild**
- **Mantine 8** + **Tiptap 3** via `@mantine/tiptap` — editor stores/serializes content as markdown (`contentType: "markdown"`)
- **InstantDB** (`@instantdb/react`) — real-time DB and the only state layer (no Redux/Context/Zustand)
- **Wouter** for routing, **Biome** for linting/formatting

## Key patterns

- **InstantDB = state**: `db.useQuery` for reads; all writes go through `db.transact(db.tx...)` in `db/records/crud.ts`
- **Editor** (`components/Editor/`): takes `content` (markdown string), `entryId`, `editable`, `onUpdate`, optional `classNames`; syncs external content changes via `useEffect` comparing `content !== editor.getMarkdown()`; extensions centralized in `tiptap/extensions.ts`
- **CSS Modules + Mantine**: Mantine class selectors inside `.module.css` must use `:global()` (e.g. `:global(.mantine-RichTextEditor-control)`) — without it they get hashed and never match
- `MoreOptionsMenu` uses `RichTextEditor.Control` as its trigger to match toolbar button styling
- **No non-null assertions** (`!`) — handle optionals explicitly
- **No `document.createElement`** — use JSX only
