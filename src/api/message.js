import axiosClient from "../utils/axiosClient";

const messageApi = {
  createMessage: (groupId, content, userId) =>
    axiosClient.post("/messages", { groupId, content, userId }),

  getMessagesByGroupId: (groupId) =>
    axiosClient.get(`/messages?groupId=${groupId}`),
};

export default messageApi;
