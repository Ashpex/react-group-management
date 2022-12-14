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
  forgotPassword: (email) =>
    axiosClient.post("/auth/forgot-password", { email }),

  resetPassword: (password, token) =>
    axiosClient.post(`/auth/reset-password/${token}`, { password }),

  verifyEmail: (token) => axiosClient.get(`/auth/verify-email/${token}`),
};

export default authApi;
