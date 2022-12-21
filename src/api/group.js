import axiosClient from "../utils/axiosClient";

const groupApi = {
  createGroup: (name, description, createdUserId) =>
    axiosClient.post("/groups", {
      name,
      description,
      createdUserId,
    }),
  getAll: (params) => {
    const pageSize =
      params.pageSize && params.pageSize > 0 ? params.pageSize : 10;
    const page = params.page && params.page > 0 ? params.page : 1;

    return axiosClient.get(`/group?size=${pageSize}&page=${page}`);
  },
  getGroupById: (id) => axiosClient.get(`/group/${id}`),
  getMyGroups: () => axiosClient.get("/group/my-group"),
  getInvitationLink: (id) => axiosClient.get(`/group/${id}/get-invite-link`),
  inviteUserViaEmail: (id, email) =>
    axiosClient.post(`/group/${id}/invite-user-by-email`, { email }),
  joinGroup: (token) => axiosClient.get(`/group/invite/${token}`),
  getAllMembers: (id) => axiosClient.get(`/group/${id}`),
  assignMemberRole: (groupId, userId, role) =>
    axiosClient.post(`/group/${groupId}/assign-role`, {
      user: userId,
      role,
    }),
  leaveGroup: (groupId) => axiosClient.get(`/group/${groupId}/leave`),
  kickOutMember: (groupId, userId) =>
    axiosClient.get(`/group/${groupId}/kick?userId=${userId}`),
  deleteGroup: (groupId) => axiosClient.delete(`/group/${groupId}`),
};

export default groupApi;
