import axiosClient from "../utils/axiosClient";

const groupApi = {
  createGroup: (name, description, createdUserId) =>
    axiosClient.post("/groups", {
      name,
      description,
      createdUserId,
    }),

  getGroupById: (id) => axiosClient.get(`/groups/${id}`),

  getGroupsOwner: (createdUserId) =>
    axiosClient.get(`/groups/owner/${createdUserId}`),

  getAllGroupsByUserId: (userId) => axiosClient.get(`/groups/users/${userId}`),

  inviteUserByEmail: (groupId, email, userRole) =>
    axiosClient.post(`/groups/invite/${groupId}`, {
      email,
      userRole,
    }),

  joinGroup: (groupId, email, userRole) =>
    axiosClient.post(`/groups/joinGroup/${groupId}`, { email, userRole }),

  changeRoleMember: (groupId, userId, userRole) =>
    axiosClient.post(`/groups/${groupId}/changeRole/${userId}`, {
      userRole,
    }),

  leaveGroup: (groupId, userId) =>
    axiosClient.get(`/groups/${groupId}/leaveGroup/${userId}`),

  removeMember: (groupId, userId) =>
    axiosClient.get(`/groups/${groupId}/remove/${userId}`),

  deleteGroup: (groupId) => axiosClient.delete(`/groups/${groupId}`),
};

export default groupApi;
