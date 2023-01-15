/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Modal, Table, Title } from "@mantine/core";
import React, { useEffect } from "react";
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
  const [openedViewResult, setOpenedViewResult] = React.useState(false);
  const [result, setResult] = React.useState([]);

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

  const rows = result?.map((element) => (
    <tr key={element.name}>
      <td>{element.answer}</td>
      <td>
        {element.members?.map((member, index) => (
          <p key={index}>member.name</p>
        ))}
      </td>
      <td>{element.quantity}</td>
    </tr>
  ));

  useEffect(() => {
    setResult(
      (slide?.options || []).map((v) => ({
        answer: v.value,
        members: v.members,
        quantity: v.quantity,
      }))
    );
  }, [openedViewResult]);

  return (
    <Box
      sx={{
        ...sx,
      }}
    >
      <Modal
        opened={openedViewResult}
        centered
        onClose={() => setOpenedViewResult(false)}
        title="Result"
        size="70%"
      >
        <Table striped>
          <thead>
            <tr>
              <th>Answer</th>
              <th>Student</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Modal>

      {Boolean(slide?.type === "MULTIPLE_CHOICE") && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {Boolean(slide?.question) && (
            <>
              <Button
                onClick={() => {
                  setOpenedViewResult(true);
                }}
              >
                View result
              </Button>
              <Bar options={options} data={data} />
            </>
          )}
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
