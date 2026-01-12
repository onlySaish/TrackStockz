import React, { useEffect, useState } from "react";
import {
  fetchAllProducts,
  selectAllProducts,
  selectStatus3,
  setActiveProduct,
  setInventoryActiveContent,
  showPopup4,
  toggleDeleteProduct,
  toggleProductStatus
} from "../inventorySlice.js";
import { getAllCategories } from "../inventoryApi.js";
import { useAppDispatch, useAppSelector } from "../../../../../hooks.js";
import { selectActiveOrganizationId, selectOrganizationStatus } from "../../../../organization/organizationSlice";
import type { Product } from "../../../dashboardTypes.js";

const DisplayProducts = () => {
  const dispatch = useAppDispatch();
  const { products, totalPages, currentPage } = useAppSelector(selectAllProducts);
  const allProducts = products || [];
  const pageStatus = useAppSelector(selectStatus3);

  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [timeActive, setTimeActive] = useState<boolean>(true);
  const [categories, setCategories] = useState<string[]>([]);

  const [category, setCategory] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("createdAt");
  const [order, setOrder] = useState<'asc' | 'desc'>("desc");
  const [page, setPage] = useState<number>(1);

  const activeOrganizationId = useAppSelector(selectActiveOrganizationId);
  const organizationStatus = useAppSelector(selectOrganizationStatus);

  useEffect(() => {
    if (organizationStatus === 'loading' || organizationStatus === 'idle') return;

    if (!activeOrganizationId) {
      dispatch(showPopup4({
        message: "Please Join or Create an Organization first.",
        type: "error",
        visible: true,
        duration: 3000
      }));
      return;
    }
    dispatch(fetchAllProducts({ page, sort, order, search, isDeleted, category, status }));
  }, [dispatch, page, sort, order, isDeleted, category, status, activeOrganizationId, organizationStatus]);

  useEffect(() => {
    if (!activeOrganizationId) return;
    const getter = async () => {
      const result = await getAllCategories();
      setCategories(result);
    };
    getter();
  }, [dispatch, activeOrganizationId]);

  const handleSearchProduct = () => {
    dispatch(fetchAllProducts({ page, sort, order, search, isDeleted, category, status }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setPage(1);
  }

  const handleStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    setPage(1);
  }

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

  const handleEdit = async (product: Product) => {
    await dispatch(setActiveProduct(product));
    dispatch(setInventoryActiveContent("EditProduct"));
  };

  const toggleStatus = async (id: string) => {
    await dispatch(toggleProductStatus(id));
    dispatch(fetchAllProducts({ page, sort, order, search, isDeleted, category, status }));
    dispatch(showPopup4({
      message: "Product Status Updated",
      duration: 3000,
      type: "success",
      visible: true,
    }));
  };

  const handleProductDelete = async (id: string) => {
    await dispatch(toggleDeleteProduct(id));
    dispatch(fetchAllProducts({ page, sort, order, search, isDeleted, category, status }));
    dispatch(showPopup4({
      message: (isDeleted) ? "Product Removed from Deleted List" : "Product Deleted",
      duration: 3000,
      type: "success",
      visible: true,
    }));
  };

  const handleAdd = () => {
    dispatch(setInventoryActiveContent("AddProduct"));
  };

  const handleDeleted = () => {
    setIsDeleted(!isDeleted);
    setCategory("");
    setStatus("");
  };

  return (
    <div className="max-w-screen p-6 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-md shadow-lg">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-3xl font-bold">{isDeleted ? "Deleted Products" : "Product Inventory"}</h2>
        <div className={`flex md:text-lg ${isDeleted ? "gap-3" : "gap-4"}`}>
          <button onClick={handleAdd} className={`${isDeleted ? "px-1 py-1" : "px-5 py-1"} md:px-5 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500`}>
            New Product
          </button>
          <button onClick={handleDeleted} className="px-5 py-1 bg-red-600 hover:bg-red-500 rounded-lg font-semibold shadow-md transition-transform duration-300">
            {isDeleted ? "View Active Products" : "View Deleted"}
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
            placeholder="Search by name, SKU..."
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
              <option value="name" className="bg-gray-900 text-white">Product Name</option>
              <option value="price" className="bg-gray-900 text-white">Price</option>
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

          {/* Category */}
          <div className="relative flex-grow sm:flex-grow-0 min-w-[160px] max-w-[200px]">
            <select
              className="block w-full pl-3 pr-10 py-2.5 text-sm bg-gray-800 border-l border-gray-600 text-white rounded-md focus:outline-none focus:bg-gray-700/50 transition-colors cursor-pointer appearance-none truncate"
              value={category}
              onChange={handleCategory}
            >
              <option value="" className="bg-gray-900 text-white">All Categories</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat} className="bg-gray-900 text-white">
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <i className="fa-solid fa-tag text-xs text-gray-500"></i>
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
              <option value="Active" className="bg-gray-900 text-white">Active</option>
              <option value="Inactive" className="bg-gray-900 text-white">Not Active</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <i className="fa-solid fa-circle-half-stroke text-xs text-gray-500"></i>
            </div>
          </div>

          <button
            onClick={handleSearchProduct}
            className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600 rounded-md transition-colors shadow-sm active:bg-gray-800"
            title="Apply Filters"
          >
            <i className="fa-solid fa-rotate-right text-sm"></i>
          </button>
        </div>
      </div>
      {pageStatus === "loading" ? <p className="text-gray-600">Loading...</p> : (
        <>
          <div className="overflow-x-auto overflow-y-hidden rounded-sm shadow-lg">
            <table className="w-full bg-gray-800 text-white rounded-sm min-w-[1200px] md:min-w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-2">Image</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Active Price</th>
                  <th className="px-4 py-2">Previous Price</th>
                  <th className="px-4 py-2">Earlier Price</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Discount Percent</th>
                  <th className="px-4 py-2">Discounted Price</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allProducts.length > 0 ? (
                  allProducts.map((product) => (
                    <tr key={product._id} className="border-b border-gray-700 hover:bg-gray-900 transition cursor-pointer">
                      <td className="px-4 py-2"><div className="bg-cover bg-center size-14 rounded-full" style={{ backgroundImage: `url(${product.coverImg})` }}></div></td>
                      <td className="px-4 py-2 capitalize text-center">{product.name}</td>
                      <td className="px-4 py-2 text-center">{product.price[0]?.price}</td>
                      <td className="px-4 py-2 text-center">{product.price[1]?.price || "-"}</td>
                      <td className="px-4 py-2 text-center">{product.price[2]?.price || "-"}</td>
                      <td className="px-4 py-2 capitalize text-center">{product.category}</td>
                      <td className="px-4 py-2 text-center">{product.quantity}</td>
                      <td className="px-4 py-2 text-center">{product.discountPercent}%</td>
                      <td className="px-4 py-2 text-center">{(product.price[0].price) - ((product.discountPercent / 100) * (product.price[0].price))}</td>
                      <td className="px-4 py-2 text-xl text-center"><div className={`px-2 py-1 rounded-md fa-solid text-white ${(product.status == "Active") ? "fa-check bg-green-600" : "fa-xmark bg-red-600"}`}></div> </td>
                      <td className="px-4 py-2 text-center">
                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={() => handleEdit(product)}
                            className="relative group bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition flex items-center gap-1"
                          >
                            <div className="fa-solid fa-edit"></div>
                            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                              Edit
                            </span>
                          </button>

                          <button
                            onClick={() => toggleStatus(product._id)}
                            className="relative group text-white transition flex items-center"
                          >
                            <div className={`px-2 py-1 rounded-md fa-solid text-white ${(product.status === "Active") ? "fa-xmark bg-red-600" : "fa-check bg-green-600"}`}></div>
                            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                              {(product.status === "Active") ? "Deactiveate" : "Activate"}
                            </span>
                          </button>

                          <button
                            onClick={() => handleProductDelete(product._id)}
                            className="relative group bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition flex items-center gap-1"
                          >
                            <div className="fa-solid fa-ban"></div>
                            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                              {(product.isDeleted) ? "Restore" : "Delete"}
                            </span>
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="text-center py-4">No products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-6">
            {Array.from({ length: totalPages }, (_, index) => (
              <button key={index} onClick={() => setPage(index + 1)} className={`px-4 py-2 mx-1 rounded-md ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-700"}`}>
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DisplayProducts;
