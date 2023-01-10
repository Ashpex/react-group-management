import { Box, Title } from "@mantine/core";
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as TitleChart,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  TitleChart,
  Tooltip,
  Legend
);

export default function PresentationContent({ sx, slide }) {
  const labels = (slide?.options || []).map((v) => v.value);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: slide?.question,
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Answer",
        data: (slide?.options || []).map((v) => v?.quantity || 0),
        backgroundColor: (slide?.options || []).map((v) =>
          v?.value === slide?.answer ? "#228be6" : "rgba(255, 99, 132, 0.5)"
        ),
      },
    ],
  };

  return (
    <Box
      sx={{
        ...sx,
      }}
    >
      {Boolean(slide?.type === "MULTIPLE_CHOICE") && (
        <Box>
          {Boolean(slide?.question) && <Bar options={options} data={data} />}
        </Box>
      )}

      {Boolean(slide?.type === "PARAGRAPH") && (
        <Box>
          <Title order={2} sx={{ fontWeight: "600" }}>
            {slide?.heading}
          </Title>
          <Title order={4} sx={{ fontWeight: "400" }}>
            {slide?.paragraph}
          </Title>
        </Box>
      )}

      {Boolean(slide?.type === "HEADING") && (
        <Box>
          <Title order={2} sx={{ fontWeight: "600" }}>
            {slide?.heading}
          </Title>
          <Title order={4} sx={{ fontWeight: "400" }}>
            {slide?.subHeading}
          </Title>
        </Box>
      )}
    </Box>
  );
}
