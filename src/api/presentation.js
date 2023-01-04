import axiosClient from "../utils/axiosClient";

const presentationApi = {
  createPresentation: (name, description, userId) =>
    axiosClient.post("/presentations", { name, description, userId }),

  getPresentations: (userId) =>
    axiosClient.get(`/presentations?userId=${userId}`),

  getPresentationById: (id) => axiosClient.get(`/presentation/${id}`),

  deletePresentation: (id) => axiosClient.delete(`/presentation/${id}`),

  getAllSlides: (presentationId, userId) =>
    axiosClient.get(`/presentations/slides/${presentationId}?userId=${userId}`),

  updateMultipleChoiceSlide: (id, data) =>
    axiosClient.put(`/slide/${id}`, {
      title: data.question,
      options: data.options,
    }),

  createSlide: (presentationId) =>
    axiosClient.post("/presentations/slides", {
      presentationId,
    }),

  updateSlide: (presentationId, slideId, data) =>
    axiosClient.put(`/presentations/slides/${slideId}`, {
      presentationId,
      question: data.question,
      options: data.options,
    }),

  deleteSlide: (id) => axiosClient.delete(`/slide/${id}`),
};

export default presentationApi;
