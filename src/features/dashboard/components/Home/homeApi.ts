import axios, { AxiosError } from 'axios';
import type { DashboardData } from '../../dashboardTypes';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + '/api/v1',
  withCredentials: true,
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

import { store } from '../../../../app/store';

const getOrgId = () => store.getState().organization.activeOrganizationId;

export async function fetchDashboardDataApi(): Promise<DashboardData> {
  try {
    const orgId = getOrgId();
    const response = await axiosInstance.get<{ data: DashboardData }>(`/home?organizationId=${orgId}`);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to fetch Stats";
  }
}