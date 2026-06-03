import { Editor } from "@tiptap/core";
import { extensions } from "../../tiptap/extensions";
import { db } from "../instant";
import { updateEntry } from "./crud";

// Entries used to be stored as HTML; they are now stored as Markdown. This
// one-time migration rewrites any remaining HTML rows as Markdown. It is guarded
// by a localStorage flag in App.tsx so it runs at most once per browser, and can
// be deleted once all known clients have run it.
function htmlToMarkdown(html: string): string {
  const editor = new Editor({ extensions, content: html });
  const markdown = editor.getMarkdown();
  editor.destroy();
  return markdown;
}

export async function migrateHtmlToMarkdown(): Promise<void> {
  const { data } = await db.queryOnce({ entries: {} });

  for (const entry of data.entries) {
    if (entry.text.trim().startsWith("<")) {
      updateEntry(entry.id, htmlToMarkdown(entry.text));
    }
  }
}
