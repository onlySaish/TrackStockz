import axios, { AxiosError } from 'axios';
import type { CreateOrderRequest, OrderApiResponse } from '../../dashboardTypes';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + '/api/v1',  // Backend API base URL
  withCredentials: true, // Include cookies in requests
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    console.error("API Error:", error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export async function addOrderApi(order: CreateOrderRequest): Promise<OrderApiResponse> {
  try {
    const response = await axiosInstance.post<OrderApiResponse>('/orders', order);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to Add Order";
  }
}
