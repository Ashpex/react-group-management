import axiosClient from "../utils/axiosClient";

const groupApi = {
  createGroup: (name, description) =>
    axiosClient.post("/group", {
      name,
      description,
    }),
  getAll: (params: { pageSize; page }) => {
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
  joinGroup: (token: string) =>
    axiosClient.get<JoinGroupResponseType>(`/group/invite/${token}`),
  getAllMembers: (id: string | undefined) =>
    axiosClient.get<GetAllMemberResponseType>(`/group/${id}`),
  assignMemberRole: (
    groupId: string | undefined,
    userId: string | undefined,
    role: string
  ) =>
    axiosClient.post<AssignRoleResponseType>(`/group/${groupId}/assign-role`, {
      user: userId,
      role,
    }),
  leaveGroup: (groupId: string | undefined) =>
    axiosClient.get<LeaveGroupResponseType>(`/group/${groupId}/leave`),
  kickOutMember: (groupId: string | undefined, userId: string | undefined) =>
    axiosClient.get<KickOutResponseType>(
      `/group/${groupId}/kick?userId=${userId}`
    ),
  deleteGroup: (groupId: string | undefined) =>
    axiosClient.delete<DeleteGroupResponseType>(`/group/${groupId}`),
};

export default groupApi;
