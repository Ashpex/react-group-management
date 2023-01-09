import { Box, Button, createStyles, Radio, Title } from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import presentationApi from "../../../../api/presentation";
import * as notificationManager from "../../../common/notificationManager";
import socketIOClient from "socket.io-client";

const useStyles = createStyles((theme) => ({
  root: {
    border: "2px solid #e9eaeb",
    borderRadius: 8,

    "&:hover": {
      borderColor: theme.colors.blue[5],
    },

    "& .mantine-Radio-body": {
      width: "100%",
      height: "100%",
      padding: 16,

      "& .mantine-Radio-inner, .mantine-Radio-labelWrapper": {
        fontSize: 16,
      },
    },
  },

  label: {
    fontSize: 16,
    fontWeight: 600,
  },
}));

export default function SlideQuestion() {
  const { slideId } = useParams();
  const [slide, setSlide] = useState({});
  const [value, setValue] = useState("");
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isError, setIsError] = useState(false);
  const { classes } = useStyles();
  const socketRef = useRef();

  const submit = async () => {
    try {
      await presentationApi.submitAnswer(slideId, value);
      notificationManager.showSuccess("", "Submit answer successfully");
      socketRef.current.emit("memberAnswer", { slideId });
      setHasAnswered(true);
    } catch (error) {
      notificationManager.showFail("", "Submit answer failed");
    }
  };

  const getSlideById = async (slideId) => {
    try {
      const response = await presentationApi.getSlideById(slideId);
      setSlide(response.data);
    } catch (error) {
      notificationManager.showFail("", "Get slide failed");
      setIsError(true);
    }
  };

  useEffect(() => {
    if (slideId) {
      getSlideById(slideId);
    }
  }, []);

  useEffect(() => {
    socketRef.current = socketIOClient.connect(process.env.REACT_APP_BACKEND);

    socketRef.current.on("updateOptions", () => {
      if (slideId) {
        getSlideById(slideId);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  if (hasAnswered) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Title> Thanks for your answer </Title>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Title> Can not get slide </Title>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "60%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Title
          sx={{
            fontSize: "3rem",
            textAlign: "center",
          }}
        >
          Question: {slide?.question}
        </Title>

        <Box
          sx={{
            width: "40%",
            marginTop: "2rem",
          }}
        >
          <Radio.Group
            value={value}
            onChange={setValue}
            name="favoriteFramework"
            orientation="vertical"
          >
            {(slide?.options || []).map((v, index) => (
              <Radio
                className={classes.root}
                key={index}
                value={v._id}
                label={v.value}
              />
            ))}
          </Radio.Group>

          <Button
            sx={{
              width: "100%",
              marginTop: "2rem",
              height: "48px",
              borderRadius: "8px",
            }}
            className={classes.label}
            onClick={submit}
            disabled={hasAnswered || !value}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
