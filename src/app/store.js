import React from "react";
import {configureStore} from '@reduxjs/toolkit'
import authReducer from "../features/auth/authSlice.js"
import dashboardReducer from "../features/dashboard/dashboardSlice.js"
import profileReducer from "../features//dashboard/components/profile/profileSlice.js"

export const store = configureStore({
    reducer : {
        auth: authReducer,
        dashboard : dashboardReducer,
        profile: profileReducer,
    }
});