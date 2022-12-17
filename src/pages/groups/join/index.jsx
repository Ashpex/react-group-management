import Cookies from "js-cookie";
import { useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import groupApi from "../../../api/group";
import * as notificationManager from "../../common/notificationManager";
import { isAxiosError } from "../../../utils/axiosErrorHandler";
import { AUTH_COOKIE } from "../../../utils/constants";

export default function JoinGroup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const sendRequest = useCallback(
    async (tokenString) => {
      try {
        const { data: response } = await groupApi.joinGroup(tokenString);

        notificationManager.showSuccess("", response.message);
        navigate(`/group/${response.data._id}`);
      } catch (error) {
        if (isAxiosError(error)) {
          notificationManager.showFail("", error.response?.data.message);
          navigate("/groups");
        }
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (token) {
      if (!Cookies.get(AUTH_COOKIE)) {
        navigate(`/login?token=${token}`);
      } else {
        sendRequest(token);
      }
    }
  }, [token, sendRequest, navigate]);

  return null;
}
