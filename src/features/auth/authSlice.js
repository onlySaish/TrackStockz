import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  createUser,
  loginUser,
  checkAuth,
  signOut
} from './authApi';

const initialState = {
    loggedInUserToken: null,
    status: 'idle',
    error: null,
    userChecked: false,
    mailSent: false,
    passwordReset:false,
    popup: {
      visible: false,
      message: '',
      duration: 3000, // Default duration
      type: 'success', // Can be 'success' or 'error'
    },
};

export const createUserAsync = createAsyncThunk(
  'user/createUser',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await createUser(formData);
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
    console.log(error);
  }
});

export const signOutAsync = createAsyncThunk(
  'user/signOut',
  async () => {
    const response = await signOut();
    return response.data;
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
        });  
    },
});

export const selectLoggedInUser = (state) => state.auth.loggedInUserToken;
export const selectError = (state) => state.auth.error;
export const selectUserChecked = (state) => state.auth.userChecked;
export const selectMailSent = (state) => state.auth.mailSent;
export const selectPasswordReset = (state) => state.auth.passwordReset;
export const selectPopup = (state) => state.auth.popup;
export const { showPopup, hidePopup } = authSlice.actions;

export default authSlice.reducer;