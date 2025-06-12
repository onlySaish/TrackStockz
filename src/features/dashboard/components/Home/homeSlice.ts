import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDashboardDataApi } from './homeApi';
import type { RootState } from '../../../../app/store';
import type { DashboardStats, RecentOrder } from '../../dashboardTypes';

interface HomeState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  stats: DashboardStats | null;
  recentOrders: RecentOrder[];
  error: string | null;
}

const initialState: HomeState = {
    status: "idle",
    stats: null,
    recentOrders: [],
    error: null
}

export const fetchDashboardData = createAsyncThunk(
    "home/fetchDashboardData",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchDashboardDataApi();
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const homeSlice = createSlice({
    name: "home",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.stats = action.payload.stats;
                state.recentOrders = action.payload.recentOrders;
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message as string;
            });
    }
});

export const selectHome = (state: RootState) => state.home;

export default homeSlice.reducer;
