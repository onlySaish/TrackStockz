import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

interface DashboardState {
    isSidebarVisible: boolean;
    activeContent: string; // New property to track active content
}

const initialState: DashboardState = {
    isSidebarVisible: false,
    activeContent: 'Home',
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarVisible = !state.isSidebarVisible;
    },
    setActiveContent: (state, action: PayloadAction<string>) => {
      state.activeContent = action.payload; // Update active content
    },
  },
});

export const { toggleSidebar, setActiveContent } = dashboardSlice.actions;

export const selectSidebarVisibility = (state: RootState) => state.dashboard.isSidebarVisible;
export const selectActiveContent = (state: RootState) => state.dashboard.activeContent;

export default dashboardSlice.reducer;
