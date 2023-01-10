import { Box, Button } from "@mantine/core";
import { IconPresentation } from "@tabler/icons";
import React from "react";

export default function PresentationHeader({ createSlide }) {
  return (
    <Box>
      <Button
        variant="outline"
        color="green"
        leftIcon={<IconPresentation/>}
        sx={{
          width: "140px",
        }}
        onClick={createSlide}
      >
        New Slide
      </Button>
    </Box>
  );
}
