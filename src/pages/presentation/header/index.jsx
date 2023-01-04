import { Box, Button } from "@mantine/core";
import React from "react";

export default function PresentationHeader({ createSlide }) {
  return (
    <Box>
      <Button
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
