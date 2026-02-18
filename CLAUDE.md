# markdown-notes

A journal/note-taking app with rich-text editing and real-time sync.

## Stack

- **React 19** + TypeScript (strict), built with **Rsbuild**
- **Mantine 8** for UI components and theming
- **Tiptap 3** (via `@mantine/tiptap`) for the rich text editor
- **InstantDB** (`@instantdb/react`) as the real-time database — it's also the state layer (no Redux/Context/Zustand)
- **Wouter** for client-side routing
- **Biome** for linting/formatting

## Structure

```
src/
  App.tsx                  # Root: Mantine theme + Wouter routes (/ and /:entryId)
  main.tsx                 # Entry point
  global.css
  components/
    CreateButton/          # FAB that creates an entry and navigates to it
    Editor/                # Reusable Tiptap editor (editable or read-only)
  pages/
    entries/               # List page — queries all entries, shows previews
      EntryItem/           # Read-only Editor preview, links to entry detail
    Entry/                 # Detail page — editable Editor, delete button
  db/
    instant.ts             # InstantDB client init + schema (entries: text, createdAt, updatedAt)
    records/crud.ts        # addEntry / updateEntry / deleteEntry via db.transact
```

## Key patterns

- **InstantDB = state**: `db.useQuery` hooks provide reactive data; all mutations go through `db.transact(db.tx...)` in `crud.ts`
- **Editor component**: takes `content` (HTML string), `editable` bool, `onUpdate` callback, and optional `classNames`; toolbar only renders when editable
- **No non-null assertions** (`!`) — handle optionals explicitly
- **No `document.createElement`** — use JSX only
