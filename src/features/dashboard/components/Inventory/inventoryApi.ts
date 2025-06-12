import axios, { AxiosError } from 'axios';
import type { AddProductResponse, AddProductResponseData, FetchProductsResponse, ProductFormState, ProductQueryParams } from '../../dashboardTypes';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + '/api/v1',
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string }>) => {
      console.error("API Error:", error.response?.data?.message || error.message);
      return Promise.reject(error);
    }
  );

// Fetch all products
export async function fetchAllProductsApi({
  page = 1,
  limit,
  sort,
  order,
  search,
  isDeleted,
  category,
  status,
}: ProductQueryParams): Promise<FetchProductsResponse> {
  try {
    const response = await axiosInstance.get<{ data: FetchProductsResponse }>(
      `/products?page=${page}&limit=${limit}&sort=${sort}&order=${order}&search=${search}&isDeleted=${isDeleted}&category=${category}&status=${status}`
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to fetch Products";
  }
}

export async function addProductApi(formData: FormData): Promise<AddProductResponse> {
  try {
    const response = await axiosInstance.post<AddProductResponse>("/products/addProduct", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to add Product";
  }
}

export async function getAllCategories(): Promise<string[]> {
    try {
      const response = await axiosInstance.get<{data: string[]}>("/products/categories");
      return response.data?.data;
      
    } catch (error: any) {
      throw error.response?.data?.message || "Failed to fetch Categories";
    }
}

export async function getAllSuppliers(): Promise<string[]> {
    try {
      const response = await axiosInstance.get<{data: string[]}>("/products/suppliers");
      return response.data?.data;
      
    } catch (error: any) {
      throw error.response?.data?.message || "Failed to fetch Suppliers";
    }
  }
  
// Update product details
export async function updateProductDetailsApi(productId: string, updatedData: Partial<ProductFormState>): Promise<AddProductResponseData> {
    try {
      const response = await axiosInstance.put<{data: AddProductResponseData}>(`/products/${productId}`, updatedData);
      return response.data.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Failed to update Product details";
    }
}

export async function updatePriceApi(productId: string, newPrice: number): Promise<AddProductResponse> {
  try {
    const response = await axiosInstance.put<AddProductResponse>(`/products/price/${productId}`, {newPrice: Number(newPrice)});
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to update Product details";
  }
}

//Update Cover Image
export async function updateCoverImageApi({productId, formData}: {productId: string, formData: FormData}): Promise<AddProductResponse> {
    try {
      const response = await axiosInstance.put<AddProductResponse>(`/products/coverImg/${productId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Failed to update Product details";
    }
}

//Update Photos
export async function updatePhotosApi({productId, formData}: {productId: string, formData: FormData}): Promise<AddProductResponse> {
    try {
      
      const response = await axiosInstance.put<AddProductResponse>(`/products/photos/${productId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Failed to update Product details";
    }
}

export async function toggleProductStatusApi(productId: string): Promise<AddProductResponse> {
  try {
    const response = await axiosInstance.put<AddProductResponse>(`/products/status/${productId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to update Product details";
  }
}

//toggle delete
export async function toggleDeleteProductApi(productId: string): Promise<AddProductResponse> {
    try {
      const response = await axiosInstance.delete<AddProductResponse>(`/products/${productId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Failed to update Product details";
    }
}