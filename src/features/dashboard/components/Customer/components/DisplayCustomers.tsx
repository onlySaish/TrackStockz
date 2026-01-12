import React, { useEffect, useState } from "react";
import { fetchAllCustomers, selectAllCustomers, setActiveCustomer, setCustomerActiveContent, showPopup3, toggleBlackListCustomer } from "../customerSlice.js";
import { useAppDispatch, useAppSelector } from "../../../../../hooks.js";
import { selectActiveOrganizationId, selectOrganizationStatus } from "../../../../organization/organizationSlice";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
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
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-lg shadow-lg">
      <div className={`py-6 px-2 md:px-6 flex justify-between items-center ${isBlacklistActive ? "gap-3" : "gap-0"} `}>
        <h2 className="text-3xl md:text-4xl font-bold">{isBlacklistActive ? "Blacklist" : "Customer List"}</h2>
        <div className={`flex md:text-lg ${isBlacklistActive ? "gap-3" : "gap-4"} `}>
          <button onClick={handleAdd} className={`${isBlacklistActive ? "px-1 py-1" : "px-4 py-1"} md:px-5 md:py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold shadow-md transition-transform duration-300`}>
            New Customer
          </button>
          <button onClick={handleBlacklist} className="px-4 py-1 bg-red-600 hover:bg-red-500 rounded-lg font-semibold shadow-md transition-transform duration-300">
            {isBlacklistActive ? "Customer List" : "Blacklist"}
          </button>
        </div>
      </div>
      <div className="py-6 px-2 md:px-6 mb-6 flex flex-col md:flex-row gap-4">
        <input type="text" placeholder="Search customers..." className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600" value={search} onChange={handleSearch} />

        <div className="flex gap-4 justify-start items-center">
          <select className="border px-3 py-2 rounded-md bg-gray-800 border-gray-600" value={sort} onChange={handleSortChange}>
            <option value="createdAt">Time</option>
            <option value="firstName">First Name</option>
            <option value="email">Email</option>
            <option value="phoneNumber">Phone</option>
          </select>

          <select className="border px-3 py-2 rounded-md bg-gray-800 border-gray-600" value={order} onChange={handleOrderChange}>
            <option value="asc">{(timeActive) ? "Oldest" : "Ascending"}</option>
            <option value="desc">{(timeActive) ? "Newest" : "Descending"}</option>
          </select>

          <button onClick={handleSearchCustomer} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-400 transition">
            Search
          </button>
        </div>
      </div>
      <div className="overflow-y-auto rounded-sm shadow-lg lg:px-6">
        <Table className="w-full bg-gray-800 text-white rounded-sm">
          <Thead className="bg-gray-700">
            <Tr>
              <Th className="px-4 py-2">Full Name</Th>
              <Th className="px-4 py-2">Email</Th>
              <Th className="px-4 py-2">Phone</Th>
              <Th className="px-4 py-2">Company</Th>
              <Th className="px-4 py-2">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {allCustomers.length > 0 ? (
              allCustomers.map((customer) => (
                <Tr key={customer._id} className="border-b border-gray-700 hover:bg-gray-900">
                  <Td className="px-4 py-2">{customer.firstName} {customer.lastName}</Td>
                  <Td className="px-4 py-2 text-center">{customer.email}</Td>
                  <Td className="px-4 py-2 text-center">{customer.phoneNumber}</Td>
                  <Td className="px-4 py-2 text-center">{customer.companyName || "N/A"}</Td>
                  <Td className="px-4 py-2 text-center">
                    <div className="flex gap-3 justify-center">
                      <button onClick={() => handleEdit(customer)} className="bg-blue-500 hover:bg-blue-400 text-white px-3 py-2 rounded-md">
                        Edit
                      </button>
                      <button onClick={() => handleBlock(customer._id)} className="bg-red-500 hover:bg-red-400 text-white px-3 py-2 rounded-md">
                        {isBlacklistActive ? "Unblock" : "Block"}
                      </button>
                    </div>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={5} className="text-center py-4">No customers found.</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </div>
      <div className="flex justify-center mt-6 pb-6">
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
