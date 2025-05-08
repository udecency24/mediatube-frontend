import api from "./index";

/**
 * Add a comment to a video
 * @param {string|number} videoId - The ID of the video
 * @param {string} comment - The comment text
 * @returns {Promise} - Promise with the created comment
 */
export const addComment = async (videoId, comment) => {
  try {
    const response = await api.post(`/videos/${videoId}/comments`, { comment });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all comments for a video
 * @param {string|number} videoId - The ID of the video
 * @returns {Promise} - Promise with the comments array
 */
export const getComments = async (videoId) => {
  try {
    const response = await api.get(`/videos/${videoId}/comments`);
    return response;
  } catch (error) {
    throw error;
  }
};
