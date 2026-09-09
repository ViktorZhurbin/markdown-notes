import { createTheme, type MantineColorsTuple } from "@mantine/core";

/**
 * Authored in OKLCH at a fixed hue of 277: lightness steps evenly from 0.966
 * down to 0.418, chroma peaks at 0.170 on shades 6-7 and tapers at both ends
 * to stay inside sRGB. Hex, not `oklch()` — Mantine's `to-rgba.ts` parses only
 * hex, rgb and hsl and falls through to black for the rest, which would make
 * `--mantine-color-slateIndigo-light` (the `light` variant's background) black.
 */
// Chrome only — nav, FAB, focus rings, the currency switcher, the sync bar —
// never a number, so it stays clear of the three colours that mean something:
// red for a negative balance, green for income, dimmed for zero.
const slateIndigo: MantineColorsTuple = [
  "#f1f3fe",
  "#e2e6fc",
  "#c7cffc",
  "#a9b4fa",
  "#8c97f3",
  "#737ce7",
  "#5e65d5",
  "#5256c5",
  "#4749b1",
  "#3c3e9b",
];

/**
 * Shades 0-5 are Mantine's, unchanged — the dark scheme's text colours. 6-9
 * are the surfaces, same hue 277 at chroma 0.006 so they sit under
 * `slateIndigo` rather than beside it. Two levels, which is all this app has:
 * `dark-7` is the page, cards and drawers (`--mantine-color-body`), `dark-6`
 * is what lifts off it — the bottom nav and input backgrounds.
 */
const dark: MantineColorsTuple = [
  "#C9C9C9",
  "#b8b8b8",
  "#828282",
  "#696969",
  "#424242",
  "#3b3b3b",
  "#292a2d",
  "#19191c",
  "#121215",
  "#0b0c0f",
];

export const theme = createTheme({
  primaryColor: "slateIndigo",
  colors: { slateIndigo, dark },
});
