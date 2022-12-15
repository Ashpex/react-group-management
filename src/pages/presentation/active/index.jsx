import { Container, Skeleton, Title } from "@mantine/core";
import React, { useCallback, useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import presentationApi from "../../../api/presentation";
import userApi from "../../../api/user";
import * as notificationManager from "../../common/notificationManager";
import HostPresentation from "../../presentation/active/hostPresentation";
import { isAxiosError } from "../../../utils/axiosErrorHandler";

const useUser = () => {
  const [user, setUser] = useState();
  const fetchData = async () => {
    try {
      const { data: response } = await userApi.getMe();

      setUser(response.data);
    } catch (error) {
      if (isAxiosError(error)) {
        notificationManager.showFail("", error.response?.data.message);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { user };
};

const usePresentation = (presentationId) => {
  const [presentation, setPresentation] = useState();
  const fetchData = useCallback(async () => {
    if (!presentationId) {
      return;
    }

    try {
      const { data: response } = await presentationApi.getPresentationById(
        presentationId
      );

      setPresentation(response.data);
    } catch (error) {
      if (isAxiosError(error)) {
        notificationManager.showFail("", error.response?.data.message);
      }
    }
  }, [presentationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { presentation };
};

export default function ActivePresentation() {
  const { presentationId = "" } = useParams();
  const { user } = useUser();
  const { presentation } = usePresentation(presentationId);
  const isHost = (user?._id || "unknown") === presentation?.userCreated._id;

  return (
    <Container fluid sx={{ height: "100%" }}>
      <Skeleton visible={user === undefined}>
        {isHost ? (
          <HostPresentation presentation={presentation} />
        ) : (
          <Title order={3} sx={{ textAlign: "center" }}>
            You cannot start a presentation that is not yours
          </Title>
        )}
      </Skeleton>
    </Container>
  );
}
