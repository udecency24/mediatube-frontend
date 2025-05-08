import api from "./index";

export const getAllVideos = async (limit = 10, offset = 0) => {
  try {
    const response = await api.get("/videos", {
      params: { limit, offset },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getVideoById = async (id) => {
  try {
    const response = await api.get(`/videos/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const uploadVideo = async (formData) => {
  try {
    const response = await api.post("/videos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getVideosByGenre = async (genre, limit = 10, offset = 0) => {
  try {
    const response = await api.get(
      `/videos/genre/${genre}?limit=${limit}&offset=${offset}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};
