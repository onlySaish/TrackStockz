import axios from 'axios';
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
  (error) => {
    console.error("API Error:", error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export async function currentProfileApi() {
  try {
    const response = await axiosInstance.get("/users/currentUser");
    // console.log(response.data.data);
    return response.data.data; // Extract user object from response
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch user details";
  }
}

export async function updateProfileApi(profileData){
  try {
    const response = await axiosInstance.patch('/users/updateAccountDetails', profileData);
    console.log(response);
    return response.data.data.user;
  } catch (error) {
    throw error.response?.data?.message || "Failed to Update Profile";
  }
};

// Update avatar API
export async function updateAvatarApi(avatarFile){
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
    
      const response = await axiosInstance.patch('/users/updateAvatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data.user;
    } catch (error) {
      throw error.response?.data?.message || "Failed to Update Avatar";
    }
  };

export async function updatePasswordApi({oldPassword, newPassword}){
    try {
      const response = await axiosInstance.patch('/users/changePassword', {oldPassword, newPassword});
      console.log(response);
      return response.data.data.user;
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Failed to Update Password";
    }
};

// export async function sendOtpAPI({phoneNumber}){
//   try {
//     const response = await axiosInstance.post('/users/send-phone-otp', phoneNumber);
//     console.log(response);
//     return response.data;
//   } catch (error) {
//     console.log(error);
//     throw error.response?.data?.message || "Failed to Send Otp";
//   }
// };

// export async function verifyOtpAPI({phoneNumber, otp}){
//   try {
//     const response = await axiosInstance.post('/users/verify-phone-otp', {phoneNumber, otp});
//     return response.data;
//   } catch (error) {
//     console.log(error);
//     throw error.response?.data?.message || "Failed to Verify OTP";
//   }
// };
