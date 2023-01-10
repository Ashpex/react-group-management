import axiosClient from "../utils/axiosClient";

const presentationApi = {
  createPresentation: (name, description, userId) =>
    axiosClient.post("/presentations", { name, description, userId }),

  getPresentations: (userId) =>
    axiosClient.get(`/presentations?userId=${userId}`),

  deletePresentation: (id) => axiosClient.delete(`/presentation/${id}`),

  getAllSlides: (presentationId, userId) =>
    axiosClient.get(
      `/presentations/slides?presentationId=${presentationId}&userId=${userId}`
    ),

  getSlideById: (id) => axiosClient.get(`/presentations/slides/${id}`),

  createSlide: (presentationId) =>
    axiosClient.post("/presentations/slides", {
      presentationId,
    }),

  updateSlide: (presentationId, slideId, data) =>
    axiosClient.put(`/presentations/slides/${slideId}`, {
      presentationId,
      type: data.type,
      heading: data.heading,
      subHeading: data.subHeading,
      paragraph: data.paragraph,
      question: data.question,
      options: data.options,
      answer: data.answer,
    }),

  deleteSlide: (presentationId, slideId) =>
    axiosClient.delete(`/presentations/slides/${slideId}`, {
      presentationId,
    }),

  submitAnswer: (slideId, answerId) => {
    return axiosClient.post(`/presentations/slides/${slideId}/answer`, {
      answerId,
    });
  },
};

export default presentationApi;
