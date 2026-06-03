import { Link } from "@mantine/tiptap";
import { Markdown } from "@tiptap/markdown";
import StarterKit from "@tiptap/starter-kit";
import { MarkdownParagraph } from "./MarkdownParagraph";
import { PasteMarkdown } from "./PasteMarkdown";

export const extensions = [
  StarterKit.configure({ link: false, paragraph: false }),
  MarkdownParagraph,
  Link,
  Markdown,
  PasteMarkdown,
];
