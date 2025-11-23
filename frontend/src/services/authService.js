import axios from 'axios';

const API_BASE_URL = "/api/v1";

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      username,
      password
    });
    
    const { token } = response.data;
    if (token) {
      localStorage.setItem("token", token);
    }
    return token;

  } catch (error) {
    const message = error.response?.data?.message || 'Ошибка авторизации. Попробуйте позже.'
    throw new Error(message);
  }
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};