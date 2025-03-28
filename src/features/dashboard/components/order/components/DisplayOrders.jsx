import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrders,
  selectAllOrders,
  selectStatus5,
  setActiveOrder,
  setOrderActiveContent,
  showPopup6,
  updateOrderStatus,
} from "../orderSlice.js";

const DisplayOrders = () => {
  const dispatch = useDispatch();
  const { fetchedOrders, totalPages, currentPage } = useSelector(selectAllOrders);
  const allOrders = fetchedOrders || [];
  const pageStatus = useSelector(selectStatus5);

  const calculateTotalQuantity = (orders) => {
    return orders.map(order => ({
      ...order,
      totalQuantity: order.products.reduce((acc, product) => acc + product.quantity, 0)
    }));
  };

  const updatedOrders = calculateTotalQuantity(allOrders);
  const [finalUpdatedOrders, setFinalUpdatedOrder] = useState([]);

  useEffect(() => {
    setFinalUpdatedOrder(updatedOrders);
  },[fetchedOrders])

  const [timeActive, setTimeActive] = useState(true);
  const [status, setStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAllOrders({ page, sort, order, search, status, paymentMethod }));
  }, [dispatch, page, sort, order, status, paymentMethod]);

  const handleSearchOrder = () => {
    dispatch(fetchAllOrders({ page, sort, order, search, status, paymentMethod }));
  } 

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatus = (e) => {
    setStatus(e.target.value);
    setPage(1);
  };

  const handlePaymentMethod = (e) => {
    setPaymentMethod(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    if (e.target.value === "createdAt"){
      setTimeActive(true);
    }else {
      setTimeActive(false); 
    }
    setSort(e.target.value);
    setPage(1);
  };

  const handleOrderChange = (e) => {
    setOrder(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleView = async (order) => {
    await dispatch(setActiveOrder(order));
    dispatch(setOrderActiveContent("ViewOrder"));
  };

  const handleEdit = async (order) => {
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

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
    setFinalUpdatedOrder((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="py-4">
      <h2 className="text-3xl font-bold mb-4">Order List</h2>
        
      <div className="flex gap-3 items-center mb-4">
        <input
          type="text"
          placeholder="Search orders..."
          className="border px-3 py-2 rounded-md"
          value={search}
          onChange={handleSearch}
        />

        <button
          onClick={handleSearchOrder}
          className="relative group bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition flex items-center gap-1"
          >
            <div>Search</div>
        </button>

        <select value={sort} onChange={handleSortChange} className="border px-3 py-2 rounded-md">
          <option value="createdAt">Time</option>
          <option value="totalPrice">Amount</option>
        </select>

        <select value={order} onChange={handleOrderChange} className="border px-3 py-2 rounded-md">
        <option value="asc">{ (timeActive) ? "Oldest" : "Ascending"}</option>
        <option value="desc">{ (timeActive) ? "Newest" : "Descending"}</option>
        </select>

        <select value={status} onChange={handleStatus} className="border px-3 py-2 rounded-md">
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <select value={paymentMethod} onChange={handlePaymentMethod} className="border px-3 py-2 rounded-md">
          <option value="">All Payments</option>
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
          <option value="UPI">UPI</option>
        </select>
      </div>

      {pageStatus === "loading" ? <p className="text-gray-600">Loading...</p> :(
        <>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
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
              <tr key={order._id} className="border hover:bg-gray-100 text-center">
                {/* <td className="px-4 py-2">{order._id}</td> */}
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
                    className="border px-2 py-1 rounded-md"
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
                  <button onClick={() => handleView(order)} className="px-4 py-2 bg-blue-500 text-white rounded-lg fa-solid fa-eye"></button>
                  <button onClick={() => handleEdit(order)} className="px-4 py-2 bg-green-500 text-white rounded-lg fa-solid fa-edit"></button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center py-4">No orders found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 border rounded-md mx-1 ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            {index + 1}
          </button>
        ))}
      </div>   
      </>
    )}
    </div>
  );
};

export default DisplayOrders;
