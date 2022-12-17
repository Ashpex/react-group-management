import {
  Button,
  Group,
  SimpleGrid,
  TextInput,
  Title,
  Text,
} from "@mantine/core";
import React, { useEffect, useMemo, useState } from "react";

import { io as socketIO } from "socket.io-client";

import {
  ClientToServerEventType,
  ServerToClientEventType,
} from "../../../socket/types";
import { SlideType } from "../../../utils/constants";

import getJwtToken from "../../../utils/getJwtToken";

function InputCodePage({ setRoomId }) {
  const [input, setInput] = useState("");

  return (
    <Group position="center">
      <TextInput
        placeholder="Enter room id here"
        value={input}
        onChange={(e) => setInput(e.currentTarget.value)}
      />
      <Button onClick={() => setRoomId(input)}>Join</Button>
    </Group>
  );
}

function ShowPage({ roomId }) {
  const { jwtToken } = getJwtToken();

  const [presentation, setPresentation] = useState();
  const [voteValue, setVoteValue] = useState();

  const multiChoiceSlide = (presentation?.slides || []).find(
    (s) => s.slideType === SlideType.MultipleChoice
  );
  const options = multiChoiceSlide?.options || [];

  const socket = useMemo(
    () =>
      socketIO(process.env.REACT_APP_BACKEND_URL || "http://localhost:3000", {
        extraHeaders: { Authorization: `Bearer ${jwtToken}` },
      }),
    [jwtToken]
  );

  const sendVote = (option) => {
    setVoteValue(option);
    socket.emit(ClientToServerEventType.memberVote, {
      slideId: multiChoiceSlide?._id || "",
      optionIndex: option.index === undefined ? -1 : option.index,
    });
  };

  useEffect(() => {
    socket.on("connect", () => {
      socket.on(ServerToClientEventType.waitJoinRoom, (data) => {
        setPresentation(data.data);
      });

      socket.emit(ClientToServerEventType.joinRoom, { roomId });
    });

    return () => {
      socket.emit(ClientToServerEventType.leaveRoom, { roomId });
      socket.disconnect();
    };
  }, [roomId, socket]);

  return (
    <div>
      <Title order={3} sx={{ textAlign: "center" }}>
        {multiChoiceSlide?.title}
      </Title>
      {voteValue ? (
        <Text sx={{ textAlign: "center" }}>
          You voted for {voteValue.value}
        </Text>
      ) : (
        <SimpleGrid
          cols={4}
          spacing="lg"
          breakpoints={[
            {
              maxWidth: 980,
              cols: 3,
              spacing: "md",
            },
            {
              maxWidth: 755,
              cols: 2,
              spacing: "sm",
            },
            {
              maxWidth: 600,
              cols: 1,
              spacing: "sm",
            },
          ]}
        >
          {options.map((o) => (
            <Button key={`${o.index}__${o.value}`} onClick={() => sendVote(o)}>
              {o.value}
            </Button>
          ))}
        </SimpleGrid>
      )}
    </div>
  );
}

export default function GuestPresentation() {
  const [roomId, setRoomId] = useState("");

  return roomId ? (
    <ShowPage roomId={roomId} />
  ) : (
    <InputCodePage setRoomId={setRoomId} />
  );
}
