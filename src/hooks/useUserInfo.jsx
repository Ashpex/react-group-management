import Cookies from "js-cookie";
import { useJwt } from "react-jwt";

import { AUTH_COOKIE } from "../utils/constants";

export default function useUserInfo() {
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
  const token = Cookies.get(AUTH_COOKIE);

  const { isExpired } = useJwt(token);

  if (isExpired || !user) {
    return { userInfo: null };
  }

  return { userInfo: user };
}
