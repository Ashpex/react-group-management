import axiosClient from "../utils/axiosClient";

const userApi = {
  getMe: () => axiosClient.get("/user/me"),
  updateMe: (name, description) =>
    axiosClient.put("/user/me", { name, description }),
  changePassword: (oldPassword, newPassword) =>
    axiosClient.put("/user/change-password", {
      oldPassword,
      newPassword,
    }),
};

export default userApi;
