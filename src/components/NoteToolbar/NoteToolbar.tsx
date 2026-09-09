import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconArrowLeft, IconEye, IconPencil } from "@tabler/icons-react";
import { useEffect, useRef } from "react";
import { navigate } from "wouter/use-browser-location";
import { CopyMdButton } from "../CopyMdButton";
import { NoteActions } from "../NoteActions";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import styles from "./NoteToolbar.module.css";

export type NoteMode = "edit" | "view";

type NoteToolbarProps = {
  text: string;
  mode: NoteMode;
  onToggleMode: () => void;
  onClear: () => void;
  onDelete: () => void;
};

export const NoteToolbar = ({
  text,
  mode,
  onToggleMode,
  onClear,
  onDelete,
}: NoteToolbarProps) => {
  const toolbarRef = useRef<HTMLDivElement>(null);

  /* for sticky toolbar to work on mobile with virtual keyboard on */

  useEffect(() => {
    if (!window.visualViewport) return;

    const handleViewportChange = () => {
      if (toolbarRef.current && window.visualViewport !== null) {
        const offset = window.visualViewport.offsetTop;
        toolbarRef.current.style.top = `${offset}px`;
      }
    };

    window.visualViewport.addEventListener("resize", handleViewportChange);
    window.visualViewport.addEventListener("scroll", handleViewportChange);

    return () => {
      window.visualViewport?.removeEventListener(
        "resize",
        handleViewportChange,
      );
      window.visualViewport?.removeEventListener(
        "scroll",
        handleViewportChange,
      );
    };
  }, []);

  return (
    <Group
      ref={toolbarRef}
      className={styles.toolbar}
      justify="space-between"
      wrap="nowrap"
      gap="xs"
    >
      <Group gap="xs" wrap="nowrap">
        <ActionIcon
          variant="default"
          size="lg"
          aria-label="Back to notes"
          onClick={() => navigate("/")}
        >
          <IconArrowLeft />
        </ActionIcon>

        <Tooltip label={mode === "edit" ? "Preview" : "Edit markdown"}>
          <ActionIcon
            variant="default"
            size="lg"
            aria-label={mode === "edit" ? "Preview" : "Edit markdown"}
            onClick={onToggleMode}
          >
            {mode === "edit" ? <IconEye /> : <IconPencil />}
          </ActionIcon>
        </Tooltip>

        <CopyMdButton text={text} />
        <NoteActions onClear={onClear} onDelete={onDelete} />
      </Group>

      <ThemeToggle />
    </Group>
  );
};
