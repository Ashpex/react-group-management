import { Box, CloseButton, Image, Title } from "@mantine/core";
import React from "react";
import BarChart from "../../../../assets/bar-chart.svg";

export default function PresentationSlides({
  sx,
  slides,
  setSelectedSlide,
  selectedSlide,
  deleteSlide,
}) {
  return (
    <Box
      sx={{
        ...sx,
      }}
    >
      {slides.map((slide, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            height: "100px",
            gap: "12px",
            backgroundColor: selectedSlide === index ? "#eff5ff" : "#fff",
            padding: "12px 16px",
            color: "#101834bf",
            cursor: "pointer",
          }}
          onClick={() => setSelectedSlide(index)}
        >
          <Box>
            <Title order={5}>{index + 1}</Title>
          </Box>

          <Box
            sx={{
              width: "100%",
              height: "100%",
              padding: "169x 8px",
              border:
                selectedSlide === index
                  ? "1px solid rgb(25, 108, 255)"
                  : "1px solid #b7bac2",
              borderRadius: "3px",
              background: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            {Boolean(slide.type === "Multipe_Choice") && (
              <Box>
                <Image src={BarChart} alt="image" width={50} height={50} />
                <Title order={6} sx={{ fontWeight: "600" }}>
                  Bar Chart
                </Title>
              </Box>
            )}
            {Boolean(slide.type === "Paragraph") && (
              <Box>
                <Title order={6} sx={{ fontWeight: "600" }}>
                  {slide.heading}
                </Title>
                <Title order={6} sx={{ fontWeight: "600" }}>
                  {slide.paragraph}
                </Title>
              </Box>
            )}
            {Boolean(slide.type === "Heading") && (
              <Box>
                <Title order={6} sx={{ fontWeight: "600" }}>
                  {slide.heading}
                </Title>
                <Title order={6} sx={{ fontWeight: "600" }}>
                  {slide.subHeading}
                </Title>
              </Box>
            )}
          </Box>
          <CloseButton
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              deleteSlide(slide._id);
            }}
          />
        </Box>
      ))}
    </Box>
  );
}
