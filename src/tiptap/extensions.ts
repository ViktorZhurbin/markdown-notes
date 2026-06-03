import { Link } from "@mantine/tiptap";
import { Markdown } from "@tiptap/markdown";
import StarterKit from "@tiptap/starter-kit";
import { PasteMarkdown } from "./PasteMarkdown";

export const extensions = [
  StarterKit.configure({ link: false }),
  Link,
  Markdown,
  PasteMarkdown,
];
