import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addOrderApi } from './sellApi';
import type { RootState } from '../../../../app/store';
import type { CreateOrderRequest, OrderProduct, Popup, Product } from '../../dashboardTypes';

export interface Order {
  customerId: string;
  items: OrderProduct[];
}

interface SellState {
  order: Order;
  activeProduct: Product | null; // or Product if available
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  popup: Popup;
}

const initialState: SellState = {
    order: {
      customerId: "",
      items: []
    },
    activeProduct: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    popup: {
        visible: false,
        message: '',
        duration: 3000, // Default duration
        type: 'success', // Can be 'success' or 'error'
    },
};

export const addOrder = createAsyncThunk(
  'sell/addOrder',
  async (order: CreateOrderRequest, { rejectWithValue }) => {
    try {
      const response = await addOrderApi(order);
      return response;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);

const sellSLice = createSlice({
    name: 'sell',
    initialState,
    reducers: {
        setSelectedCustomer: (state, action) => {
            state.order.customerId = action.payload;
        },
        setSelectedItem: (state, action) => {
            state.order.items = [...state.order.items, action.payload];
        },
        removeSelectedItem: (state, action) => {
          state.order.items = state.order.items.filter((product) => product.product !== action.payload);
        },
        updateOrderItems: (state,action) => {
          state.order.items = state.order.items.map((product) =>
            (product.product === action.payload.productId)
              ? { ...product, quantity: action.payload.quantity }
              : product
          );
        },
        showPopup5: (state, action) => {
            state.popup = {
                visible: true,
                message: action.payload.message,
                duration: action.payload.duration || 3000,
                type: action.payload.type || 'success',
            };
        },
        hidePopup5: (state) => {
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
      .addCase(addOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addOrder.fulfilled, (state) => {
        state.status = 'succeeded';
        state.order = {
          customerId: "",
          items: []
        };
        state.popup = {
          visible: true,
          message: 'Order Added Successfully!',
          duration: 3000,
          type: 'success',
        };
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.popup = {
          visible: true,
          message: `Failed Adding Order: ${action.payload}`,
          duration: 3000,
          type: 'error',
        };
      })
    }
})

export const selectOrder = (state: RootState) => state.sell.order;
export const selectPopup5 = (state: RootState) => state.sell.popup;
export const selectStatus4 = (state: RootState) => state.sell.status;


export const {
  setSelectedCustomer, 
  setSelectedItem, 
  removeSelectedItem, 
  updateOrderItems,
  showPopup5,
  hidePopup5,
} = sellSLice.actions;

export default sellSLice.reducer;