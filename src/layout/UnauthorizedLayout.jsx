import { AppShell } from "@mantine/core";
import React from "react";

export default function UnauthorizedLayout({ children }) {
  return (
    <AppShell
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[4]
              : theme.colors.gray[0],
        },
      })}
    >
      {children}
    </AppShell>
  );
}
