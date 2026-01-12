import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { OrganizationState, CreateOrganizationRequest } from './organizationTypes';
import { createOrganizationApi, fetchUserOrganizationsApi, joinOrganizationApi, fetchOrganizationMembersApi, removeMemberApi } from './organizationApi';
import type { RootState } from '../../app/store';

const initialState: OrganizationState = {
  organizations: [],
  activeOrganizationId: localStorage.getItem('activeOrganizationId') || null,
  activeOrganizationMembers: [],
  status: 'idle',
  error: null,
};

export const fetchUserOrganizations = createAsyncThunk(
  'organization/fetchUserOrganizations',
  async () => {
    return await fetchUserOrganizationsApi();
  }
);

export const createOrganization = createAsyncThunk(
  'organization/createOrganization',
  async (data: CreateOrganizationRequest) => {
    return await createOrganizationApi(data);
  }
);

export const joinOrganization = createAsyncThunk(
  'organization/joinOrganization',
  async (inviteCode: string) => {
    return await joinOrganizationApi(inviteCode);
  }
);

import { signOutAsync } from '../auth/authSlice';

// ... (existing thunks)

export const fetchOrganizationMembers = createAsyncThunk(
  'organization/fetchOrganizationMembers',
  async (organizationId: string, { rejectWithValue }) => {
    try {
      return await fetchOrganizationMembersApi(organizationId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch members');
    }
  }
);

export const removeMember = createAsyncThunk(
  'organization/removeMember',
  async ({ organizationId, memberId }: { organizationId: string, memberId: string }, { rejectWithValue }) => {
    try {
      await removeMemberApi(organizationId, memberId);
      return memberId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove member');
    }
  }
);

export const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    setActiveOrganization: (state, action: PayloadAction<string>) => {
      state.activeOrganizationId = action.payload;
    },
    clearActiveOrganization: (state) => {
      state.activeOrganizationId = null;
      state.activeOrganizationMembers = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signOutAsync.fulfilled, (state) => {
        state.organizations = [];
        state.activeOrganizationId = null;
        state.activeOrganizationMembers = [];
        state.status = 'idle';
        state.error = null;
      })
      .addCase(fetchUserOrganizations.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserOrganizations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.organizations = action.payload;
        // If no active org selected and we have orgs, select the first one
        if (!state.activeOrganizationId && action.payload.length > 0) {
          state.activeOrganizationId = action.payload[0]._id;
        }
        // Verify if active org is still in list
        if (state.activeOrganizationId && !action.payload.find(o => o._id === state.activeOrganizationId)) {
          if (action.payload.length > 0) {
            state.activeOrganizationId = action.payload[0]._id;
          } else {
            state.activeOrganizationId = null;
          }
        }
      })
      .addCase(fetchUserOrganizations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch organizations';
      })
      .addCase(createOrganization.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createOrganization.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.organizations.push(action.payload);
        state.activeOrganizationId = action.payload._id;
      })
      .addCase(createOrganization.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to create organization';
      })
      .addCase(joinOrganization.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(joinOrganization.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.organizations.push(action.payload);
        state.activeOrganizationId = action.payload._id;
      })
      .addCase(joinOrganization.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to join organization';
      })
      // Fetch Members
      .addCase(fetchOrganizationMembers.pending, (state) => {
        // state.status = 'loading'; // Don't block whole UI for member fetch
      })
      .addCase(fetchOrganizationMembers.fulfilled, (state, action) => {
        state.activeOrganizationMembers = action.payload;
      })
      .addCase(fetchOrganizationMembers.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Remove Member
      .addCase(removeMember.fulfilled, (state, action) => {
        // Remove member from list
        state.activeOrganizationMembers = state.activeOrganizationMembers.filter(m => m.user._id !== action.payload);
      });
  },
});

export const { setActiveOrganization, clearActiveOrganization } = organizationSlice.actions;

export const selectOrganizations = (state: RootState) => state.organization.organizations;
export const selectActiveOrganizationId = (state: RootState) => state.organization.activeOrganizationId;
export const selectActiveOrganizationMembers = (state: RootState) => state.organization.activeOrganizationMembers;
export const selectOrganizationStatus = (state: RootState) => state.organization.status;
export const selectActiveOrganization = (state: RootState) =>
  state.organization.organizations.find(o => o._id === state.organization.activeOrganizationId);

export default organizationSlice.reducer;
