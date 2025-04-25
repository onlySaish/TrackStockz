import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + '/api/v1',
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

export async function fetchAllCustomersApi({page=1, limit, sort, order, search, isBlacklistActive}) {
    try {
        const response = await axiosInstance.get(`/customers/getCustomers?page=${page}&limit=${limit}&sort=${sort}&order=${order}&search=${search}&blacklist=${isBlacklistActive}`);
        return response.data?.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch Customers";
    }
}

export async function addCustomerApi({formData}) {
  try {
      const response = await axiosInstance.post("/customers/add-customer", formData);
      return response.data;
  } catch (error) {
      throw error.response?.data?.message || "Failed to add Customer";
  }
}

// Update customer details
export async function updateCustomerApi(customerId, updatedData) {
  try {
      const response = await axiosInstance.patch(`/customers/update-customer/${customerId}`, updatedData);
      return response.data;
  } catch (error) {
      throw error.response?.data?.message || "Failed to update Customer details";
  }
}

// Blacklist a customer
// export async function blacklistCustomerApi(customerId) {
//   try {
//       const response = await axiosInstance.patch(`/customers/blacklist-customer/${customerId}`);
//       return response.data;
//   } catch (error) {
//       throw error.response?.data?.message || "Failed to blacklist Customer";
//   }
// }

// // Remove a customer from blacklist
// export async function removeFromBlacklistApi(customerId) {
//   try {
//       const response = await axiosInstance.patch(`/customers/remove-from-blacklist/${customerId}`);
//       return response.data;
//   } catch (error) {
//       throw error.response?.data?.message || "Failed to remove Customer from blacklist";
//   }
// }

export async function toggleBlacklistCustomerApi(customerId) {
  try {
      const response = await axiosInstance.patch(`/customers/toggle-blacklist-customer/${customerId}`);
      return response.data;
  } catch (error) {
      throw error.response?.data?.message || "Failed to toggle Customer from blacklist";
  }
}