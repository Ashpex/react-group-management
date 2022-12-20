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

  signInWithGoogle: (tokenId) =>
    axiosClient.post("/auth/google", {
      tokenId,
    }),
};

export default authApi;
