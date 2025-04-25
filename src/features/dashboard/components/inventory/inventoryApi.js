import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.BACKEND_URL + '/api/v1', 
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("API Error:", error.response?.data?.message || error.message);
      return Promise.reject(error);
    }
  );

// Fetch all products
export async function fetchAllProductsApi({page = 1, limit, sort, order, search, isDeleted, category, status}) {
    try {
      const response = await axiosInstance.get(`/products?page=${page}&limit=${limit}&sort=${sort}&order=${order}&search=${search}&isDeleted=${isDeleted}&category=${category}&status=${status}`);
      return response.data?.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch Products";
    }
}

export async function addProductApi(formData) {
  try {
    console.log('Sending FormData:', [...formData.entries()]);
    const response = await axiosInstance.post("/products/addProduct", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to add Product";
  }
}
export async function getAllCategories() {
    try {
      const response = await axiosInstance.get("/products/categories");
      return response.data?.data;
      
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch Categories";
    }
  }

export async function getAllSuppliers() {
    try {
      const response = await axiosInstance.get("/products/suppliers");
      return response.data?.data;
      
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch Suppliers";
    }
  }
  
// Update product details
export async function updateProductDetailsApi(productId, updatedData) {
    try {
      const response = await axiosInstance.put(`/products/${productId}`, updatedData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to update Product details";
    }
}

export async function updatePriceApi(productId, newPrice) {
  try {
    console.log(newPrice,newPrice.type);
    
    const response = await axiosInstance.put(`/products/price/${productId}`, {newPrice: Number(newPrice)});
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update Product details";
  }
}

//Update Cover Image
export async function updateCoverImageApi({productId, formData}) {
    try {
      const response = await axiosInstance.put(`/products/coverImg/${productId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to update Product details";
    }
}

//Update Photos
export async function updatePhotosApi({productId, formData}) {
    try {
      
      const response = await axiosInstance.put(`/products/photos/${productId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to update Product details";
    }
}

export async function toggleProductStatusApi(productId) {
  try {
    const response = await axiosInstance.put(`/products/status/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update Product details";
  }
}

//toggle delete
export async function toggleDeleteProductApi(productId) {
    try {
      const response = await axiosInstance.delete(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to update Product details";
    }
}