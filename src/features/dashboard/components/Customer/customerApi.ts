import axios, { AxiosError } from 'axios';
import type { FetchCustomersParams, FetchCustomersResponse, CustomerFormData, AddCustomerResponse } from '../../dashboardTypes';
import { store } from '../../../../app/store';

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

const getOrgId = () => store.getState().organization.activeOrganizationId;

export async function fetchAllCustomersApi({
  page = 1,
  limit,
  sort,
  order,
  search,
  isBlacklistActive,
}: FetchCustomersParams): Promise<FetchCustomersResponse> {
  try {
    const orgId = getOrgId();
    const response = await axiosInstance.get<{ data: FetchCustomersResponse }>(
      `/customers/getCustomers`,
      {
        params: {
          page,
          limit,
          sort,
          order,
          search,
          blacklist: isBlacklistActive,
          organizationId: orgId
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to fetch Customers';
  }
}

export async function addCustomerApi(formData: CustomerFormData): Promise<AddCustomerResponse> {
  try {
    const orgId = getOrgId();
    const payload = { ...formData, organizationId: orgId };
    const response = await axiosInstance.post<AddCustomerResponse>("/customers/add-customer", payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to add Customer";
  }
}

// Update customer details
export async function updateCustomerApi(customerId: string, updatedData: Partial<CustomerFormData>): Promise<AddCustomerResponse> {
  try {
    const response = await axiosInstance.patch<AddCustomerResponse>(`/customers/update-customer/${customerId}`, updatedData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to update Customer details";
  }
}

export async function toggleBlacklistCustomerApi(customerId: string): Promise<AddCustomerResponse> {
  try {
    const response = await axiosInstance.patch<AddCustomerResponse>(`/customers/toggle-blacklist-customer/${customerId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to toggle Customer from blacklist";
  }
}