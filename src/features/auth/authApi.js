import axios from 'axios'

// export async function createUser(formData) {
//   return axios.post('/api/v1/users/register', formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   })
//   .then((response) => {
//     return response;
//   })
//   .catch((error) => {
//     if (error) {
//       throw new Error(error.response.data.message); // Extract backend error message
//     } else {
//       throw new Error('Something went wrong. Please try again.'); // Fallback error
//     }
//   });
// }

// export async function loginUser(loginInfo) {
//   return axios.post('/api/v1/users/login', loginInfo, {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })
//   .then((response) => {
//     return response;
//   })
//   .catch((error) => {
//     if (error) {
//       throw new Error(error.response.data.message); // Extract backend error message
//     } else {
//       throw new Error('Something went wrong. Please try again.'); // Fallback error
//     }
//   });
// }

// export function checkAuth() {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const response = await axios.get('/api/v1/users/check');
//       resolve({ data: response.data });
//     } catch (error) {
//       if (error.response) {
//         reject(error.response.data.message || 'Authentication failed');
//       } else if (error.request) {
//         reject('No response from server. Please try again.');
//       } else {
//         reject('An error occurred while checking authentication.');
//       }
//     }
//   });
// }

// export function signOut() {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const response = await axios.post('/api/v1/users/logout');
//       resolve({ data: 'success' });
//     } catch (error) {
//       if (error.response) {
//         reject(error.response.data.message || 'Logout failed');
//       } else if (error.request) {
//         reject('No response from server. Please try again.');
//       } else {
//         reject('An error occurred while logging out.');
//       }
//     }
//   });
// }


const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + '/api/v1', // Backend API base URL
  withCredentials: true, // Include cookies in requests
});

export async function refreshAccessToken() {
  try {
    const response = await axiosInstance.post('/users/refresh-token');
    return response.data.accessToken; // Return the new access token
  } catch (error) {
    console.error('Failed to refresh access token:', error.message);
    throw error;
  }
}

axiosInstance.interceptors.response.use(
  (response) => response, // Pass successful responses
  async (error) => {
    if (error.response?.status === 401) { // Handle 401 Unauthorized errors
      try {
        const accessToken = await refreshAccessToken(); // Refresh the token
        error.config.headers['Authorization'] = `Bearer ${accessToken}`; // Update the token in the headers
        return axiosInstance(error.config); // Retry the original request with the new token
      } catch (err) {
        console.error('Token refresh failed:', err.message);
        throw err; // Reject if token refresh fails
      }
    }
    return Promise.reject(error.response.data); // Pass all other errors
  }
);

//User Register
export function sendOtp(data) {
  return axiosInstance.post("/users/send-otp", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function verifyOtp(data) {
  return axiosInstance.post("/users/verify-otp", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function createUser(data) {
  return axiosInstance.post('/users/register', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

//User Login
export function loginUser(loginInfo) {
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

// export function fetchProtectedData() {
//   return axiosInstance.get('/protected-route');
// }

//Password Reset by Email
export function forgotPassword(email){
  return axiosInstance.post('/users/forgot-password', {email});
};

export function verifyToken(token){
  return axiosInstance.post(`/users/verify-token/${token}`);
};

export function resetPassword({token, newPassword}){
  return axiosInstance.post('/users/reset-password',{token, newPassword});
};

//Password Reset by Phone
// export function phoneForgotPass({phoneNumber}){
//   return axiosInstance.post('/users/forgot-phone-pass', {phoneNumber});
// };

// export function forgotPassVerifyPhoneOtp({phoneNumber,otp}){
//   return axiosInstance.post('/users/forgotPass-verify-phone-otp', {phoneNumber,otp});
// };

export function googleAuthApi(code) {
 return axiosInstance.get(`/users/google-auth?code=${code}`, {   
    headers: {
      'Content-Type': 'application/json',
    },
  });
}


export default axiosInstance; 