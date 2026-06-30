import { Button, Group, type MantineColor, Modal, Text } from "@mantine/core";

type ConfirmModalProps = {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  confirmLabel?: string;
  confirmColor?: MantineColor;
};

export const ConfirmModal = ({
  opened,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  confirmColor = "red",
}: ConfirmModalProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      centered
      radius="md"
      size="sm"
    >
      {message && (
        <Text size="sm" mb="lg">
          {message}
        </Text>
      )}
      <Group grow gap="sm">
        <Button variant="default" size="md" onClick={onClose}>
          Cancel
        </Button>
        <Button color={confirmColor} size="md" onClick={handleConfirm}>
          {confirmLabel}
        </Button>
      </Group>
    </Modal>
  );
};
