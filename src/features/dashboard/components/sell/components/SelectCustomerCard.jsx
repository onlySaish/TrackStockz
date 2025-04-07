import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchAllCustomers, selectAllCustomers } from "../../customer/customerSlice.js";
import AddCustomer from "../../customer/components/AddCustomerCard.jsx";
import { setSelectedCustomer, showPopup5 } from "../sellSlice.js";

const SelectCustomerCard = () => {
  const dispatch = useDispatch();
  const { customers, totalPages, currentPage, totalCustomers } = useSelector(selectAllCustomers);
  const allCustomers = customers || [];
  const [timeActive, setTimeActive] = useState(true);
  const [showInnerComponent, setShowInnerComponent] = useState(false);
  const [showAddCustComponent, setShowAddCustComponent] = useState(false);
  const [activeCustomer, setActiveCustomer] = useState(null);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAllCustomers({page, limit:3, sort, order, search, isBlacklistActive:false}));
  }, [dispatch, page, sort, order]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handleSearchCustomer = () => {
    dispatch(fetchAllCustomers({ page, limit:3, sort, order, search, isBlacklistActive:false }));
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

  const handleInnerComponent = () => {
    setShowInnerComponent((prev) => !prev);
    setShowAddCustComponent(false);
  };

  const handleAddCustComponent = () => {
    setShowAddCustComponent((prev) => !prev);
    setShowInnerComponent(false);
  }

  const handleSelectedCustomer = (customerId) => {
    dispatch(setSelectedCustomer(customerId));
    const cust = allCustomers.filter((e) => e._id === customerId);
    setActiveCustomer(cust[0]);
    dispatch(showPopup5({
      message: "Customer Selected",
      duration: 3000,
      type: "success",
    }))
  }

  return (
  <div>   

    <div className="flex items-center justify-between px-10 py-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-md h-20 mx-auto border border-gray-800 bg-clip-padding hover:shadow-3xl mb-4 cursor-pointer"
      onClick={handleInnerComponent}>
        <div className="text-3xl font-bold text-white">Select Customer</div>
      <div className="flex gap-4">
        {activeCustomer && <div className="capitalize px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow-md cursor-default">Selected: {activeCustomer.firstName} {activeCustomer.lastName}</div>}
      <button
        onClick={(e) => {e.stopPropagation(); handleAddCustComponent();}}
        className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow-md transition-transform duration-300 hover:scale-105"
        >
        New Customer
      </button>
      </div>
    </div>

    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: showInnerComponent ? 1 : 0, height: showInnerComponent ? "auto" : 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden"
    >
    <div className="w-full flex flex-col text-white bg-gradient-to-br from-gray-800 to-gray-900 items-center shadow-2xl rounded-md border border-gray-900 py-4 mb-4">
      <div className="w-full mb-4 flex gap-3 px-12">
      {/* Search Bar */}
      <input
          type="text"
          placeholder="Search customers..."
          className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
          value={search}
          onChange={handleSearch}
        />

      {/* Sorting */}
      <select className="border px-3 py-2 rounded-md bg-gray-800 border-gray-600" value={sort} onChange={handleSortChange}>
          <option value="createdAt">Time</option>
          <option value="firstName">First Name</option>
          <option value="email">Email</option>
          <option value="phoneNumber">Phone</option>
        </select>

      {/* Order Asc/Desc */}
      <select className="border px-3 py-2 rounded-md bg-gray-800 border-gray-600" value={order} onChange={handleOrderChange}>
        <option value="asc">{ (timeActive) ? "Oldest" : "Ascending"}</option>
        <option value="desc">{ (timeActive) ? "Newest" : "Descending"}</option>
      </select>

      <button onClick={handleSearchCustomer} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-400 transition">
        Search
      </button>
      </div>
      
      {/* Table */}
      <div className="overflow-x-hidden overflow-y-hidden w-11/12">
        <table className="w-full bg-gray-800 text-white rounded-sm">
          <thead className="bg-gray-700">
            <tr>
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
                <tr key={customer._id} className="border-b border-gray-700 hover:bg-gray-900 transition cursor-pointer">
                  <td className="px-4 py-2 capitalize">{customer.firstName} {customer.lastName}</td>
                  <td className="text-center px-4 py-2">{customer.email}</td>
                  <td className="text-center px-4 py-2">{customer.phoneNumber}</td>
                  <td className="px-4 py-2">
                    {customer.address
                      ? `${customer.address.street}, ${customer.address.city}, ${customer.address.state}, ${customer.address.zipCode}, ${customer.address.country}`
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2 capitalize">{customer.companyName || "N/A"}</td>

                  <td className="flex flex-row justify-center py-5">
                  <button
                  onClick={() => handleSelectedCustomer(customer._id)}
                  className="relative group bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-500 transition flex items-center gap-1"
                  >
                    <div>Select</div>
                  </button>
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
            className={`px-4 py-2 border rounded-md mx-1 ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-700"}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      </div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: showAddCustComponent ? 1 : 0, height: showAddCustComponent ? "auto" : 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden"
    >
      <AddCustomer/>
    </motion.div>
  </div>
  );
};

export default SelectCustomerCard