import axios from "axios";

export function isAxiosError(error) {
  return axios.isAxiosError(error);
}
