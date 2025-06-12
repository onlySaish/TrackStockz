import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import type { createUserData, LoginInfo, ResetPasswordData, sendOtpData, verifyOtpData } from './authTypes';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + '/api/v1',
  withCredentials: true,
});

// Refresh Token Function
export async function refreshAccessToken(): Promise<string> {
  try {
    const response: AxiosResponse<{ accessToken: string }> = await axiosInstance.post('/users/refresh-token');
    return response.data.accessToken;
  } catch (error: unknown) {
    const err = error as AxiosError;
    console.error('Failed to refresh access token:', err.message);
    throw error;
  }
}

// Axios Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      try {
        originalRequest._retry = true;
        const accessToken = await refreshAccessToken();
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return axiosInstance(originalRequest);
      } catch (err) {
        const e = err as AxiosError;
        console.error('Token refresh failed:', e.message);
        throw e;
      }
    }

    return Promise.reject(error.response?.data || error);
  }
);

// -------------------
// Auth API Functions
// -------------------

export function sendOtp(data: sendOtpData) {
  return axiosInstance.post('/users/send-otp', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function verifyOtp(data: verifyOtpData) {
  return axiosInstance.post('/users/verify-otp', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function createUser(data: createUserData) {
  return axiosInstance.post('/users/register', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function loginUser(loginInfo: LoginInfo) {
  return axiosInstance.post('/users/login', loginInfo, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function checkAuth() {
  return axiosInstance.get('/users/check');
}

export function signOut() {
  return axiosInstance.post('/users/logout');
}

export function forgotPassword(email: string) {
  return axiosInstance.post('/users/forgot-password', { email });
}

export function verifyToken(token: string) {
  return axiosInstance.post(`/users/verify-token/${token}`);
}

export function resetPassword(data: ResetPasswordData) {
  return axiosInstance.post('/users/reset-password', data);
}

export function googleAuthApi(code: string) {
  return axiosInstance.get(`/users/google-auth?code=${code}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export default axiosInstance;
