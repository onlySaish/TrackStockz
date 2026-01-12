import axios, { AxiosError } from 'axios';
import type { EditOrderParams, FetchOrdersParams, FetchOrdersResponse, OrderResponse } from '../../dashboardTypes';
import { store } from '../../../../app/store';

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

const getOrgId = () => store.getState().organization.activeOrganizationId;

export async function fetchAllOrdersApi({ page = 1, limit, sort, order, search, status, paymentMethod }: FetchOrdersParams) {
  try {
    const orgId = getOrgId();
    const response = await axiosInstance.get<{ data: FetchOrdersResponse }>(`/orders?page=${page}&limit=${limit}&sort=${sort}&order=${order}&search=${search}&status=${status}&paymentMethod=${paymentMethod}&organizationId=${orgId}`);
    return response.data?.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to fetch Products";
  }
}

export async function editOrderApi({ orderId, products, additionalDiscountPercent }: EditOrderParams): Promise<OrderResponse> {
  try {
    const response = await axiosInstance.patch<OrderResponse>(`/orders/${orderId}`, { products, additionalDiscountPercent });
    return response.data;

  } catch (error: any) {
    throw error.response?.data?.message || "Failed to Update Order";
  }
};

export async function updateOrderStatusApi({ orderId, status }: { orderId: string, status: string }): Promise<OrderResponse> {
  try {
    const response = await axiosInstance.put<OrderResponse>(`/orders/${orderId}`, { status });
    return response.data;

  } catch (error: any) {
    throw error.response?.data?.message || "Failed to Update Order";
  }
};
