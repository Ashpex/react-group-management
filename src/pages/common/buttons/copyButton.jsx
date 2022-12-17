import { Button, CopyButton as MantineCopyButton } from "@mantine/core";
import React from "react";

export default function CopyButton({
  size = "xs",
  value,
  label = value,
  postColor = "teal",
  preColor = "blue",
}) {
  return (
    <MantineCopyButton value={value}>
      {({ copied, copy }) => (
        <Button
          size={size}
          color={copied ? postColor : preColor}
          onClick={copy}
        >
          {label}
        </Button>
      )}
    </MantineCopyButton>
  );
}
