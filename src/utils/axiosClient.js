import axios from "axios";

import { APP_LOGOUT_EVENT } from "./constants";

import getJwtToken from "../utils/getJwtToken";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const cf = config;
    const { jwtToken, isExpired } = getJwtToken();

    if (!jwtToken || isExpired) {
      document.dispatchEvent(new CustomEvent(APP_LOGOUT_EVENT, {}));
      return cf;
    }

    cf.headers = { Authorization: `Bearer ${jwtToken}` };

    return cf;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;
