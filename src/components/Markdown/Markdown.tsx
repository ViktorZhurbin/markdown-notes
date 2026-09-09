import { Typography } from "@mantine/core";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./Markdown.module.css";

// Both live at module scope: a fresh array or object identity on every render
// makes react-markdown rebuild its unified processor each time.
//
// remarkGfm is required, not optional: without it tables collapse into a
// paragraph and ~~x~~, - [ ] and bare URLs stay literal.
const remarkPlugins = [remarkGfm];

const components: Components = {
  // Wide tables scroll inside their own box instead of widening the page.
  table: (props) => (
    <div className={styles.tableWrap}>
      <table {...props} />
    </div>
  ),
};

type MarkdownProps = {
  children: string;
  className?: string;
};

export const Markdown = ({ children, className }: MarkdownProps) => (
  <Typography
    className={[styles.markdown, className].filter(Boolean).join(" ")}
  >
    <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
      {children}
    </ReactMarkdown>
  </Typography>
);
