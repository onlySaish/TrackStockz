import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { updateProfileApi, updateAvatarApi, currentProfileApi, updatePasswordApi } from '../profile/profileApi';

const initialState = {
  // isEditing: false, // Determines whether to show the EditProfileCard
  profileActiveContent : "Profile",
  user: {
    _id: null,
    avatar: '',
    username: '',
    fullName: '',
    email: '',
  },
  // user: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  popup: {
    visible: false,
    message: '',
    duration: 3000, // Default duration
    type: 'success', // Can be 'success' or 'error'
  },
};

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile", 
  async (_, { rejectWithValue }) => {
  try {
    const response = await currentProfileApi();
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

// AsyncThunk for updating profile details
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await updateProfileApi(profileData);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// AsyncThunk for updating avatar
export const updateAvatar = createAsyncThunk(
  'profile/updateAvatar',
  async (avatarFile, { rejectWithValue }) => {
    try {
      const response = await updateAvatarApi(avatarFile);
      return response; // Assuming the API returns an updated user object
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updatePassword = createAsyncThunk(
  'profile/updatePassword',
  async ({oldPassword, newPassword}, { rejectWithValue }) => {
    try {
      const response = await updatePasswordApi({oldPassword, newPassword});
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // toggleEditProfile: (state) => {
    //   state.isEditing = !state.isEditing;
    // },
    setProfileActiveContent: (state, action) => {
      state.profileActiveContent = action.payload; // Update active content
    },
    hidePopup2: (state) => {
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
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = { ...state.profile, ...action.payload };
        // state.isEditing = false; // Go back to ProfileCard after editing
        state.profileActiveContent = "Profile";
        state.popup = {
          visible: true,
          message: 'Profile Updated successfully!',
          duration: 3000,
          type: 'success',
        };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.popup = {
          visible: true,
          message: `Failed Updating Profile: ${action.payload}`,
          duration: 3000,
          type: 'error',
        };
      })
      .addCase(updateAvatar.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user.avatar = action.payload.avatar;
        state.popup = {
          visible: true,
          message: 'Avatar Updated successfully!',
          duration: 3000,
          type: 'success',
        };
      })
      .addCase(updateAvatar.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.popup = {
          visible: true,
          message: `Failed Updating Avatar: ${action.payload}`,
          duration: 3000,
          type: 'error',
        };
      })
      .addCase(updatePassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // state.user = { ...state.profile, ...action.payload };
        // state.isEditing = false; // Go back to ProfileCard after editing
        state.profileActiveContent = "Profile";
        state.popup = {
          visible: true,
          message: 'Password Changed Successfully!',
          duration: 3000,
          type: 'success',
        };
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.popup = {
          visible: true,
          message: `Failed Updating Password: ${action.payload}`,
          duration: 3000,
          type: 'error',
        };
      })
  },
});

export const { toggleEditProfile } = profileSlice.actions;
export const profileSelector = (state) => state.profile.user;
// export const selectIsEditable = (state) => state.profile;
export const selectPopup2 = (state) => state.profile.popup;
export const selectProfileActiveContent = (state) => state.profile.profileActiveContent;
export const { hidePopup2, setProfileActiveContent } = profileSlice.actions;

export default profileSlice.reducer;
