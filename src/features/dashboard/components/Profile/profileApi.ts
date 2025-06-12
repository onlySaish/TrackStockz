import axios, { AxiosError } from 'axios';
import type { UpdatePasswordPayload, UserProfile } from '../../dashboardTypes';
// Update profile API

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + '/api/v1', // Backend API base URL
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

export async function currentProfileApi(): Promise<UserProfile> {
  try {
    const response = await axiosInstance.get<{ data: UserProfile }>("/users/currentUser");
    return response.data.data; 
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to fetch user details";
  }
}

export async function updateProfileApi(profileData: Partial<UserProfile>){
  try {
    const response = await axiosInstance.patch<{ data: { user: UserProfile } }>('/users/updateAccountDetails', profileData);
    return response.data.data.user;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to Update Profile";
  }
};

// Update avatar API
export async function updateAvatarApi(avatarFile: File | null): Promise<UserProfile> {
    try {
      if (!avatarFile) {
          throw new Error("No avatar file provided");
      }
      const formData = new FormData();
      formData.append('avatar', avatarFile);
    
      const response = await axiosInstance.patch<{ data: { user: UserProfile } }>('/users/updateAvatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data.user;
    } catch (error: any) {
      throw error.response?.data?.message || "Failed to Update Avatar";
    }
  };

export async function updatePasswordApi({oldPassword, newPassword}: UpdatePasswordPayload){
    try {
      const response = await axiosInstance.patch('/users/changePassword', {oldPassword, newPassword});
      return response.data.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Failed to Update Password";
    }
};
