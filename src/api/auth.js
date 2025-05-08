import api from "./index";

export const loginAPI = async (username, password) => {
  try {
    const response = await api.post("/login", { username, password });
    return response;
  } catch (error) {
    throw error;
  }
};

export const registerAPI = async (username, password, role = "consumer") => {
  try {
    const response = await api.post("/register", { username, password, role });
    return response;
  } catch (error) {
    throw error;
  }
};

export const createCreatorAPI = async (username, password) => {
  try {
    const response = await api.post("/create-creator", { username, password });
    return response;
  } catch (error) {
    throw error;
  }
};
