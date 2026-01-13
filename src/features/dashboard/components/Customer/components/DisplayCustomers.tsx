import React, { useEffect, useState } from "react";
import { fetchAllCustomers, selectAllCustomers, setActiveCustomer, setCustomerActiveContent, showPopup3, toggleBlackListCustomer } from "../customerSlice.js";
import { useAppDispatch, useAppSelector } from "../../../../../hooks.js";
import { selectActiveOrganizationId, selectOrganizationStatus } from "../../../../organization/organizationSlice";
import type { Customer } from "../../../dashboardTypes.js";

const DisplayCustomers = () => {
  const dispatch = useAppDispatch();
  const { customers, totalPages, currentPage } = useAppSelector(selectAllCustomers);
  const allCustomers = customers || [];
  const [timeActive, setTimeActive] = useState<boolean>(true);
  const [isBlacklistActive, setBlacklistActive] = useState<boolean>(false);
  //   const pageStatus = useAppSelector(selectStatus2);

  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("createdAt");
  const [order, setOrder] = useState<'asc' | 'desc'>("desc");
  const [page, setPage] = useState<number>(1);

  const activeOrganizationId = useAppSelector(selectActiveOrganizationId);
  const organizationStatus = useAppSelector(selectOrganizationStatus);

  useEffect(() => {
    if (organizationStatus === 'loading' || organizationStatus === 'idle') return;

    if (!activeOrganizationId) {
      dispatch(showPopup3({
        message: "Please Join or Create an Organization first.",
        type: "error",
        visible: true,
        duration: 3000
      }));
      return;
    }
    dispatch(fetchAllCustomers({ page, sort, order, search, limit: 10, isBlacklistActive }));
  }, [dispatch, page, sort, order, search, isBlacklistActive, activeOrganizationId, organizationStatus]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSearchCustomer = () => {
    dispatch(fetchAllCustomers({ page, sort, order, search, isBlacklistActive }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeActive(e.target.value === "createdAt");
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

  const handleEdit = async (customer: Customer) => {
    await dispatch(setActiveCustomer(customer));
    dispatch(setCustomerActiveContent("EditCustomer"));
  };

  const handleBlock = async (id: string) => {
    await dispatch(toggleBlackListCustomer(id));
    dispatch(fetchAllCustomers({ page, sort, order, search, isBlacklistActive }));
    dispatch(
      showPopup3({
        message: isBlacklistActive ? "Customer Removed from Blacklist" : "Customer Added to Blacklist",
        duration: 3000,
        type: "success",
        visible: true,
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
    <div className="max-w-screen p-6 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-md shadow-lg">
      <div className={`mb-6 flex justify-between items-center ${isBlacklistActive ? "gap-3" : "gap-0"} `}>
        <h2 className="text-3xl font-bold">{isBlacklistActive ? "Blacklist" : "Customer List"}</h2>
        <div className={`flex md:text-lg ${isBlacklistActive ? "gap-3" : "gap-4"} `}>
          <button onClick={handleAdd} className={`${isBlacklistActive ? "px-1 py-1" : "px-4 py-1"} md:px-5 md:py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold shadow-md transition-transform duration-300`}>
            New Customer
          </button>
          <button onClick={handleBlacklist} className="px-4 py-1 bg-red-600 hover:bg-red-500 rounded-lg font-semibold shadow-md transition-transform duration-300">
            {isBlacklistActive ? "Customer List" : "Blacklist"}
          </button>
        </div>
      </div>
      <div className="mb-6 p-1.5 bg-gray-900/50 rounded-lg border border-gray-700/50 flex flex-col lg:flex-row gap-4 lg:gap-2">
        {/* Search */}
        <div className="relative flex-grow group w-full lg:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="fa-solid fa-search text-gray-500 group-focus-within:text-blue-400 transition-colors"></i>
          </div>
          <input
            type="text"
            placeholder="Search by name, email, phone..."
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
              <option value="createdAt" className="bg-gray-900 text-white">Time</option>
              <option value="firstName" className="bg-gray-900 text-white">First Name</option>
              <option value="email" className="bg-gray-900 text-white">Email</option>
              <option value="phoneNumber" className="bg-gray-900 text-white">Phone</option>
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
              <option value="asc" className="bg-gray-900 text-white">{timeActive ? "Oldest" : "Ascending"}</option>
              <option value="desc" className="bg-gray-900 text-white">{timeActive ? "Newest" : "Descending"}</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <i className="fa-solid fa-arrow-down-short-wide text-xs text-gray-500"></i>
            </div>
          </div>

          <button
            onClick={handleSearchCustomer}
            className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 rounded-md transition-colors shadow-sm active:bg-gray-800"
            title="Apply Filters"
          >
            <i className="fa-solid fa-rotate-right text-sm"></i>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-sm shadow-lg">
        <table className="w-full bg-gray-800 text-white rounded-sm min-w-[800px] md:min-w-full">
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
                      <button
                        onClick={() => handleEdit(customer)}
                        className="relative group bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition flex items-center gap-1"
                      >
                        <div className="fa-solid fa-edit"></div>
                        <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition z-10 pointer-events-none">
                          Edit
                        </span>
                      </button>

                      <button
                        onClick={() => handleBlock(customer._id)}
                        className="relative group text-white transition flex items-center"
                      >
                        <div className={`px-2 py-1 rounded-md fa-solid text-white ${(!isBlacklistActive) ? "fa-ban bg-red-600" : "fa-check bg-green-600"}`}></div>
                        <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition z-10 pointer-events-none">
                          {(!isBlacklistActive) ? "Block" : "Unblock"}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-6">
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index} onClick={() => handlePageChange(index + 1)} className={`px-4 py-2 mx-1 rounded-md ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-700"} `}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DisplayCustomers;
