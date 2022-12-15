import {
  Button,
  CopyButton,
  Group,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import React, { useEffect, useMemo, useState } from "react";

import { io as socketIO } from "socket.io-client";

import config from "../../../../config";

import MultiChoiceDisplaySlide from "../../presentation/slides/MultiChoice";
import {
  ClientToServerEventType,
  ServerToClientEventType,
  WaitInRoomType,
} from "../../../socket/types";
import { SlideType } from "../../../utils/constants";
import getJwtToken from "../../../utils/getJwtToken";

export default function HostPresentation({ presentation }) {
  const [roomId, setRoomId] = useState("");
  const { jwtToken } = getJwtToken();

  const multiChoiceSlide = presentation.slides.find(
    (s) => s.slideType === SlideType.MultipleChoice
  );
  const [options, setOptions] = useState(multiChoiceSlide?.options || []);

  const displaySlideData = useMemo(
    () =>
      multiChoiceSlide && {
        type: SlideType.MultipleChoice,
        title: multiChoiceSlide.title,
        options,
        time: 30,
      },
    [multiChoiceSlide, options]
  );
  const invitationLink = `${config.backendUrl}/presentation/join`;

  const isLoading = multiChoiceSlide === undefined || !!roomId;

  const socket = useMemo(
    () =>
      socketIO(config.backendUrl, {
        extraHeaders: { Authorization: `Bearer ${jwtToken}` },
      }),
    [jwtToken]
  );

  useEffect(() => {
    socket.on("connect", () => {
      socket.on(ServerToClientEventType.waitHostCreateRoom, (data) => {
        setRoomId(data.roomId);
      });

      socket.on(ServerToClientEventType.waitInRoom, (data) => {
        switch (data.type) {
          case WaitInRoomType.newSlide: {
            break;
          }

          case WaitInRoomType.newVote: {
            if (displaySlideData) {
              setOptions(data.data);
            }

            break;
          }

          case WaitInRoomType.info: {
            break;
          }

          default: {
            break;
          }
        }
      });

      socket.emit(ClientToServerEventType.hostCreateRoom, {
        presentationId: presentation._id.toString(),
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [displaySlideData, presentation._id, socket]);

  return (
    <Skeleton visible={!isLoading}>
      <Stack>
        <Group position="center">
          <Text>Copy the code</Text>
          <CopyButton value={roomId}>
            {({ copied, copy }) => (
              <Button size="xs" color={copied ? "teal" : "blue"} onClick={copy}>
                {roomId}
              </Button>
            )}
          </CopyButton>
          <Text>or the link</Text>
          <CopyButton value={invitationLink}>
            {({ copied, copy }) => (
              <Button size="xs" color={copied ? "teal" : "blue"} onClick={copy}>
                {invitationLink}
              </Button>
            )}
          </CopyButton>
        </Group>
        {displaySlideData === undefined ? (
          <div>NoSide</div>
        ) : (
          <MultiChoiceDisplaySlide {...displaySlideData} />
        )}
      </Stack>
    </Skeleton>
  );
}
