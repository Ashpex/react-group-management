import axiosClient from "../utils/axiosClient";

const authApi = {
  signIn: (email, password) =>
    axiosClient.post("/auth/login", {
      email,
      password,
    }),
  signUp: (email, password, name) =>
    axiosClient.post("/auth/register", {
      email,
      password,
      name,
    }),
};

export default authApi;
