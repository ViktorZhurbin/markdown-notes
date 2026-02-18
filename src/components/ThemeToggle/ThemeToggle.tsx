import { ActionIcon, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import cx from "clsx";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", { getInitialValueInEffect: true });

  return (
    <ActionIcon
      onClick={() => setColorScheme(computedColorScheme === "light" ? "dark" : "light")}
      variant="default"
      aria-label="Toggle color scheme"
    >
      <IconSun className={cx(styles.icon, styles.light)} stroke={1.5} />
      <IconMoon className={cx(styles.icon, styles.dark)} stroke={1.5} />
    </ActionIcon>
  );
}
