import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import profileReducer from '../features/dashboard/components/Profile/profileSlice';
import customerReducer from '../features/dashboard/components/Customer/customerSlice';
import inventoryReducer from '../features/dashboard/components/Inventory/inventorySlice';
import sellReducer from '../features/dashboard/components/Sell/sellSlice';
import orderReducer from '../features/dashboard/components/Order/orderSlice';
import homeReducer from '../features/dashboard/components/Home/homeSlice';
import organizationReducer from '../features/organization/organizationSlice';

// Configure the store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    profile: profileReducer,
    customer: customerReducer,
    inventory: inventoryReducer,
    sell: sellReducer,
    order: orderReducer,
    home: homeReducer,
    organization: organizationReducer,
  },
});

// Types for use throughout the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
