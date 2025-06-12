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
import type { Product } from "../../../dashboardTypes.js";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'

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

  useEffect(() => {
    dispatch(fetchAllProducts({ page, sort, order, search, isDeleted, category, status }));
  }, [dispatch, page, sort, order, isDeleted, category, status]);

  useEffect(() => {
    const getter = async () => {
      const result = await getAllCategories();
      setCategories(result);
    };
    getter();
  }, [dispatch]);

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
    if (e.target.value === "createdAt"){
      setTimeActive(true);
    }else {
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
      message: (isDeleted)? "Product Removed from Deleted List" : "Product Deleted",
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
    <div className="max-w-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-md shadow-lg">
      <div className="py-6 px-2 md:px-6 flex justify-between items-center">
        <h2 className="text-3xl md:text-4xl font-bold">{isDeleted ? "Deleted Products" : "Product Inventory"}</h2>
        <div className={`flex md:text-lg ${isDeleted ? "gap-3" : "gap-4"}`}>
        <button onClick={handleAdd} className={`${isDeleted ? "px-1 py-1" : "px-5 py-1"} md:px-5 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500`}>
          New Product
        </button>
        <button onClick={handleDeleted} className="px-5 py-1 bg-red-600 hover:bg-red-500 rounded-lg font-semibold shadow-md transition-transform duration-300">
          {isDeleted ? "View Active Products" : "View Deleted"}
        </button>
        </div>
      </div>
      <div className="py-6 px-2 md:px-6 flex flex-col items-start gap-4">
        <input type="text" placeholder="Search products..." className="w-full md:w-11/12 lg:w-9/12 px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600" value={search} onChange={handleSearch} />
        <div className="flex flex-wrap gap-4 justify-start items-center">
          <select className="border px-3 py-2 rounded-md bg-gray-800 border-gray-600" value={sort} onChange={handleSortChange}>
            <option value="createdAt">Time</option>
            <option value="name">Product Name</option>
            <option value="price">Price</option>
          </select>
          
          <select className="border px-3 py-2 rounded-md bg-gray-800 border-gray-600" value={order} onChange={handleOrderChange}>
            <option value="asc">{timeActive ? "Oldest" : "Ascending"}</option>
            <option value="desc">{timeActive ? "Newest" : "Descending"}</option>
          </select>
    
          <select value={category} onChange={handleCategory} className="border px-3 py-2 rounded-md bg-gray-800 border-gray-600">
            <option value="">All Categories</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select> 
          
          <select value={status} onChange={handleStatus} className="border px-3 py-2 rounded-md bg-gray-800 border-gray-600">
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Not Active</option>
          </select>
          
          <button onClick={handleSearchProduct} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-400 transition">
            Search
          </button>
        </div>
      </div>
      {pageStatus === "loading" ? <p className="text-gray-600">Loading...</p> :(
      <>
      <div className="overflow-x-auto overflow-y-hidden rounded-sm shadow-lg lg:px-6">
        <Table className="w-full bg-gray-800 text-white rounded-sm">
          <Thead className="bg-gray-700">
            <Tr>
              <Th className="px-4 py-2">Image</Th>
              <Th className="px-4 py-2">Name</Th>
              <Th className="px-4 py-2">Active Price</Th>
              <Th className="px-4 py-2">Previous Price</Th>
              <Th className="px-4 py-2">Earlier Price</Th>
              <Th className="px-4 py-2">Category</Th>
              <Th className="px-4 py-2">Quantity</Th>
              <Th className="px-4 py-2">Discount Percent</Th>
              <Th className="px-4 py-2">Discounted Price</Th>
              <Th className="px-4 py-2">Status</Th>
              <Th className="px-4 py-2">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {allProducts.length > 0 ? (
              allProducts.map((product) => (
                <Tr key={product._id} className="border-b border-gray-700 hover:bg-gray-900 transition cursor-pointer">
                  <Td className="px-4 py-2"><div className="bg-cover bg-center size-14 rounded-full" style={{backgroundImage: `url(${product.coverImg})`}}></div></Td>
                  <Td className="px-4 py-2 capitalize text-center">{product.name}</Td>
                  <Td className="px-4 py-2 text-center">{product.price[0]?.price}</Td>
                  <Td className="px-4 py-2 text-center">{product.price[1]?.price || "-"}</Td>
                  <Td className="px-4 py-2 text-center">{product.price[2]?.price || "-"}</Td>
                  <Td className="px-4 py-2 capitalize text-center">{product.category}</Td>
                  <Td className="px-4 py-2 text-center">{product.quantity}</Td>
                  <Td className="px-4 py-2 text-center">{product.discountPercent}%</Td>
                  <Td className="px-4 py-2 text-center">{(product.price[0].price)-((product.discountPercent/100)*(product.price[0].price))}</Td>
                  <Td className="px-4 py-2 text-xl text-center"><div className={`px-2 py-1 rounded-md fa-solid text-white ${(product.status == "Active") ? "fa-check bg-green-600" : "fa-xmark bg-red-600"}`}></div> </Td>
                  <Td className="px-4 py-2 text-center">
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
                          {(product.isDeleted)? "Restore" : "Delete"}
                        </span>
                      </button>

                    </div>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={11} className="text-center py-4">No products found.</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </div>

      <div className="flex justify-center mt-6 pb-6">
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
