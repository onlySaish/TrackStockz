import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomers, selectAllCustomers, selectStatus2, setActiveCustomer, setCustomerActiveContent, showPopup3, toggleBlackListCustomer } from "../customerSlice.js";

const DisplayCustomers = () => {
  const dispatch = useDispatch();
  const { customers, totalPages, currentPage, totalCustomers } = useSelector(selectAllCustomers);
  const allCustomers = customers || [];
  const [timeActive, setTimeActive] = useState(true);
  const [isBlacklistActive, setBlacklistActive] = useState(false);
  const pageStatus = useSelector(selectStatus2);
  
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAllCustomers({ page, sort, order, search, isBlacklistActive }));
  }, [dispatch, page, sort, order, isBlacklistActive]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSearchCustomer = () => {
    dispatch(fetchAllCustomers({ page, sort, order, search, isBlacklistActive }));
  };

  const handleSortChange = (e) => {
    setTimeActive(e.target.value === "createdAt");
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

  const handleEdit = async (customer) => {
    await dispatch(setActiveCustomer(customer));
    dispatch(setCustomerActiveContent("EditCustomer"));
  };

  const handleBlock = async (id) => {
    await dispatch(toggleBlackListCustomer(id));
    dispatch(fetchAllCustomers({ page, sort, order, search, isBlacklistActive }));
    dispatch(
      showPopup3({
        message: isBlacklistActive ? "Customer Removed from Blacklist" : "Customer Added to Blacklist",
        duration: 3000,
        type: "success",
      })
    );
  };

  const handleAdd = () => {
    dispatch(setCustomerActiveContent("AddCustomer"));
  };

  const handleBlacklist = () => {
    setBlacklistActive(!isBlacklistActive);
  };

  return (
    <div className="p-6 m-4 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-lg shadow-lg">
      <div className="flex justify-between mb-6 items-center">
        <h2 className="text-3xl font-bold">{isBlacklistActive ? "Blacklist" : "Customer List"}</h2>
        <div className="flex gap-4">
          <button onClick={handleAdd} className="px-5 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold shadow-md transition-transform duration-300">
            New Customer
          </button>
          <button onClick={handleBlacklist} className="px-5 py-3 bg-red-600 hover:bg-red-500 rounded-lg font-semibold shadow-md transition-transform duration-300">
            {isBlacklistActive ? "Customer List" : "Blacklist"}
          </button>
        </div>
      </div>

      <div className="mb-6 flex gap-4">
        <input type="text" placeholder="Search customers..." className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600" value={search} onChange={handleSearch} />
        
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

      {/* <div className="mb-6 flex gap-4 items-center">
      <select className="border px-3 py-2 rounded-md bg-gray-800" value={sort} onChange={handleSortChange}>
          <option value="createdAt">Time</option>
          <option value="firstName">First Name</option>
          <option value="email">Email</option>
          <option value="phoneNumber">Phone</option>
        </select>

      <select className="border px-3 py-2 rounded-md bg-gray-800" value={order} onChange={handleOrderChange}>
        <option value="asc">{ (timeActive) ? "Oldest" : "Ascending"}</option>
        <option value="desc">{ (timeActive) ? "Newest" : "Descending"}</option>
      </select>
      </div> */}

      <div className="overflow-y-auto rounded-sm shadow-lg">
        <table className="w-full bg-gray-800 text-white rounded-sm">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2">Full Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Company</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allCustomers.length > 0 ? (
              allCustomers.map((customer) => (
                <tr key={customer._id} className="border-b border-gray-700 hover:bg-gray-900">
                  <td className="px-4 py-2">{customer.firstName} {customer.lastName}</td>
                  <td className="px-4 py-2 text-center">{customer.email}</td>
                  <td className="px-4 py-2 text-center">{customer.phoneNumber}</td>
                  <td className="px-4 py-2 text-center">{customer.companyName || "N/A"}</td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex gap-3 justify-center">
                      <button onClick={() => handleEdit(customer)} className="bg-blue-500 hover:bg-blue-400 text-white px-3 py-2 rounded-md">
                        Edit
                      </button>
                      <button onClick={() => handleBlock(customer._id)} className="bg-red-500 hover:bg-red-400 text-white px-3 py-2 rounded-md">
                        {isBlacklistActive ? "Unblock" : "Block"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index} onClick={() => handlePageChange(index + 1)} className={`px-4 py-2 mx-1 rounded-md ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-700"}`}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DisplayCustomers;
