import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
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
  googleAuthApi,
} from './authApi';
import type {
  createUserData,
  LoginInfo,
  ResetPasswordData,
  sendOtpData,
  verifyOtpData,
  PopupState
} from './authTypes';
import type { RootState } from '../../app/store'; // Adjust path as per your store setup


interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface TokenResponseWithTokens {
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

interface TokenResponseWithoutTokens {
  data: User;
}

type AuthResponse = TokenResponseWithTokens | TokenResponseWithoutTokens;

interface AuthState {
  loggedInUser: AuthResponse | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  userChecked: boolean;
  popup: PopupState;
  mailSent?: boolean;
  tokenVerified?: boolean;
  passwordReset?: boolean;
}

const initialState: AuthState = {
  loggedInUser: null,
  status: 'idle',
  error: null,
  userChecked: false,
  popup: {
    visible: false,
    message: '',
    duration: 3000,
    type: 'success',
  },
};

// Async Thunks
export const sendOtpAsync = createAsyncThunk(
  'users/sendOtp',
  async (data: sendOtpData, { rejectWithValue }) => {
    try {
      const response = await sendOtp(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyOtpAsync = createAsyncThunk(
  'auth/verifyOtp',
  async (data: verifyOtpData, { rejectWithValue }) => {
    try {
      const response = await verifyOtp(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createUserAsync = createAsyncThunk(
  'user/createUser',
  async (data: createUserData, { rejectWithValue }) => {
    try {
      const response = await createUser(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginUserAsync = createAsyncThunk(
  'user/loginUser',
  async (loginInfo: LoginInfo, { rejectWithValue }) => {
    try {
      const response = await loginUser(loginInfo);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const googleAuthAsync = createAsyncThunk(
  'user/googleAuth',
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await googleAuthApi(code);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkAuthAsync = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await checkAuth();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const signOutAsync = createAsyncThunk(
  'user/signOut',
  async () => {
    const response = await signOut();
    return response.data;
  }
);

export const forgotPasswordAsync = createAsyncThunk(
  'user/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await forgotPassword(email);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyTokenAsync = createAsyncThunk(
  'user/verifyToken',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await verifyToken(token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const resetPasswordAsync = createAsyncThunk(
  'user/resetPassword',
  async ({ token, newPassword }: ResetPasswordData, { rejectWithValue }) => {
    try {
      const response = await resetPassword({ token, newPassword });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
export const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    showPopup: (
      state,
      action: PayloadAction<{ message: string; duration?: number; type?: 'success' | 'error' }>
    ) => {
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
        state.status = 'loading';
        state.error = null;
      })
      .addCase(sendOtpAsync.fulfilled, (state) => {
        state.status = 'succeeded';
        state.popup = {
          visible: true,
          message: 'OTP Sent Successfully!',
          duration: 3000,
          type: 'success',
        };
      })
      .addCase(sendOtpAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.popup = {
          visible: true,
          message: `Error Sending OTP: ${action.payload}`,
          duration: 3000,
          type: 'error',
        };
      })
      .addCase(verifyOtpAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyOtpAsync.fulfilled, (state) => {
        state.status = 'succeeded';
        state.popup = {
          visible: true,
          message: 'Email Verified Successfully!',
          duration: 3000,
          type: 'success',
        };
      })
      .addCase(verifyOtpAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
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
      .addCase(createUserAsync.fulfilled, (state) => {
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
        state.loggedInUser = action.payload.data;
        state.popup = {
          visible: true,
          message: 'Login Successful!',
          duration: 3000,
          type: 'success',
        };
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload as string;
        state.popup = {
          visible: true,
          message: `Login Failed: ${action.payload}`,
          duration: 3000,
          type: 'error',
        };
      })
      .addCase(googleAuthAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(googleAuthAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUser = action.payload.data;
        state.popup = {
          visible: true,
          message: 'Google Login Successful!',
          duration: 3000,
          type: 'success',
        };
      })
      .addCase(googleAuthAsync.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload as string;
        state.popup = {
          visible: true,
          message: `Google Login Failed: ${action.payload}`,
          duration: 3000,
          type: 'error',
        };
      })
      .addCase(checkAuthAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUser = action.payload;
        state.userChecked = true;
      })
      .addCase(checkAuthAsync.rejected, (state,action) => {
        state.status = 'idle';
        state.error = action.payload as string;
        state.userChecked = true;
      })
      .addCase(signOutAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signOutAsync.fulfilled, (state) => {
        state.status = 'idle';
        state.loggedInUser = null;
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
      .addCase(forgotPasswordAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(forgotPasswordAsync.fulfilled, (state) => {
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
      .addCase(verifyTokenAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(verifyTokenAsync.fulfilled, (state) => {
        state.status = 'succeeded';
        state.tokenVerified = true;
      })
      .addCase(verifyTokenAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.popup = {
          visible: true,
          message: `Verification Failed: ${action.payload}`,
          duration: 3000,
          type: 'error',
        };
      })
      .addCase(resetPasswordAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(resetPasswordAsync.fulfilled, (state) => {
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

// Selectors
export const selectLoggedInUser = (state: RootState) => state.auth.loggedInUser;
export const selectError = (state: RootState) => state.auth.error;
export const selectUserChecked = (state: RootState) => state.auth.userChecked;
export const selectPopup = (state: RootState) => state.auth.popup;
export const selectStatus = (state: RootState) => state.auth.status;

// Export Actions & Reducer
export const { showPopup, hidePopup } = authSlice.actions;
export default authSlice.reducer;
