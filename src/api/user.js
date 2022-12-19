import axiosClient from "../utils/axiosClient";

const userApi = {
  getUserInfo: (userId) => axiosClient.get(`/users/${userId}`),
  updateUserInfo: (userId, user) => axiosClient.put(`/users/${userId}`, user),
  changePassword: (oldPassword, newPassword) =>
    axiosClient.put("/user/change-password", {
      oldPassword,
      newPassword,
    }),
};

export default userApi;
