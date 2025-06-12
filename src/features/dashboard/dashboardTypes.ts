//Profile
export interface UserProfile {
  _id: string | null;
  avatar: string;
  username: string;
  fullName: string;
  email: string;
}

export interface ProfileDataPayload {
    username: string;
    fullName: string;
    email: string;
}

export interface Popup {
  visible: boolean;
  message: string;
  duration: number;
  type: 'success' | 'error';
}

export interface ProfileState {
  profileActiveContent: string;
  user: UserProfile;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  popup: Popup;
}

export interface UpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

//Customer
// interface CustomerAddress {
//   street: string;
//   city: string;
//   state: string;
//   zipCode: string;
//   country: string;
// }

// export interface Customer {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string;
//   companyName: string;
//   address: CustomerAddress;
// }

export interface CustomerAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: CustomerAddress;
  companyName: string;
  blackListed: boolean;
  createdAt: string;
  updatedAt: string;
  owner: string;
  __v: number;
}

export interface FetchCustomersParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  isBlacklistActive?: boolean;
}

export interface FetchCustomersResponse {
  customers: Customer[];
  totalCustomers: number;
  totalPages: number;
  currentPage: number;
}

export interface AddCustomerResponse {
  message: string;
  statusCode: number;
  success: boolean;
  data: Customer;
}

export type CustomerFormData = Omit<Customer, '_id' | 'createdAt' | 'updatedAt' | '__v' | 'owner'>;

//Product
export interface ProductQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  isDeleted?: boolean;
  category?: string;
  status?: string;
}

export interface ProductPrice {
  _id: string;
  date: string;
  price: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  coverImg: string;
  discountPercent: number;
  isDeleted: boolean;
  lowStockThreshold: number;
  photos: string[];
  price: ProductPrice[];
  quantity: number;
  status: string;
  supplier: string;
}

export interface FetchProductsResponse {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  products: Product[];
}

export interface AddProductResponseData {
  _id: string;
  name: string;
  description: string;
  category: string;
  coverImg: string;
  discountPercent: number;
  isDeleted: boolean;
  lowStockThreshold: number;
  photos: string[];
  price: ProductPrice[];
  quantity: number;
  sku: string;
  status: string;
  supplier: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AddProductResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AddProductResponseData;
}

export interface ProductFormState {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  supplier: string;
  discountPercent: number;
  coverImg: string | File | null;
  status: string;
  lowStockThreshold: number;
  photos: (File | string)[] | null;
}

//Sell
export interface OrderProduct {
  product: string;         // Product ID (string)
  quantity: number | string; // Accepts both for compatibility
}

export interface CreateOrderRequest {
  customerId: string;
  products: OrderProduct[];
  totalPrice: number;
  initialDiscountedPrice: number;
  finalDiscountedPrice: number;
  additionalDiscountPercent: number | string;
  paymentMethod: string;
}

export interface OrderProductResponse {
  _id: string;
  product: string;
  quantity: number;
  price: number;
}

export interface CreateOrderResponse {
  _id: string;
  customer: string;
  products: OrderProductResponse[];
  totalPrice: number;
  initialDiscountedPrice: number;
  finalDiscountedPrice: number;
  additionalDiscountPercent: number;
  paymentMethod: string;
  status: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface OrderApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: CreateOrderResponse;
}

export interface SelectProduct extends Product {
  selectedQuantity: number;
}

//Order
export interface OrderProductDetails {
  product: string;  
  quantity: number;
  price: number;
  _id: string;
}

export interface ProductDetails {
  _id: string; 
  name: string;
  price: ProductPrice[] | number;
  quantity: number;
  discountPercent: number;
  coverImg: string;
}

export interface Order {
  _id: string;
  products: OrderProductDetails[];
  totalPrice: number;
  initialDiscountedPrice: number;
  additionalDiscountPercent: number;
  finalDiscountedPrice: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  productDetails: ProductDetails[];
  customerDetails: Customer;
}

export interface FetchOrdersResponse {
  orders: Order[];
  totalOrders: number;
  totalPages: number;
  currentPage: number;
}

export interface FetchOrdersParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
  search?: string;
  status?: string;
  paymentMethod?: string;
}

export interface OrderResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: FetchOrdersResponse;
}

export interface EditOrderParams {
  orderId: string;
  products: { _id: string; quantity: number }[];
  additionalDiscountPercent: number;
}

//Dashboard
export interface RecentOrder {
  id: string;
  customer: string;
  totalPrice: number;
  status: 'Pending' | 'Completed' | 'Cancelled'; // Add other statuses if needed
}

export interface SalesTrend {
  month: string;
  revenue: number;
}

export interface DashboardStats {
  cancelledOrders: number;
  completedOrders: number;
  lowStockCount: number;
  pendingOrders: number;
  salesTrends: SalesTrend[];
  totalCustomers: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
}

export interface DashboardData {
  recentOrders: RecentOrder[];
  stats: DashboardStats;
}
