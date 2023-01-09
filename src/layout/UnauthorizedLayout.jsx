import { AppShell } from "@mantine/core";
import React from "react";

export default function UnauthorizedLayout({ children }) {
  return (
    <AppShell
      styles={(theme) => ({
        main: {
          backgroundColor: theme.colors.gray[0],
        },
      })}
    >
      {children}
    </AppShell>
  );
}
