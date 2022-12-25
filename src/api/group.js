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
  getGroupById: (id) => axiosClient.get(`/groups/${id}`),

  getGroupsOwner: (createdUserId) =>
    axiosClient.get(`/groups/owner/${createdUserId}`),

  getInvitationLink: (id) => axiosClient.get(`/group/${id}/get-invite-link`),

  inviteUserByEmail: (groupId, email, userRole) =>
    axiosClient.post(`/groups/invite/${groupId}`, {
      email,
      userRole,
    }),

  joinGroup: (groupId, email, userRole) =>
    axiosClient.post(`/groups/joinGroup/${groupId}`, { email, userRole }),

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
