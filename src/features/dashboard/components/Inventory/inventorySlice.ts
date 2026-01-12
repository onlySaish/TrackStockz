import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
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
import type { RootState } from '../../../../app/store';
import { signOutAsync } from '../../../auth/authSlice';
import { setActiveOrganization } from '../../../organization/organizationSlice';
import type { Popup, Product, ProductFormState, ProductQueryParams } from '../../dashboardTypes';

interface inventoryState {
    inventoryActiveContent: string,
    products: Product[],
    totalPages: number,
    currentPage: number,
    totalProducts: number,
    activeProduct: Product | null,
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null,
    popup: Popup
}

const initialState: inventoryState = {
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
    async ({ page = 1, limit = 5, sort, order, search, isDeleted, category, status }: ProductQueryParams, { rejectWithValue }) => {
        try {
            const response = await fetchAllProductsApi({ page, limit, sort, order, search, isDeleted, category, status });
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

export const addProduct = createAsyncThunk(
    "inventory/addProduct",
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await addProductApi(formData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

export const updateProductDetails = createAsyncThunk(
    "inventory/updateProductDetails",
    async ({ productId, updatedData }: { productId: string, updatedData: Partial<ProductFormState> }, { rejectWithValue }) => {
        try {
            const response = await updateProductDetailsApi(productId, updatedData);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

export const updatePrice = createAsyncThunk(
    "inventory/updatePrice",
    async ({ productId, newPrice }: { productId: string, newPrice: number }, { rejectWithValue }) => {
        try {
            const response = await updatePriceApi(productId, newPrice);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

export const updateCoverImage = createAsyncThunk(
    "inventory/updateCoverImage",
    async ({ productId, formData }: { productId: string, formData: FormData }, { rejectWithValue }) => {
        try {
            const response = await updateCoverImageApi({ productId, formData });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

export const updatePhotos = createAsyncThunk(
    "inventory/updatePhotos",
    async ({ productId, formData }: { productId: string, formData: FormData }, { rejectWithValue }) => {
        try {
            const response = await updatePhotosApi({ productId, formData });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

export const toggleProductStatus = createAsyncThunk(
    "inventory/toggleProductStatus",
    async (productId: string, { rejectWithValue }) => {
        try {
            const response = await toggleProductStatusApi(productId);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

export const toggleDeleteProduct = createAsyncThunk(
    "inventory/toggleDeleteProduct",
    async (productId: string, { rejectWithValue }) => {
        try {
            const response = await toggleDeleteProductApi(productId);
            return response;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

const inventorySlice = createSlice({
    name: "inventory",
    initialState,
    reducers: {
        setInventoryActiveContent: (state, action: PayloadAction<string>) => {
            state.inventoryActiveContent = action.payload;
        },
        showPopup4: (state, action: PayloadAction<Popup>) => {
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
        setActiveProduct: (state, action: PayloadAction<Product>) => {
            state.activeProduct = action.payload;
        },
        removeActiveProduct: (state) => {
            state.activeProduct = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signOutAsync.fulfilled, (state) => {
                state.products = [];
                state.totalPages = 1;
                state.currentPage = 1;
                state.totalProducts = 0;
                state.activeProduct = null;
                state.status = 'idle';
                state.error = null;
                state.inventoryActiveContent = "Display";
            })
            .addCase(setActiveOrganization, (state) => {
                state.products = [];
                state.totalPages = 1;
                state.currentPage = 1;
                state.totalProducts = 0;
                state.activeProduct = null;
                state.status = 'idle';
                state.error = null;
            })
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
                state.error = action.payload as string;
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
            .addCase(updateProductDetails.fulfilled, (state) => {
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
            .addCase(updatePrice.fulfilled, (state) => {
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
            .addCase(updateCoverImage.fulfilled, (state) => {
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
            .addCase(updatePhotos.fulfilled, (state) => {
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
                    message: action.payload as string,
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
                    message: action.payload as string,
                    duration: 3000,
                    type: 'error',
                };
            });
    }
});

export const selectAllProducts = (state: RootState) => state.inventory;
export const selectActiveProduct = (state: RootState) => state.inventory.activeProduct;
export const selectStatus3 = (state: RootState) => state.inventory.status;
export const selectPopup4 = (state: RootState) => state.inventory.popup;
export const selectInventoryActiveContent = (state: RootState) => state.inventory.inventoryActiveContent;
export const { setInventoryActiveContent, showPopup4, hidePopup4, setActiveProduct, removeActiveProduct } = inventorySlice.actions;

export default inventorySlice.reducer;
