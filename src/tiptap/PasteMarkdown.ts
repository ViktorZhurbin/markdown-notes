import { Extension } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";

export const PasteMarkdown = Extension.create({
  name: "pasteMarkdown",

  addProseMirrorPlugins() {
    const { editor } = this;
    return [
      new Plugin({
        props: {
          handlePaste(_view, event) {
            const text = event.clipboardData?.getData("text/plain");

            if (!text || !editor.markdown) {
              return false;
            }

            // Always parse pasted text as Markdown so paste is the inverse of
            // the Markdown we copy out. Falling back to plain-text paste turns
            // blank lines into real empty paragraphs, which accumulate on each
            // copy/clear/paste cycle.
            const json = editor.markdown.parse(text);

            // Insert the parsed JSON content at cursor position
            editor.commands.insertContent(json);
            return true;
          },
        },
      }),
    ];
  },
});
