import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    fetchAllProductsApi,
    addProductApi,
    updateProductDetailsApi,
    toggleDeleteProductApi,
    updateCoverImageApi,
    updatePhotosApi,
    toggleProductStatusApi,
    updatePriceApi
} from './inventoryApi';

const initialState = {
    inventoryActiveContent: "Display",
    products: [],
    totalPages: 1,
    currentPage: 1,
    totalProducts: 1,
    activeProduct: null,
    status: 'idle',
    error: null,
    popup: {
        visible: false,
        message: '',
        duration: 3000,
        type: 'success',
    },
};

export const fetchAllProducts = createAsyncThunk(
    "inventory/fetchAllProducts",
    async ({ page = 1, limit = 5, sort, order, search, isDeleted, category, status }, { rejectWithValue }) => {
        try {
            const response = await fetchAllProductsApi({ page, limit, sort, order, search, isDeleted, category, status });
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const addProduct = createAsyncThunk(
    "inventory/addProduct",
    async (formData, { rejectWithValue }) => {
      try {
        const response = await addProductApi(formData);
        return response.data;
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  );

export const updateProductDetails = createAsyncThunk(
    "inventory/updateProductDetails",
    async ({ productId, updatedData }, { rejectWithValue }) => {
        try {
            const response = await updateProductDetailsApi(productId, updatedData);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updatePrice = createAsyncThunk(
    "inventory/updatePrice",
    async ({ productId, newPrice }, { rejectWithValue }) => {
        try {
            const response = await updatePriceApi(productId, newPrice);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateCoverImage = createAsyncThunk(
    "inventory/updateCoverImage",
    async ({ productId, formData }, { rejectWithValue }) => {
        try {
            const response = await updateCoverImageApi({productId, formData});
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updatePhotos = createAsyncThunk(
    "inventory/updatePhotos",
    async ({ productId, formData }, { rejectWithValue }) => {
        try {
            const response = await updatePhotosApi({productId, formData});
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const toggleProductStatus = createAsyncThunk(
    "inventory/toggleProductStatus",
    async (productId, { rejectWithValue }) => {
        try {
            const response = await toggleProductStatusApi(productId);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const toggleDeleteProduct = createAsyncThunk(
    "inventory/toggleDeleteProduct",
    async (productId, { rejectWithValue }) => {
        try {
            const response = await toggleDeleteProductApi(productId);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const inventorySlice = createSlice({
    name: "inventory",
    initialState,
    reducers: {
        setInventoryActiveContent: (state, action) => {
            state.inventoryActiveContent = action.payload;
        },
        showPopup4: (state, action) => {
            state.popup = {
                visible: true,
                message: action.payload.message,
                duration: action.payload.duration || 3000,
                type: action.payload.type || 'success',
            };
        },
        hidePopup4: (state) => {
            state.popup = {
                visible: false,
                message: '',
                duration: 3000,
                type: 'success',
            };
        },
        setActiveProduct: (state, action) => {
            state.activeProduct = action.payload;
        },
        removeActiveProduct: (state) => {
            state.activeProduct = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products = action.payload.products;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.totalProducts = action.payload.totalProducts;
            })
            .addCase(fetchAllProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            .addCase(addProduct.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.inventoryActiveContent = "Display";
                state.products.push(action.payload);
                state.popup = {
                    visible: true,
                    message: 'Product Added Successfully!',
                    duration: 3000,
                    type: 'success',
                };
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.status = 'failed';
                state.popup = {
                    visible: true,
                    message: `Failed to Add Product: ${action.payload}`,
                    duration: 3000,
                    type: 'error',
                };
            })

            .addCase(updateProductDetails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateProductDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.popup = {
                    visible: true,
                    message: 'Product Updated Successfully!',
                    duration: 3000,
                    type: 'success',
                };
            })
            .addCase(updateProductDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.popup = {
                    visible: true,
                    message: `Failed to Update Product: ${action.payload}`,
                    duration: 3000,
                    type: 'error',
                };
            })

            .addCase(updatePrice.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updatePrice.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.popup = {
                    visible: true,
                    message: 'Product Updated Successfully!',
                    duration: 3000,
                    type: 'success',
                };
            })
            .addCase(updatePrice.rejected, (state, action) => {
                state.status = 'failed';
                state.popup = {
                    visible: true,
                    message: `Failed to Update Product: ${action.payload}`,
                    duration: 3000,
                    type: 'error',
                };
            })

            .addCase(updateCoverImage.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateCoverImage.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.popup = {
                    visible: true,
                    message: 'Cover Image Updated Successfully!',
                    duration: 3000,
                    type: 'success',
                };
            })
            .addCase(updateCoverImage.rejected, (state, action) => {
                state.status = 'failed';
                state.popup = {
                    visible: true,
                    message: `Failed to Update Cover Image: ${action.payload}`,
                    duration: 3000,
                    type: 'error',
                };
            })

            .addCase(updatePhotos.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updatePhotos.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.popup = {
                    visible: true,
                    message: 'Product Updated Successfully!',
                    duration: 3000,
                    type: 'success',
                };
            })
            .addCase(updatePhotos.rejected, (state, action) => {
                state.status = 'failed';
                state.popup = {
                    visible: true,
                    message: `Failed to Update Product: ${action.payload}`,
                    duration: 3000,
                    type: 'error',
                };
            })

            .addCase(toggleProductStatus.fulfilled, (state) => {
                state.status = 'succeeded';
                if (state.inventoryActiveContent == "EditProduct") {
                    state.inventoryActiveContent = "Display";
                }
            })
            .addCase(toggleProductStatus.rejected, (state, action) => {
                state.status = 'failed';
                state.popup = {
                    visible: true,
                    message: action.payload,
                    duration: 3000,
                    type: 'error',
                };
            })

            .addCase(toggleDeleteProduct.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(toggleDeleteProduct.rejected, (state, action) => {
                state.status = 'failed';
                state.popup = {
                    visible: true,
                    message: action.payload,
                    duration: 3000,
                    type: 'error',
                };
            });
    }
});

export const selectAllProducts = (state) => state.inventory;
export const selectActiveProduct = (state) => state.inventory.activeProduct;
export const selectStatus3 = (state) => state.inventory.status;
export const selectPopup4 = (state) => state.inventory.popup;
export const selectInventoryActiveContent = (state) => state.inventory.inventoryActiveContent;
export const { setInventoryActiveContent, showPopup4, hidePopup4, setActiveProduct, removeActiveProduct } = inventorySlice.actions;

export default inventorySlice.reducer;
