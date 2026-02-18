import {
  ActionIcon,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import styles from "./ThemeToggle.module.css";

export const ThemeToggle = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <ActionIcon
      size="lg"
      onClick={() =>
        setColorScheme(computedColorScheme === "light" ? "dark" : "light")
      }
      variant="default"
      aria-label="Toggle color scheme"
    >
      <IconSun className={styles.light} />
      <IconMoon className={styles.dark} />
    </ActionIcon>
  );
};
