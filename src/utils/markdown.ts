/*
 * Leading block syntax, stripped in order: the bullet pattern runs before the
 * checkbox pattern so "- [x] done" loses both markers.
 */
const LEADING_SYNTAX = [
  /^#{1,6}\s+/, // heading
  /^>\s*/, // blockquote
  /^[-*+]\s+/, // bullet item
  /^\d+[.)]\s+/, // ordered item
  /^\[[ xX]\]\s+/, // task checkbox
];

/* Only a matched pair is emphasis, so a lone marker survives. */
const PAIRED_SYNTAX = /(\*\*|~~|[*`])(.+?)\1/g;

/* CommonMark ignores underscores inside a word, which is what keeps the ones
   in a URL or a snake_case name out of the stripping. */
const UNDERSCORE_SYNTAX = /(?<!\w)(__|_)(?!\s)(.+?)(?<!\s)\1(?!\w)/g;

const THEMATIC_BREAK = /^([-*_])\1{2,}$/;

/** First non-empty line of a note with markdown markers removed. */
export function noteTitle(text: string): string {
  const line = text
    .split("\n")
    .map((rawLine) => rawLine.trim())
    .find((trimmed) => trimmed.length > 0 && !THEMATIC_BREAK.test(trimmed));

  if (!line) {
    return "";
  }

  const withoutBlockSyntax = LEADING_SYNTAX.reduce(
    (title, pattern) => title.replace(pattern, ""),
    line,
  );

  return withoutBlockSyntax
    .replace(PAIRED_SYNTAX, "$2")
    .replace(UNDERSCORE_SYNTAX, "$2")
    .trim();
}
