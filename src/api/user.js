import axiosClient from "../utils/axiosClient";

const userApi = {
  getUserInfo: (userId) => axiosClient.get(`/users/${userId}`),
  updateUserInfo: (userId, user) => axiosClient.put(`/users/${userId}`, user),
  changePassword: (userId, oldPassword, newPassword) =>
    axiosClient.put(`/users/change-password/${userId}`, {
      oldPassword,
      newPassword,
    }),
};

export default userApi;
