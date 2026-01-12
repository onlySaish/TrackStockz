import React, { useEffect, useState } from "react";
import {
  fetchAllOrders,
  selectAllOrders,
  selectStatus5,
  setActiveOrder,
  setOrderActiveContent,
  showPopup6,
  updateOrderStatus,
} from "../orderSlice.js";
import { useAppDispatch, useAppSelector } from "../../../../../hooks.js";
import { selectActiveOrganizationId, selectOrganizationStatus } from "../../../../organization/organizationSlice";
import type { Order } from "../../../dashboardTypes.js";

interface finalUpdatedOrder extends Order {
  totalQuantity: number,
}

const DisplayOrders = () => {
  const dispatch = useAppDispatch();
  const { fetchedOrders, totalPages, currentPage } = useAppSelector(selectAllOrders);
  const allOrders: Order[] = fetchedOrders || [];
  const pageStatus = useAppSelector(selectStatus5);

  const calculateTotalQuantity = (orders: Order[]) => {
    return orders.map(order => ({
      ...order,
      totalQuantity: order.products.reduce((acc, product) => acc + product.quantity, 0)
    }));
  };

  const updatedOrders = calculateTotalQuantity(allOrders);
  const [finalUpdatedOrders, setFinalUpdatedOrder] = useState<finalUpdatedOrder[]>([]);

  useEffect(() => {
    setFinalUpdatedOrder(updatedOrders);
  }, [fetchedOrders])

  const [timeActive, setTimeActive] = useState<boolean>(true);
  const [status, setStatus] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("createdAt");
  const [order, setOrder] = useState<'asc' | 'desc'>("desc");
  const [page, setPage] = useState<number>(1);

  const activeOrganizationId = useAppSelector(selectActiveOrganizationId);
  const organizationStatus = useAppSelector(selectOrganizationStatus);

  useEffect(() => {
    if (organizationStatus === 'loading' || organizationStatus === 'idle') return;

    if (!activeOrganizationId) {
      dispatch(showPopup6({
        message: "Please Join or Create an Organization first.",
        type: "error",
        visible: true,
        duration: 3000
      }));
      return;
    }
    dispatch(fetchAllOrders({ page, sort, order, search, status, paymentMethod }));
  }, [dispatch, page, sort, order, status, paymentMethod, activeOrganizationId, organizationStatus]);

  const handleSearchOrder = () => {
    dispatch(fetchAllOrders({ page, sort, order, search, status, paymentMethod }));
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    setPage(1);
  };

  const handlePaymentMethod = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethod(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "createdAt") {
      setTimeActive(true);
    } else {
      setTimeActive(false);
    }
    setSort(e.target.value);
    setPage(1);
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrder(e.target.value as 'asc' | 'desc');
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleView = async (order: finalUpdatedOrder) => {
    await dispatch(setActiveOrder(order));
    dispatch(setOrderActiveContent("ViewOrder"));
  };

  const handleEdit = async (order: finalUpdatedOrder) => {
    if (!(order.status === "Pending")) {
      dispatch(showPopup6({
        visible: true,
        message: `Product Cannot be Updated`,
        duration: 3000,
        type: 'error',
      }));
    } else {
      await dispatch(setActiveOrder(order));
      dispatch(setOrderActiveContent("EditOrder"));
    }
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
    setFinalUpdatedOrder((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="max-w-screen p-6 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-md shadow-lg">
      <h2 className="text-3xl font-bold mb-4">Order List</h2>

      {/* Industrial Style Toolbar - Responsive & Colored */}
      <div className="mb-6 p-1.5 bg-gray-900/50 rounded-lg border border-gray-700/50 flex flex-col lg:flex-row gap-4 lg:gap-2">
        {/* Search */}
        <div className="relative flex-grow group w-full lg:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="fa-solid fa-search text-gray-500 group-focus-within:text-blue-400 transition-colors"></i>
          </div>
          <input
            type="text"
            placeholder="Search by customer, order ID..."
            className="block w-full pl-10 pr-3 py-3 bg-gray-800 border-transparent text-white placeholder-gray-400 rounded-md focus:bg-gray-900 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 sm:text-sm transition-all shadow-inner"
            value={search}
            onChange={handleSearch}
          />
        </div>

        {/* Filter Group */}
        <div className="flex flex-wrap gap-2 items-center justify-start lg:justify-end w-full lg:w-auto">
          {/* Sort Field */}
          <div className="relative flex-grow sm:flex-grow-0 min-w-[140px]">
            <select
              className="block w-full pl-3 pr-10 py-2.5 text-sm bg-gray-800 border-l border-gray-600 text-white rounded-md focus:outline-none focus:bg-gray-700/50 transition-colors cursor-pointer appearance-none"
              value={sort}
              onChange={handleSortChange}
            >
              <option value="createdAt" className="bg-gray-900 text-white">Date Created</option>
              <option value="totalPrice" className="bg-gray-900 text-white">Total Amount</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <i className="fa-solid fa-chevron-down text-xs text-gray-500"></i>
            </div>
          </div>

          {/* Sort Order */}
          <div className="relative flex-grow sm:flex-grow-0 min-w-[130px]">
            <select
              className="block w-full pl-3 pr-10 py-2.5 text-sm bg-gray-800 border-l border-gray-600 text-white rounded-md focus:outline-none focus:bg-gray-700/50 transition-colors cursor-pointer appearance-none"
              value={order}
              onChange={handleOrderChange}
            >
              <option value="asc" className="bg-gray-900 text-white">{timeActive ? "Oldest First" : "Ascending"}</option>
              <option value="desc" className="bg-gray-900 text-white">{timeActive ? "Newest First" : "Descending"}</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <i className="fa-solid fa-arrow-down-short-wide text-xs text-gray-500"></i>
            </div>
          </div>

          {/* Status */}
          <div className="relative flex-grow sm:flex-grow-0 min-w-[120px]">
            <select
              className="block w-full pl-3 pr-10 py-2.5 text-sm bg-gray-800 border-l border-gray-600 text-white rounded-md focus:outline-none focus:bg-gray-700/50 transition-colors cursor-pointer appearance-none"
              value={status}
              onChange={handleStatus}
            >
              <option value="" className="bg-gray-900 text-white">All Status</option>
              <option value="Pending" className="bg-gray-900 text-white">Pending</option>
              <option value="Completed" className="bg-gray-900 text-white">Completed</option>
              <option value="Cancelled" className="bg-gray-900 text-white">Cancelled</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <i className="fa-solid fa-circle-half-stroke text-xs text-gray-500"></i>
            </div>
          </div>

          {/* Payment Method */}
          <div className="relative flex-grow sm:flex-grow-0 min-w-[130px]">
            <select
              className="block w-full pl-3 pr-10 py-2.5 text-sm bg-gray-800 border-l border-gray-600 text-white rounded-md focus:outline-none focus:bg-gray-700/50 transition-colors cursor-pointer appearance-none"
              value={paymentMethod}
              onChange={handlePaymentMethod}
            >
              <option value="" className="bg-gray-900 text-white">All Payments</option>
              <option value="Cash" className="bg-gray-900 text-white">Cash</option>
              <option value="Card" className="bg-gray-900 text-white">Card</option>
              <option value="UPI" className="bg-gray-900 text-white">UPI</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <i className="fa-solid fa-credit-card text-xs text-gray-500"></i>
            </div>
          </div>

          <button
            onClick={handleSearchOrder}
            className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 rounded-md transition-colors shadow-sm active:bg-gray-800"
            title="Apply Filters"
          >
            <i className="fa-solid fa-rotate-right text-sm"></i>
          </button>
        </div>
      </div>

      {pageStatus === "loading" ? <p className="text-gray-600">Loading...</p> : (
        <div className="overflow-x-auto overflow-y-hidden rounded-sm shadow-lg">
          <table className="w-full bg-gray-800 text-white rounded-sm min-w-[1200px] md:min-w-full">
            <thead className="bg-gray-700">
              <tr>
                {/* <th className="px-4 py-2">Order ID</th> */}
                <th className="px-4 py-2">Customer Name</th>
                <th className="px-4 py-2">Customer Company</th>
                <th className="px-4 py-2">Unique Products</th>
                <th className="px-4 py-2">Total Order Quantity</th>
                <th className="px-4 py-2">Total Amount</th>
                <th className="px-4 py-2">Final Price</th>
                <th className="px-4 py-2">Payment Method</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Updated</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {finalUpdatedOrders.length > 0 ? (
                finalUpdatedOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-700 hover:bg-gray-900 transition cursor-pointer text-center">
                    <td className="px-4 py-2">{order.customerDetails.firstName} {order.customerDetails.lastName}</td>
                    <td className="px-4 py-2">{order.customerDetails.companyName}</td>
                    <td className="px-4 py-2">{order.products.length}</td>
                    <td className="px-4 py-2">{order.totalQuantity}</td>
                    <td className="px-4 py-2">{order.totalPrice}</td>
                    <td className="px-4 py-2">{order.finalDiscountedPrice}</td>
                    <td className="px-4 py-2">{order.paymentMethod}</td>
                    <td className="px-4 py-2">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="border px-3 py-2 rounded-md bg-gray-800 border-gray-600"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      {new Date(order.updatedAt).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                    <td className="flex flex-row justify-center items-center px-4 py-2 gap-2">
                      <div className="flex gap-3 justify-center">
                        <button onClick={() => handleView(order)} className="px-4 py-2 bg-blue-500 text-white rounded-lg fa-solid fa-eye"></button>
                        <button onClick={() => handleEdit(order)} className="px-4 py-2 bg-green-500 text-white rounded-lg fa-solid fa-edit"></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center py-4">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 border rounded-md mx-1 ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-700"}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DisplayOrders;
