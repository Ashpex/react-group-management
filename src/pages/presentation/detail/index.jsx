/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from "@mantine/core";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import presentationApi from "../../../api/presentation";
import useUserInfo from "../../../hooks/useUserInfo";
import PresentationContent from "../content";
import PresentationHeader from "../header";
import PresentationOption from "../option";
import PresentationSlides from "../slides/list";
import * as notificationManager from "../../common/notificationManager";
import socketIOClient from "socket.io-client";

export default function PresentationDetail() {
  const { presentationId } = useParams();
  const { userInfo } = useUserInfo();
  const [slides, setSlides] = useState([]);
  const [selectedSlide, setSelectedSlide] = useState(0);
  const socketRef = useRef();

  useEffect(() => {
    getAllSlides();
  }, []);

  useEffect(() => {
    socketRef.current = socketIOClient.connect(process.env.REACT_APP_BACKEND);

    socketRef.current.on("memberAnswer", () => {
      getAllSlides();
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const getAllSlides = useCallback(async () => {
    try {
      const response = await presentationApi.getAllSlides(
        presentationId,
        userInfo._id
      );

      setSlides(response.data);
    } catch (error) {
      notificationManager.showFail("", "Get all slides failed");
    }
  }, []);

  useEffect(() => {
    const slide = slides[selectedSlide];
    if (slide?._id) {
      socketRef.current.emit("changeSlide", { slideId: slide._id });
    }
  }, [selectedSlide]);

  const createSlide = async () => {
    try {
      await presentationApi.createSlide(presentationId);
      getAllSlides();
    } catch (error) {
      notificationManager.showFail("", "Create slide failed");
    }
  };

  const deleteSlide = async (slideId) => {
    try {
      await presentationApi.deleteSlide(presentationId, slideId);
      getAllSlides();
    } catch (error) {
      notificationManager.showFail("", "Delete slide failed");
    }
  };

  const currentSlide = useMemo(() => {
    return slides[selectedSlide];
  }, [slides?.length, selectedSlide]);

  return (
    <Box
      sx={{
        width: "calc(100% + 32px)",
        marginLeft: "-16px",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          padding: "16px",
          borderBottom: "1px solid #e9ecef",
        }}
      >
        <PresentationHeader createSlide={createSlide} />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            flex: 1,
            width: "100%",
            height: "100%",
            overflow: "auto",
            borderRight: "1px solid #e9ecef",
            background: "#fff",
          }}
        >
          <PresentationSlides
            sx={{
              with: "100%",
            }}
            slides={slides}
            setSelectedSlide={setSelectedSlide}
            selectedSlide={selectedSlide}
            deleteSlide={deleteSlide}
          />
        </Box>

        <Box
          sx={{
            flex: 4,
            width: "100%",
            height: "100%",
            padding: "0 32px",
            overflow: "auto",
            backgroundColor: "#dbdce1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PresentationContent
            sx={{
              width: "100%",
              height: "calc(100% - 64px)",
              backgroundColor: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            slide={slides[selectedSlide]}
          />
        </Box>

        <Box
          sx={{
            flex: 2,
            borderLeft: "1px solid #e9ecef",
            width: "100%",
            height: "100%",
            overflow: "auto",
          }}
        >
          <PresentationOption
            sx={{
              margin: "16px",
            }}
            slide={currentSlide}
            getAllSlides={getAllSlides}
            presentationId={presentationId}
          />
        </Box>
      </Box>
    </Box>
  );
}
