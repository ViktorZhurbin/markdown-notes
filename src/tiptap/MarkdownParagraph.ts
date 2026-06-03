import Paragraph from "@tiptap/extension-paragraph";

// The default Paragraph extension serializes empty paragraphs as a literal
// `&nbsp;` to preserve blank lines. That placeholder leaks into copied/stored
// Markdown, so we emit a plain blank line instead and keep default rendering
// for non-empty paragraphs.
export const MarkdownParagraph = Paragraph.extend({
  renderMarkdown: (node, h) => {
    const content = Array.isArray(node?.content) ? node.content : [];
    if (content.length === 0) {
      return "";
    }
    return h.renderChildren(content);
  },
});
