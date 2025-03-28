import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api/v1', 
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("API Error:", error.response?.data?.message || error.message);
      return Promise.reject(error);
    }
);

export async function fetchDashboardDataApi() {
    try {
      const response = await axiosInstance.get(`/home`);
      return response.data?.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch Stats";
    }
}