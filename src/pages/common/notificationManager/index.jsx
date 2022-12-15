import { showNotification } from "@mantine/notifications";
import { IconX, IconCheck, IconAlertCircle } from "@tabler/icons";

export function showSuccess(title, message) {
  showNotification({
    title,
    message,
    color: "green",
    icon: <IconCheck />,
  });

  return null;
}

export function showFail(title, message) {
  showNotification({
    title,
    message,
    color: "red",
    icon: <IconX />,
  });

  return null;
}

export function showWarning(title, message) {
  showNotification({
    title,
    message,
    color: "yellow",
    icon: <IconAlertCircle />,
  });

  return null;
}
