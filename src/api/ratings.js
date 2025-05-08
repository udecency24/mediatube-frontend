import api from "./index";

export const addRating = async (videoId, rating) => {
  try {
    const response = await api.post(`/videos/${videoId}/ratings`, { rating });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getRatings = async (videoId) => {
  try {
    const response = await api.get(`/videos/${videoId}/ratings`);
    return response;
  } catch (error) {
    throw error;
  }
};
