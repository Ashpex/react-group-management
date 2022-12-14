import axiosClient from "../utils/axiosClient";

const presentationApi = {
  createPresentation: (name) => axiosClient.post("/presentation", { name }),
  getMyPresentations: () => axiosClient.get("/presentation/my-presentation"),
  getPresentationById: (id) => axiosClient.get(`/presentation/${id}`),
  deletePresentation: (id) => axiosClient.delete(`/presentation/${id}`),
  updateMultipleChoiceSlide: (id, data) =>
    axiosClient.put(`/slide/${id}`, {
      title: data.question,
      options: data.options,
    }),
  createSlide: (presentationId) =>
    axiosClient.post("/slide", { presentationId }),
  deleteSlide: (id) => axiosClient.delete(`/slide/${id}`),
};

export default presentationApi;
