import React from "react";
import {configureStore} from '@reduxjs/toolkit'
import authReducer from "../features/auth/authSlice.js"
import dashboardReducer from "../features/dashboard/dashboardSlice.js"
import profileReducer from "../features//dashboard/components/profile/profileSlice.js"
import customerReducer from "../features/dashboard/components/customer/customerSlice.js"
import inventoryReducer from "../features/dashboard/components/inventory/inventorySlice.js"
import sellReducer from "../features/dashboard/components/sell/sellSlice.js"
import orderReducer from "../features/dashboard/components/order/orderSlice.js"

export const store = configureStore({
    reducer : {
        auth: authReducer,
        dashboard : dashboardReducer,
        profile: profileReducer,
        customer: customerReducer,
        inventory: inventoryReducer,
        sell: sellReducer,
        order: orderReducer
    }
});