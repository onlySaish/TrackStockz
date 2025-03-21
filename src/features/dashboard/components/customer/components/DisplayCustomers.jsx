import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomers, selectAllCustomers, setActiveCustomer, setCustomerActiveContent, showPopup3, toggleBlackListCustomer } from "../customerSlice.js";

const DisplayCustomers = () => {
  const dispatch = useDispatch();
  const { customers, totalPages, currentPage, totalCustomers } = useSelector(selectAllCustomers);
  const allCustomers = customers || [];
  const [timeActive, setTimeActive] = useState(true);
  const [isBlacklistActive, setBlacklistActive] = useState(false);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAllCustomers({page:page, sort:sort, order:order, search:search, isBlacklistActive:isBlacklistActive}));
  }, [dispatch, page, sort, order, search, isBlacklistActive]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when searching
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

  const handleEdit = async(customer) => {
    await dispatch(setActiveCustomer(customer));
    dispatch(setCustomerActiveContent("EditCustomer"));
  };

  const handleViewOrders = (id) => {
    dispatch(setActiveCustomer(id));
    // dispatch(setCustomerActiveContent("ViewCustomerOrders"));
  };

  const handleBlock = async(id) => {
    // console.log("Blacklisting customer ID:", id);
    await dispatch(toggleBlackListCustomer(id));
    dispatch(fetchAllCustomers({page:page, sort:sort, order:order, search:search, isBlacklistActive:isBlacklistActive}));
    dispatch(showPopup3({
      message: (isBlacklistActive)? "Customer Removed from Blacklist" : "Customer Added to Blacklist",
      duration: 3000,
      type: "success",
    }))
  };

  const handleAdd = () => {
      dispatch(setCustomerActiveContent("AddCustomer"));
  };

  const handleBlacklist = () => {
    setBlacklistActive(!isBlacklistActive);
  }

  return (
    <div className="p-4">
      <div className="flex flex-row justify-between mb-4 items-center">
      <h2 className="text-3xl font-bold">Customer List</h2>
      <div className="flex gap-8">
      <button
        onClick={handleAdd}
        className="px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow-md transition-transform duration-300 hover:scale-105 hover:bg-gray-400"
        >
        New Customer
      </button>
      <button
        onClick={handleBlacklist}
        className="px-5 py-3 bg-gradient-to-tr from-yellow-600 to-red-500 text-white rounded-lg font-semibold shadow-md transition-transform duration-300 hover:scale-105 hover:bg-gray-400"
        >
        Blacklist
      </button>
      </div>
      </div>

      <div className="mb-4 flex gap-3">
      {/* Search Bar */}
      <input
          type="text"
          placeholder="Search customers..."
          className="border px-3 py-2 rounded-md"
          value={search}
          onChange={handleSearch}
        />

      {/* Sorting */}
      <select className="border px-3 py-2 rounded-md" value={sort} onChange={handleSortChange}>
          <option value="createdAt">Time</option>
          <option value="firstName">First Name</option>
          <option value="email">Email</option>
          <option value="phoneNumber">Phone</option>
        </select>

      {/* Order Asc/Desc */}
      <select className="border px-3 py-2 rounded-md" value={order} onChange={handleOrderChange}>
        <option value="asc">{ (timeActive) ? "Oldest" : "Ascending"}</option>
        <option value="desc">{ (timeActive) ? "Newest" : "Descending"}</option>
      </select>
      
      </div>
      {/* Table */}
      <div className="overflow-x-hidden overflow-y-hidden">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Full Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">Company</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allCustomers.length > 0 ? (
              allCustomers.map((customer) => (
                <tr key={customer._id} className="border hover:bg-gray-100 transition">
                  <td className="px-4 py-2 capitalize">{customer.firstName} {customer.lastName}</td>
                  <td className="text-center px-4 py-2">{customer.email}</td>
                  <td className="text-center px-4 py-2">{customer.phoneNumber}</td>
                  <td className="px-4 py-2">
                    {customer.address
                      ? `${customer.address.street}, ${customer.address.city}, ${customer.address.state}, ${customer.address.zipCode}, ${customer.address.country}`
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2 capitalize">{customer.companyName || "N/A"}</td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex gap-2 justify-center">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEdit(customer)}
                        className="relative group bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition flex items-center gap-1"
                      >
                        <div className="fa-solid fa-edit"></div>
                        <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-gray-100 text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                          Edit
                        </span>
                      </button>

                      {/* View Orders Button */}
                      <button
                        onClick={() => handleViewOrders(customer._id)}
                        className="relative group bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 transition flex items-center gap-1"
                      >
                        <div className="fa-solid fa-eye"></div>
                        <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-gray-100 text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                          View Orders
                        </span>
                      </button>

                      {/* Blacklist Button */}
                      <button
                        onClick={() => handleBlock(customer._id)}
                        className="relative group bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition flex items-center gap-1"
                      >
                        <div className="fa-solid fa-ban"></div>
                        <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-gray-100 text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                          {(isBlacklistActive)? "UnBlock" : "Block"}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : ( 
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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

    </div>
  );
};

export default DisplayCustomers;