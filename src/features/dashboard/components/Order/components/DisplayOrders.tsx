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
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'

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

      <div className="mb-6 flex flex-col lg:flex-row gap-4">
        <input
          type="text"
          placeholder="Search orders..."
          className="w-full lg:w-1/3 px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
          value={search}
          onChange={handleSearch}
        />

        <div className="flex flex-wrap gap-4 justify-start items-center">
          <select value={sort} onChange={handleSortChange} className="border px-3 py-2 rounded-md bg-gray-800 border-gray-600">
            <option value="createdAt">Time</option>
            <option value="totalPrice">Amount</option>
          </select>

          <select value={order} onChange={handleOrderChange} className="border px-3 py-2 rounded-md bg-gray-800 border-gray-600">
            <option value="asc">{(timeActive) ? "Oldest" : "Ascending"}</option>
            <option value="desc">{(timeActive) ? "Newest" : "Descending"}</option>
          </select>

          <select value={status} onChange={handleStatus} className="border px-3 py-2 rounded-md bg-gray-800 border-gray-600">
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select value={paymentMethod} onChange={handlePaymentMethod} className="border px-3 py-2 rounded-md bg-gray-800 border-gray-600">
            <option value="">All Payments</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
          </select>

          <button
            onClick={handleSearchOrder}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-400 transition"
          >
            <div>Search</div>
          </button>
        </div>
      </div>

      {pageStatus === "loading" ? <p className="text-gray-600">Loading...</p> : (
        <div className="overflow-x-auto overflow-y-hidden rounded-sm shadow-lg">
          <Table className="w-full bg-gray-800 text-white rounded-sm">
            <Thead className="bg-gray-700">
              <Tr>
                {/* <Th className="px-4 py-2">Order ID</Th> */}
                <Th className="px-4 py-2">Customer Name</Th>
                <Th className="px-4 py-2">Customer Company</Th>
                <Th className="px-4 py-2">Unique Products</Th>
                <Th className="px-4 py-2">Total Order Quantity</Th>
                <Th className="px-4 py-2">Total Amount</Th>
                <Th className="px-4 py-2">Final Price</Th>
                <Th className="px-4 py-2">Payment Method</Th>
                <Th className="px-4 py-2">Status</Th>
                <Th className="px-4 py-2">Updated</Th>
                <Th className="px-4 py-2">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {finalUpdatedOrders.length > 0 ? (
                finalUpdatedOrders.map((order) => (
                  <Tr key={order._id} className="border-b border-gray-700 hover:bg-gray-900 transition cursor-pointer text-center">
                    <Td className="px-4 py-2">{order.customerDetails.firstName} {order.customerDetails.lastName}</Td>
                    <Td className="px-4 py-2">{order.customerDetails.companyName}</Td>
                    <Td className="px-4 py-2">{order.products.length}</Td>
                    <Td className="px-4 py-2">{order.totalQuantity}</Td>
                    <Td className="px-4 py-2">{order.totalPrice}</Td>
                    <Td className="px-4 py-2">{order.finalDiscountedPrice}</Td>
                    <Td className="px-4 py-2">{order.paymentMethod}</Td>
                    <Td className="px-4 py-2">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="border px-3 py-2 rounded-md bg-gray-800 border-gray-600"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </Td>
                    <Td className="px-4 py-2">
                      {new Date(order.updatedAt).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </Td>
                    <Td className="flex flex-row justify-center items-center px-4 py-2 gap-2">
                      <div className="flex gap-3 justify-center">
                        <button onClick={() => handleView(order)} className="px-4 py-2 bg-blue-500 text-white rounded-lg fa-solid fa-eye"></button>
                        <button onClick={() => handleEdit(order)} className="px-4 py-2 bg-green-500 text-white rounded-lg fa-solid fa-edit"></button>
                      </div>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={10} className="text-center py-4">No orders found.</Td>
                </Tr>
              )}
            </Tbody>
          </Table>
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
