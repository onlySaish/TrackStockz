import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { editOrderApi, fetchAllOrdersApi, updateOrderStatusApi } from './orderApi';
import type { RootState } from '../../../../app/store';
import type { EditOrderParams, FetchOrdersParams, Order, Popup } from '../../dashboardTypes';

interface OrderItem {
  product: string;
  quantity: number;
}

interface currentOrder {
  customerId: string;
  items: OrderItem[];
}

interface OrderState {
  order: currentOrder;
  orderActiveContent: string;
  totalPages: number;
  currentPage: number;
  totalOrders: number;
  activeOrder: Order | null;
  fetchedOrders: Order[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  popup: Popup;
}

const initialState: OrderState = {
    order: {
      customerId: "",
      items: []
    },
    orderActiveContent:"DisplayOrders",
    totalPages: 1,
    currentPage: 1,
    totalOrders: 1,
    activeOrder: null,
    fetchedOrders: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    popup: {
        visible: false,
        message: '',
        duration: 3000, // Default duration
        type: 'success', // Can be 'success' or 'error'
    },
};

export const editOrder = createAsyncThunk(
  'sell/editOrder',
  async ({orderId, products, additionalDiscountPercent}: EditOrderParams, { rejectWithValue }) => {
    try {
      const response = await editOrderApi({orderId, products, additionalDiscountPercent});
      return response;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'sell/updateOrderStatus',
  async ({orderId, status}: {orderId: string, status: string}, { rejectWithValue }) => {
    try {
      const response = await updateOrderStatusApi({orderId, status});
      return response;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  "sell/fetchAllOrders",
  async ({ page = 1, limit = 5, sort, order, search, status, paymentMethod }: FetchOrdersParams, { rejectWithValue }) => {
    try {
        const response = await fetchAllOrdersApi({ page, limit, sort, order, search, status, paymentMethod });
        return response;
    } catch (error: any) {
        return rejectWithValue(error);
    }
  }
);

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        // setSelectedCustomer: (state, action) => {
        //     state.order.customerId = action.payload;
        // },
        // setSelectedItem: (state, action) => {
        //     state.order.items = [...state.order.items, action.payload];
        // },
        // removeSelectedItem: (state, action) => {
        //   state.order.items = state.order.items.filter((product) => product.product !== action.payload);
        // },
        // updateOrderItems: (state,action) => {
        //   state.order.items = state.order.items.map((product) =>
        //     (product.product === action.payload.productId)
        //       ? { ...product, quantity: action.payload.quantity }
        //       : product
        //   );
        // },
        showPopup6: (state, action: PayloadAction<Popup>) => {
            state.popup = {
                visible: true,
                message: action.payload.message,
                duration: action.payload.duration || 3000,
                type: action.payload.type || 'success',
            };
        },
        hidePopup6: (state) => {
          state.popup = {
              visible: false,
              message: '',
              duration: 3000,
              type: 'success',
          };
      },

      setActiveOrder: (state, action: PayloadAction<Order>) => {
        state.activeOrder = action.payload;
      },
      removeActiveOrder: (state) => {
          state.activeOrder = null;
      },
      setOrderActiveContent: (state, action: PayloadAction<string>) => {
        state.orderActiveContent = action.payload;
    },
    },
    extraReducers: (builder) => {
      builder
      .addCase(fetchAllOrders.pending, (state) => {
          state.status = 'loading';
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.fetchedOrders = action.payload.orders;
          state.totalPages = action.payload.totalPages;
          state.currentPage = action.payload.currentPage;
          state.totalOrders = action.payload.totalOrders;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload as string;
      })

      .addCase(editOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(editOrder.fulfilled, (state) => {
        state.status = 'succeeded';
        state.popup = {
          visible: true,
          message: 'Order Updated Successfully!',
          duration: 3000,
          type: 'success',
        };
      })
      .addCase(editOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.popup = {
          visible: true,
          message: `Failed Updating Order: ${action.payload}`,
          duration: 3000,
          type: 'error',
        };
      })
      .addCase(updateOrderStatus.fulfilled, (state) => {
        // const { orderId, status } = action.payload;
        // const order = state.fetchedOrders.find(order => order._id === orderId);
        // if (order) {
        //   order.status = status;
        // }
        state.popup = {
          visible: true,
          message: 'Order Updated Successfully!',
          duration: 3000,
          type: 'success',
        };
      });
    }
})


export const selectAllOrders = (state: RootState) => state.order;
export const selectActiveOrder = (state: RootState) => state.order.activeOrder;
export const selectOrderActiveContent = (state: RootState) => state.order.orderActiveContent;
export const selectPopup6 = (state: RootState) => state.order.popup;
export const selectStatus5 = (state: RootState) => state.order.status;

export const {
  showPopup6,
  hidePopup6,
  setActiveOrder,
  removeActiveOrder,
  setOrderActiveContent
} = orderSlice.actions;

export default orderSlice.reducer;
