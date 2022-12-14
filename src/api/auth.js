import axiosClient from "../utils/axiosClient";

const authApi = {
  signIn: (email, password) =>
    axiosClient.post("/auth/sign-in", {
      email,
      password,
    }),
  signUp: (email, password, name) =>
    axiosClient.post("/auth/sign-up", {
      email,
      password,
      name,
    }),
};

export default authApi;
