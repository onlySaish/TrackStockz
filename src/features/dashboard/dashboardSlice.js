import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isSidebarVisible: true,
    activeContent: 'Home',
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarVisible = !state.isSidebarVisible;
    },
    setActiveContent: (state, action) => {
      state.activeContent = action.payload; // Update active content
    },
  },
});

export const { toggleSidebar, setActiveContent } = dashboardSlice.actions;

export const selectSidebarVisibility = (state) => state.dashboard.isSidebarVisible;
export const selectActiveContent = (state) => state.dashboard.activeContent;

export default dashboardSlice.reducer;
