/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  CloseButton,
  Select,
  TextInput,
  Title,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import presentationApi from "../../../api/presentation";
import * as notificationManager from "../../common/notificationManager";

export default function PresentationOption({
  sx,
  slide,
  presentationId,
  getAllSlides,
}) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [options, setOptions] = useState([]);
  const [questionValueDebounce] = useDebounce(question, 400);
  const [answerValueDebounce] = useDebounce(answer, 400);
  const [optionValueDebounce] = useDebounce(options, 400);

  const updateSlide = async (data) => {
    try {
      await presentationApi.updateSlide(presentationId, slide._id, data);
      getAllSlides();
    } catch (error) {
      console.log(error);
      notificationManager.showFail("", error.response?.data.message);
    }
  };

  useEffect(() => {
    if (slide) {
      setQuestion(slide?.question);
      setOptions(slide?.options);
      setAnswer(slide?.answer);
    }
  }, [slide?.question, slide?.options]);

  useEffect(() => {
    if (slide) {
      updateSlide({
        question: questionValueDebounce,
        options: optionValueDebounce,
        answer: answerValueDebounce,
      });
    }
  }, [questionValueDebounce, optionValueDebounce, answerValueDebounce]);

  return (
    <Box sx={sx}>
      <>
        <TextInput
          label="Question"
          placeholder="Your question"
          required
          value={question || ""}
          onChange={(e) => setQuestion(e.target.value)}
        />

        {Boolean(options?.length) && (
          <Select
            mt={"md"}
            label="Anwser"
            placeholder="Choose anwser"
            value={answer}
            data={[
              ...options.map((option, index) => ({
                label: option.value,
                value: option.value,
              })),
            ]}
            onChange={(value) => setAnswer(value)}
          />
        )}

        {options.map((option, index) => (
          <OptionItem
            key={index}
            valueOption={option.value}
            updateValueOption={(value) => {
              const newOptions = [...options];
              newOptions[index].value = value;
              setOptions(newOptions);
            }}
            removeOption={() => {
              const newOptions = [...options];
              newOptions.splice(index, 1);
              setOptions(newOptions);
            }}
            number={index + 1}
          />
        ))}

        <Box mt="lg">
          <Button
            sx={{
              width: "100%",
            }}
            onClick={() => {
              setOptions([
                ...options,
                {
                  value: "",
                  quantity: 0,
                },
              ]);
            }}
          >
            Add Option
          </Button>
        </Box>
      </>
    </Box>
  );
}

const OptionItem = ({
  valueOption,
  updateValueOption,
  removeOption,
  number,
}) => {
  return (
    <Box
      mt="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <Title
        order={6}
        sx={{
          fontWeight: "500",
        }}
      >
        Options {number}
      </Title>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <TextInput
          placeholder="Option 1"
          sx={{
            width: "100%",
          }}
          value={valueOption}
          onChange={(e) => updateValueOption(e.target.value)}
        />
        <CloseButton onClick={removeOption} />
      </Box>
    </Box>
  );
};
