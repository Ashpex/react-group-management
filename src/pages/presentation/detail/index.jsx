/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from "@mantine/core";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import presentationApi from "../../../api/presentation";
import useUserInfo from "../../../hooks/useUserInfo";
import PresentationContent from "../content";
import PresentationHeader from "../header";
import PresentationOption from "../option";
import PresentationSlides from "../slides/list";
import * as notificationManager from "../../common/notificationManager";

export default function PresentationDetail() {
  const { presentationId } = useParams();
  const { userInfo } = useUserInfo();
  const [slides, setSlides] = useState([]);
  const [selectedSlide, setSelectedSlide] = useState(0);

  useEffect(() => {
    getAllSlides();
  }, []);

  const getAllSlides = useCallback(async () => {
    try {
      const response = await presentationApi.getAllSlides(
        presentationId,
        userInfo._id
      );

      setSlides(response.data);
    } catch (error) {
      console.log(error);
      notificationManager.showFail("", error.response?.data.message);
    }
  }, []);

  const createSlide = async () => {
    try {
      await presentationApi.createSlide(presentationId);
      getAllSlides();
    } catch (error) {
      console.log(error);
      notificationManager.showFail("", error.response?.data.message);
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
        height: "calc(100% + 32px)",
        marginTop: "-16px",
        overflow: "hidden",
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
          }}
        >
          <PresentationContent
            sx={{
              marginTop: "32px",
              height: "calc(100% - 166px)",
              backgroundColor: "#fff",
              padding: "16px",
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
            padding: "0 16px",
          }}
        >
          <PresentationOption
            sx={{
              marginTop: "16px",
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
