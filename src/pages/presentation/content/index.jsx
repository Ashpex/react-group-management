import { Box } from "@mantine/core";
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
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
      {Boolean(slide?.question) && <Bar options={options} data={data} />}
    </Box>
  );
}
