import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.BACKEND_URL + '/api/v1',  // Backend API base URL
  withCredentials: true, // Include cookies in requests
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

export async function addOrderApi(order){
  try {
    const response = await axiosInstance.post('/orders', order);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to Add Order";
  }
};

