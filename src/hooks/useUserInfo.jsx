import Cookies from "js-cookie";
import { useJwt } from "react-jwt";

import { AUTH_COOKIE } from "../utils/constants";

export default function useUserInfo() {
  const token = Cookies.get(AUTH_COOKIE);

  const { decodedToken, isExpired } = useJwt(token);

  if (isExpired) {
    return { userInfo: null };
  }

  return { userInfo: decodedToken };
}
