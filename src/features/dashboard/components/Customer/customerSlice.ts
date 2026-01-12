import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { addCustomerApi, fetchAllCustomersApi, toggleBlacklistCustomerApi, updateCustomerApi } from './customerApi';
import type { RootState } from '../../../../app/store';
import type { Customer, CustomerFormData, FetchCustomersParams, Popup } from '../../dashboardTypes';
import { signOutAsync } from '../../../auth/authSlice';
import { setActiveOrganization } from '../../../organization/organizationSlice';


interface CustomerState {
  customerActiveContent: string;
  customers: Customer[];
  totalPages: number;
  currentPage: number;
  totalCustomers: number;
  activeCustomer: Customer | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  popup: Popup;
}

const initialState: CustomerState = {
  customerActiveContent: "Display",
  customers: [],    //Array of objects of customers
  totalPages: 1,
  currentPage: 1,
  totalCustomers: 1,
  activeCustomer: null,
  status: 'idle',
  error: null,
  popup: {
    visible: false,
    message: '',
    duration: 3000, // Default duration
    type: 'success', // Can be 'success' or 'error'
  },
}

export const fetchAllCustomers = createAsyncThunk(
  "customer/fetchAllCustomers",
  async ({ page = 1, limit = 5, sort, order, search, isBlacklistActive }: FetchCustomersParams, { rejectWithValue }) => {
    try {
      const response = await fetchAllCustomersApi({ page: page, limit: limit, sort: sort, order: order, search: search, isBlacklistActive: isBlacklistActive });
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  });

export const addCustomer = createAsyncThunk(
  "customer/addCustomer",
  async ({ formData }: { formData: CustomerFormData }, { rejectWithValue }) => {
    try {
      const response = await addCustomerApi(formData);

      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  });

export const updateCustomer = createAsyncThunk(
  "customer/updateCustomer",
  async ({ customerId, updatedData }: { customerId: string, updatedData: Partial<CustomerFormData> }, { rejectWithValue }) => {
    try {
      const response = await updateCustomerApi(customerId, updatedData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  });

export const toggleBlackListCustomer = createAsyncThunk(
  "customer/blackListCustomer",
  async (customerId: string, { rejectWithValue }) => {
    try {
      const response = await toggleBlacklistCustomerApi(customerId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  });

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomerActiveContent: (state, action: PayloadAction<string>) => {
      state.customerActiveContent = action.payload; // Update active content
    },
    showPopup3: (state, action: PayloadAction<Popup>) => {
      state.popup = {
        visible: true,
        message: action.payload.message,
        duration: action.payload.duration || 3000,
        type: action.payload.type || 'success',
      };
    },
    hidePopup3: (state) => {
      state.popup = {
        visible: false,
        message: '',
        duration: 3000,
        type: 'success',
      };
    },
    setActiveCustomer: (state, action: PayloadAction<Customer>) => {
      state.activeCustomer = action.payload;
    },
    removeActiveCustomer: (state) => {
      state.activeCustomer = null;
    }
  },



  extraReducers: (builder) => {
    builder
      .addCase(signOutAsync.fulfilled, (state) => {
        state.customers = [];
        state.totalPages = 1;
        state.currentPage = 1;
        state.totalCustomers = 0;
        state.activeCustomer = null;
        state.status = 'idle';
        state.error = null;
        state.customerActiveContent = "Display";
      })
      .addCase(setActiveOrganization, (state) => {
        state.customers = [];
        state.totalPages = 1;
        state.currentPage = 1;
        state.totalCustomers = 0;
        state.activeCustomer = null;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(fetchAllCustomers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllCustomers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.customers = action.payload.customers;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalCustomers = action.payload.totalCustomers;
      })
      .addCase(fetchAllCustomers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Add Customer
      .addCase(addCustomer.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addCustomer.fulfilled, (state) => {   //if needed: action: PayloadAction<AddCustomerResponse>
        state.status = "succeeded";
        // state.customers.push(action.payload.data);
        state.customerActiveContent = "Display",
          state.popup = {
            visible: true,
            message: 'Customer Added Successfully!',
            duration: 3000,
            type: 'success',
          };
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.popup = {
          visible: true,
          message: `Failed to Add Customer: ${action.payload}`,
          duration: 3000,
          type: 'error',
        };
      })

      // Update Customer
      .addCase(updateCustomer.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCustomer.fulfilled, (state) => { //if needed: action: PayloadAction<AddCustomerResponse>
        state.status = "succeeded";
        // const index = state.customers.findIndex(
        //   (customer) => customer._id === action.payload.data._id
        // );
        // if (index !== -1) {
        //   state.customers[index] = action.payload.data;
        // }
        state.customerActiveContent = "Display",
          state.popup = {
            visible: true,
            message: 'Customer Updated Successfully!',
            duration: 3000,
            type: 'success',
          };
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.popup = {
          visible: true,
          message: `Failed to Update Customer: ${action.payload}`,
          duration: 3000,
          type: 'error',
        };
      })

      // Toggle Blacklist Customer
      .addCase(toggleBlackListCustomer.pending, (state) => {
        state.status = "loading";
      })
      .addCase(toggleBlackListCustomer.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(toggleBlackListCustomer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.popup = {
          visible: true,
          message: action.payload as string,
          duration: 3000,
          type: 'error',
        };
      })
  }
})

export const selectAllCustomers = (state: RootState) => state.customer;
export const selectActiveCustomer = (state: RootState) => state.customer.activeCustomer;
export const selectStatus2 = (state: RootState) => state.customer.status;
export const selectPopup3 = (state: RootState) => state.customer.popup;
export const selectCustomerActiveContent = (state: RootState) => state.customer.customerActiveContent;
export const { setCustomerActiveContent, showPopup3, hidePopup3, setActiveCustomer, removeActiveCustomer } = customerSlice.actions;

export default customerSlice.reducer;