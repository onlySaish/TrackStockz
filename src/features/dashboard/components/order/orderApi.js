import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api/v1', // Backend API base URL
  withCredentials: true, // Include cookies in requests
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

export async function fetchAllOrdersApi({page = 1, limit, sort, order, search, status, paymentMethod}) {
    try {
      const response = await axiosInstance.get(`/orders?page=${page}&limit=${limit}&sort=${sort}&order=${order}&search=${search}&status=${status}&paymentMethod=${paymentMethod}`);
      return response.data?.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch Products";
    }
}

export async function editOrderApi({orderId, products, additionalDiscountPercent}){
  try {
    const response = await axiosInstance.patch(`/orders/${orderId}`, {products, additionalDiscountPercent});
    return response.data;
    console.log(response.data);
    
  } catch (error) {
    throw error.response?.data?.message || "Failed to Update Order";
  }
};

export async function updateOrderStatusApi({orderId, status}){
  try {
    const response = await axiosInstance.put(`/orders/${orderId}`, {status});
    return response.data;
    
  } catch (error) {
    throw error.response?.data?.message || "Failed to Update Order";
  }
};
