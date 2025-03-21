import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchAllProducts,
  selectAllProducts, 
  setActiveProduct, 
  setInventoryActiveContent, 
  showPopup4, 
  toggleDeleteProduct,
  toggleProductStatus
} from "../inventorySlice.js";
import { getAllCategories } from "../inventoryApi.js";

const DisplayProducts = () => {
  const dispatch = useDispatch();
  const { products, totalPages, currentPage } = useSelector(selectAllProducts);
  const allProducts = products || [];
  const [isDeleted, setIsDeleted] = useState(false);
  const [timeActive, setTimeActive] = useState(true);
  const [categories, setCategories] = useState([]);

  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAllProducts({ page, sort, order, search, isDeleted, category, status }));
  }, [dispatch, page, sort, order, search, isDeleted, category, status]);

  useEffect(() => {
    const getter = async() => {
      const result = await getAllCategories();
      setCategories(result);
      // console.log(allProducts);
    }
    getter();
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategory = (e) => {
    setCategory(e.target.value);
    setPage(1);
  }

  const handleStatus = (e) => {
    setStatus(e.target.value);
    setPage(1);
  }

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

  const handleEdit = async (product) => {
    await dispatch(setActiveProduct(product));
    dispatch(setInventoryActiveContent("EditProduct"));
  };

  const toggleStatus = async (id) => {
    await dispatch(toggleProductStatus(id));
    dispatch(fetchAllProducts({ page, sort, order, search, isDeleted, category, status }));
    dispatch(showPopup4({
      message: "Product Status Updated",
      duration: 3000,
      type: "success",
    }));
  };

  const handleProductDelete = async (id) => {
    await dispatch(toggleDeleteProduct(id));
    dispatch(fetchAllProducts({ page, sort, order, search, isDeleted, category, status }));
    dispatch(showPopup4({
      message: (isDeleted)? "Product Removed from Deleted List" : "Product Deleted",
      duration: 3000,
      type: "success",
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
    <div className="py-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Product List</h2>
        <div className="flex gap-8">
        <button onClick={handleAdd} className="px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          New Product
        </button>
        <button
        onClick={handleDeleted}
        className="px-5 py-3 bg-gradient-to-tr from-yellow-600 to-red-500 text-white rounded-lg font-semibold shadow-md transition-transform duration-300 hover:scale-105 hover:bg-gray-400"
        >
        {(isDeleted)? "Product List":"Deleted List"}
      </button>
      </div>
      </div>

      <div className="flex gap-3 items-center mb-4">
      <input
        type="text"
        placeholder="Search products..."
        className="border px-3 py-2 rounded-md"
        value={search}
        onChange={handleSearch}
        />

      <select value={sort} onChange={handleSortChange} className="border px-3 py-2 rounded-md">
        <option value="createdAt">Time</option>
        <option value="name">Name</option>
        <option value="price">Price</option>
      </select>

      <select value={order} onChange={handleOrderChange} className="border px-3 py-2 rounded-md">
        <option value="asc">{ (timeActive) ? "Oldest" : "Ascending"}</option>
        <option value="desc">{ (timeActive) ? "Newest" : "Descending"}</option>
      </select>

      <select value={category} onChange={handleCategory} className="border px-3 py-2 rounded-md">
        <option value="">All Categories</option>
        {categories.map((cat, index) => (
          <option key={index} value={cat}>
            {cat}
          </option>
        ))}
      </select> 

      <select value={status} onChange={handleStatus} className="border px-3 py-2 rounded-md">
        <option value="">All Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Not Active</option>
      </select>
      </div>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
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
              <tr key={product._id} className="border hover:bg-gray-100 text-center">
                <td className="px-4 py-2"><div className="bg-cover bg-center size-14 rounded-full" style={{backgroundImage: `url(${product.coverImg})`}}></div></td>
                <td className="px-4 py-2 capitalize">{product.name}</td>
                <td className="px-4 py-2">{product.price[0]?.price}</td>
                <td className="px-4 py-2">{product.price[1]?.price || "-"}</td>
                <td className="px-4 py-2">{product.price[2]?.price || "-"}</td>
                <td className="px-4 py-2 capitalize">{product.category}</td>
                <td className="px-4 py-2">{product.quantity}</td>
                <td className="px-4 py-2">{product.discountPercent}</td>
                <td className="px-4 py-2">{(product.price[0].price)-((product.discountPercent/100)*(product.price[0].price))}</td>
                <td className="px-4 py-2 text-xl"><div className={`px-2 py-1 rounded-md fa-solid text-white ${(product.status == "Active") ? "fa-check bg-green-600" : "fa-xmark bg-red-600"}`}></div> </td>

                <td className="flex flex-row items-stretch px-4 py-5 gap-1">
                <button
                onClick={() => handleEdit(product)}
                className="relative group bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition flex items-center gap-1"
                >
                  <div className="fa-solid fa-edit"></div>
                  <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-gray-100 text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                    Edit
                  </span>
                </button>
                
                <button
                onClick={() => toggleStatus(product._id)}
                className="relative group text-white transition flex items-center"
                >
                  <div className={`px-2 py-1 rounded-md fa-solid text-white ${(product.status === "Active") ? "fa-xmark bg-red-600" : "fa-check bg-green-600"}`}></div>
                  <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-gray-100 text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                    {(product.status === "Active") ? "Deactiveate" : "Activate"}
                  </span>
                </button>

                <button
                onClick={() => handleProductDelete(product._id)}
                className="relative group bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition flex items-center gap-1"
                >
                  <div className="fa-solid fa-ban"></div>
                  <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-gray-100 text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                    {(product.isDeleted)? "Restore" : "Delete"}
                  </span>
                </button>

                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="text-center py-4">
                No products found.
              </td>
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
    </div>
  );
};

export default DisplayProducts;
