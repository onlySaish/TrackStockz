import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  createUser,
  loginUser,
  checkAuth,
  signOut,
  forgotPassword,
  verifyToken,
  resetPassword,
  verifyOtp,
  sendOtp,
  // refreshAccessToken
} from './authApi';

const initialState = {
    loggedInUserToken: null,
    status: 'idle',
    error: null,
    userChecked: false,
    mailSent: false,
    passwordReset:false,
    tokenVerified:false,
    popup: {
      visible: false,
      message: '',
      duration: 3000, // Default duration
      type: 'success', // Can be 'success' or 'error'
    },
};

export const sendOtpAsync = createAsyncThunk(
  "users/sendOtp", 
  async (data, { rejectWithValue }) => {
  try {
    const response = await sendOtp(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const verifyOtpAsync = createAsyncThunk(
  "auth/verifyOtp", 
  async (data,{ rejectWithValue }) => {
  try {
    const response = await verifyOtp(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const createUserAsync = createAsyncThunk(
  'user/createUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await createUser(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginUserAsync = createAsyncThunk(
  'user/loginUser',
  async (loginInfo, { rejectWithValue }) => {
    try {
      const response = await loginUser(loginInfo);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkAuthAsync = createAsyncThunk(
  'user/checkAuth', 
  async () => {
  try {
    const response = await checkAuth();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const signOutAsync = createAsyncThunk(
  'user/signOut',
  async () => {
    const response = await signOut();
    return response.data;
  }
);

// export const refreshAccessTokenAsync = createAsyncThunk(
//   'user/refreshAccessToken',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await refreshAccessToken();
//       return response.data; // Assume it returns a new access token
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

export const forgotPasswordAsync = createAsyncThunk(
  'user/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await forgotPassword(email);
      console.log(response);
      return response; // Expecting success message from backend
    } catch (error) {
      console.log(error)
      return rejectWithValue(error.message);
    }
  }
);

export const verifyTokenAsync = createAsyncThunk(
  'user/verifyToken',
  async (token, { rejectWithValue }) => {
    try {
      const response = await verifyToken(token);
      return response;  // Expecting { success: true }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const resetPasswordAsync = createAsyncThunk(
  'user/resetPassword',
  async ({token, newPassword}, { rejectWithValue }) => {
    try {
      const response = await resetPassword({token, newPassword});
      return response.data; // Expecting success message from backend
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const authSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      showPopup: (state, action) => {
        state.popup = {
          visible: true,
          message: action.payload.message,
          duration: action.payload.duration || 3000,
          type: action.payload.type || 'success',
        };
      },
      hidePopup: (state) => {
        state.popup = {
          visible: false,
          message: '',
          duration: 3000,
          type: 'success',
        };
      },  
    },
    extraReducers: (builder) => {
      builder
      .addCase(sendOtpAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(sendOtpAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.popup = {
          visible: true,
          message: 'OTP Sent Successfully!',
          duration: 3000,
          type: 'success',
        };
      })
      .addCase(sendOtpAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.popup = {
          visible: true,
          message: `Error Sending OTP: ${action.payload}`,
          duration: 3000,
          type: 'error',
        };
      })
      .addCase(verifyOtpAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyOtpAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.popup = {
          visible: true,
          message: 'Email Verified Successfully!',
          duration: 3000,
          type: 'success',
        };
      })
      .addCase(verifyOtpAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.popup = {
          visible: true,
          message: `Email Verification Failed: ${action.payload}`,
          duration: 3000,
          type: 'error',
        };
      })
        .addCase(createUserAsync.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(createUserAsync.fulfilled, (state, action) => {
          state.status = 'idle';
          state.popup = {
            visible: true,
            message: 'User created successfully!',
            duration: 3000,
            type: 'success',
          };
        })
        .addCase(createUserAsync.rejected, (state, action) => {
          state.status = 'idle';
          state.popup = {
            visible: true,
            message: `User creation failed: ${action.payload}`,
            duration: 3000,
            type: 'error',
          };
        })
        .addCase(loginUserAsync.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(loginUserAsync.fulfilled, (state, action) => {
          state.status = 'idle';
          state.loggedInUserToken = action.payload;
          state.popup = {
            visible: true,
            message: 'Login Successful!',
            duration: 3000,
            type: 'success',
          };
        })
        .addCase(loginUserAsync.rejected, (state, action) => {
          state.status = 'idle';
          state.error = action.payload;
          state.popup = {
            visible: true,
            message: `Login Failed: ${action.payload}`,
            duration: 3000,
            type: 'error',
          };
        })
        .addCase(checkAuthAsync.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(checkAuthAsync.fulfilled, (state, action) => {
          state.status = 'idle';
          state.loggedInUserToken = action.payload;
          state.userChecked = true;
        })
        .addCase(checkAuthAsync.rejected, (state, action) => {
          state.status = 'idle';
          state.userChecked = true;
        })
        .addCase(signOutAsync.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(signOutAsync.fulfilled, (state, action) => {
          state.status = 'idle';
          state.loggedInUserToken = null;
          state.popup = {
            visible: true,
            message: 'Signed out successfully!',
            duration: 3000,
            type: 'success',
          };
        })
        .addCase(signOutAsync.rejected, (state, action) => {
          state.status = 'idle';
          state.popup = {
            visible: true,
            message: `Sign out failed: ${action.payload}`,
            duration: 3000,
            type: 'error',
          };
        })
        // .addCase(refreshAccessTokenAsync.pending, (state) => {
        //   state.status = 'loading';
        // })
        // .addCase(refreshAccessTokenAsync.fulfilled, (state, action) => {
        //   state.status = 'idle';
        //   state.loggedInUserToken = action.payload; // Update the token
        //   state.popup = {
        //     visible: true,
        //     message: 'Access token refreshed successfully!',
        //     duration: 3000,
        //     type: 'success',
        //   };
        // })
        // .addCase(refreshAccessTokenAsync.rejected, (state, action) => {
        //   state.status = 'idle';
        //   state.popup = {
        //     visible: true,
        //     message: `Failed to refresh access token: ${action.payload}`,
        //     duration: 3000,
        //     type: 'error',
        //   };
        // })    
        .addCase(forgotPasswordAsync.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(forgotPasswordAsync.fulfilled, (state, action) => {
          state.status = 'idle';
          state.mailSent = true;
          state.popup = {
            visible: true,
            message: 'Password reset email sent!',
            duration: 3000,
            type: 'success',
          };
        })
        .addCase(forgotPasswordAsync.rejected, (state, action) => {
          state.status = 'idle';
          state.popup = {
            visible: true,
            message: `Failed to send reset email: ${action.payload}`,
            duration: 3000,
            type: 'error',
          };
        })
        .addCase(resetPasswordAsync.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(verifyTokenAsync.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(verifyTokenAsync.fulfilled, (state) => {
          state.status = 'success';
          state.tokenVerified = true;
        })
        .addCase(verifyTokenAsync.rejected, (state,action) => {
          state.status = 'failed';
          state.popup = {
            visible: true,
            message: `Verification Failed: ${action.payload}`,
            duration: 3000,
            type: 'error',
          };
        })
        .addCase(resetPasswordAsync.fulfilled, (state, action) => {
          state.status = 'idle';
          state.passwordReset = true;
          state.popup = {
            visible: true,
            message: 'Password has been reset successfully!',
            duration: 3000,
            type: 'success',
          };
        })
        .addCase(resetPasswordAsync.rejected, (state, action) => {
          state.status = 'idle';
          state.popup = {
            visible: true,
            message: `Password reset failed: ${action.payload}`,
            duration: 3000,
            type: 'error',
          };
        });
    },
});

export const selectLoggedInUser = (state) => state.auth.loggedInUserToken;
export const selectError = (state) => state.auth.error;
export const selectUserChecked = (state) => state.auth.userChecked;
export const selectPopup = (state) => state.auth.popup;
// export const selectMailSent = (state) => state.auth.mailSent;
// export const selectPasswordReset = (state) => state.auth.passwordReset;
// export const selectTokenVerified = (state) => state.auth.tokenVerified;

export const { showPopup, hidePopup } = authSlice.actions;

export default authSlice.reducer;