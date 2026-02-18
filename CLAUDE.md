# markdown-notes

A journal/note-taking app with rich-text editing and real-time sync.

## Stack

- **React 19** + TypeScript (strict), built with **Rsbuild**
- **Mantine 8** for UI components and theming
- **Tiptap 3** (via `@mantine/tiptap`) for the rich text editor — with `@tiptap/markdown` extension for markdown serialization
- **InstantDB** (`@instantdb/react`) as the real-time database — it's also the state layer (no Redux/Context/Zustand)
- **Wouter** for client-side routing
- **Biome** for linting/formatting

## Structure

```
src/
  App.tsx                          # Root: Mantine theme + Wouter routes (/ and /:entryId)
  main.tsx                         # Entry point
  global.css
  components/
    CreateButton.tsx               # FAB that creates an entry and navigates to it
    CopyMdButton.tsx               # Toolbar button that copies entry content as markdown
    MoreOptionsMenu.tsx            # Dropdown with Clear and Delete actions (uses RichTextEditor.Control as trigger)
    Editor/
      Editor.tsx                   # Reusable Tiptap editor (editable or read-only); syncs external content changes via useEffect
      Editor.module.css
      EditorToolbar.tsx            # Toolbar with formatting controls, CopyMdButton, and MoreOptionsMenu
      EditorToolbar.module.css     # Use :global() for Mantine class selectors (e.g. :global(.mantine-RichTextEditor-control))
    ThemeToggle/
      ThemeToggle.tsx              # Light/dark toggle using useComputedColorScheme + useMantineColorScheme
      ThemeToggle.module.css       # Hides sun/moon icons via [data-mantine-color-scheme] on <html>
  pages/
    entries/                       # List page — queries all entries, shows previews
      Entries.tsx
      EntryItem/                   # Read-only Editor preview, links to entry detail
    Entry/                         # Detail page — editable Editor, back button, theme toggle
  db/
    instant.ts                     # InstantDB client init + schema (entries: text, createdAt, updatedAt)
    records/crud.ts                # addEntry / updateEntry / deleteEntry via db.transact
  tiptap/
    PasteMarkdown.ts               # Custom extension: detects and parses markdown on paste
```

## Key patterns

- **InstantDB = state**: `db.useQuery` hooks provide reactive data; all mutations go through `db.transact(db.tx...)` in `crud.ts`
- **Editor component**: takes `content` (HTML string), `entryId`, `editable` bool, `onUpdate` callback, and optional `classNames`; toolbar only renders when editable; uses `useEffect` to sync external content changes (e.g. clear action) into the Tiptap instance via `editor.commands.setContent()`
- **CSS Modules + Mantine**: Mantine class selectors inside `.module.css` files must use `:global()` (e.g. `:global(.mantine-RichTextEditor-control)`) to avoid being locally scoped and hashed
- **No non-null assertions** (`!`) — handle optionals explicitly
- **No `document.createElement`** — use JSX only
