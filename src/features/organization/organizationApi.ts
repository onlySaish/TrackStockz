import axios, { AxiosError } from 'axios';
import type { AddMemberRequest, CreateOrganizationRequest, Organization } from './organizationTypes';

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

export async function fetchUserOrganizationsApi(): Promise<Organization[]> {
  try {
    const response = await axiosInstance.get<{ data: Organization[] }>('/organizations');
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to fetch organizations";
  }
}

export async function createOrganizationApi(data: CreateOrganizationRequest): Promise<Organization> {
  try {
    const response = await axiosInstance.post<{ data: Organization }>('/organizations', data);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to create organization";
  }
}

export async function fetchOrganizationMembersApi(organizationId: string): Promise<any[]> {
  try {
    const response = await axiosInstance.get<{ data: any[] }>(`/organizations/${organizationId}/members`);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to fetch members";
  }
}

export async function addMemberApi(organizationId: string, data: AddMemberRequest): Promise<any> {
  try {
    const response = await axiosInstance.post<{ data: any }>(`/organizations/${organizationId}/members`, data);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to add member";
  }
}

export async function joinOrganizationApi(inviteCode: string): Promise<Organization> {
  try {
    const response = await axiosInstance.post<{ data: { membership: any, organization: Organization } }>('/organizations/join', { inviteCode });
    return response.data.data.organization;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to join organization";
  }
}

export async function removeMemberApi(organizationId: string, memberId: string): Promise<void> {
  try {
    await axiosInstance.delete(`/organizations/${organizationId}/members/${memberId}`);
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to remove member";
  }
}
